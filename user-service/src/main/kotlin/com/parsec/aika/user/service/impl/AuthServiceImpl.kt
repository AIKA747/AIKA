package com.parsec.aika.user.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.core.date.DateUtil
import cn.hutool.core.date.LocalDateTimeUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.lang.Validator
import cn.hutool.core.util.StrUtil
import cn.hutool.crypto.digest.DigestUtil
import cn.hutool.json.JSONUtil
import cn.hutool.jwt.JWTPayload
import cn.hutool.jwt.JWTUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.constant.RedisCont
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.utils.FacebookUtil
import com.parsec.aika.common.utils.IOSToeknUtils
import com.parsec.aika.user.gorse.GorseService
import com.parsec.aika.user.mapper.AppUserMapper
import com.parsec.aika.user.mapper.FollowerMapper
import com.parsec.aika.user.model.entity.AppUserInfo
import com.parsec.aika.user.model.entity.CodeType
import com.parsec.aika.user.model.entity.Follower
import com.parsec.aika.user.model.entity.PlatformType
import com.parsec.aika.user.model.vo.req.*
import com.parsec.aika.user.model.vo.resp.AppUserResp
import com.parsec.aika.user.model.vo.resp.LoginType
import com.parsec.aika.user.remote.ContentFeignClient
import com.parsec.aika.user.remote.OrderFeignClient
import com.parsec.aika.user.service.*
import com.parsec.trantor.common.response.BaseResultCode
import com.parsec.trantor.exception.core.AuthException
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*
import java.util.concurrent.TimeUnit
import javax.annotation.Resource

@Service
class AuthServiceImpl : AuthService {

    @Autowired
    private lateinit var gorseService: GorseService

    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var appUserMapper: AppUserMapper

    @Autowired
    private lateinit var codeDicService: CodeDicService

    @Autowired
    private lateinit var thirdPlatformService: ThirdPlatformService

    @Autowired
    private lateinit var interestItemService: InterestItemService

    @Resource
    private lateinit var orderFeignClient: OrderFeignClient

    @Resource
    private lateinit var syncAuthorService: SyncAuthorService

    @Resource
    private lateinit var contentFeignClient: ContentFeignClient

    @Resource
    private lateinit var followerMapper: FollowerMapper

    @Resource
    private lateinit var firebaseUserTokenService: FirebaseUserTokenService

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    @Value("\${jwt.key}")
    private lateinit var jwtKey: String

    @Value("\${jwt.expireDays:30}")
    private var expireDays: Int = 30

    @Value("\${jwt.oldTokenExpireSeconds:300}")
    private var oldTokenExpireSeconds: Long = 300

    private val INIT_PWD = "AiKA@123456.kz"

    override fun appLoginByPwd(account: String, password: String, country: String?, language: String?): AppUserResp {
        //查询用户信息
        val queryWrapper = KtQueryWrapper(AppUserInfo::class.java)
        //判断是否为邮箱
        if (Validator.isEmail(account)) queryWrapper.eq(AppUserInfo::email, account)
        else queryWrapper.eq(AppUserInfo::phone, account)
        val appUserInfo = appUserMapper.selectOne(queryWrapper.orderByDesc(AppUserInfo::id).last("limit 1"))
        Assert.notNull(appUserInfo, "Invalid account or password")
        //校验用户状态
        Assert.state(appUserInfo.status != UserStatus.unverified, "Invalid account or password")
        Assert.state(appUserInfo.status != UserStatus.disabled, "This account is no longer active")
        //校验密码
        Assert.state(DigestUtil.sha256Hex(password) == appUserInfo.password, "Invalid account or password")
        //生成jwtToken
        return createToken(appUserInfo, LoginType.email, country, language)
    }

    override fun appUserInfo(userInfo: LoginUserInfo): AppUserResp {
        val appUserInfo =
            appUserMapper.selectById(userInfo.userId!!) ?: throw AuthException(BaseResultCode.TOKEN_EXPIRATION)
        //查询用户订阅过期时间
        val result = orderFeignClient.getFeignUserSubscriptionExpiredTime(userInfo.userId!!, null)
        val appUserResp =
            if (userInfo.username != appUserInfo.username || userInfo.email != appUserInfo.email || userInfo.country != appUserInfo.country || userInfo.language != appUserInfo.language) {
                createToken(appUserInfo, userInfo.loginType)
            } else {
                appUserInfo.lastActivedAt = LocalDateTime.now()
                appUserMapper.updateById(appUserInfo)
                BeanUtil.copyProperties(appUserInfo, AppUserResp::class.java).apply {
                    this.userId = appUserInfo.id
                    this.setPassword =
                        Objects.nonNull(appUserInfo.password) && appUserInfo.password != DigestUtil.sha256Hex(INIT_PWD)
                }
            }
        appUserResp.backgroundImage = appUserInfo.backgroundImage
        appUserResp.expiredDate = result.data
        return appUserResp
    }

    override fun editUserInfo(req: EditUserInfoReq, loginUser: LoginUserInfo): AppUserResp {
        // 判断用户是否已通过验证
        val userInfo = appUserMapper.selectById(loginUser.userId)
            ?: throw BusinessException("This email isn’t linked to any account")
        Assert.notEquals(userInfo.status, UserStatus.unverified, "Email not verified")
        if (StrUtil.isNotBlank(req.username)) {
            Assert.isFalse(
                userService.checkUserNameExist(req.username!!, userInfo.id),
                "User nickname already exists, please rename"
            )
        }
        userInfo.username = req.username ?: userInfo.username
        if (StrUtil.isBlank(userInfo.username)) {
            userInfo.username = userService.generateName("guest")
        }
        userInfo.nickname = req.nickname ?: userInfo.nickname
        if (StrUtil.isBlank(userInfo.nickname)) {
            userInfo.nickname = userService.generateName("guest")
        }
        // 修改信息
        userInfo.avatar = req.avatar ?: userInfo.avatar
        userInfo.gender = req.gender ?: userInfo.gender
        userInfo.notifyFlag = req.notifyFlag ?: userInfo.notifyFlag
        userInfo.tags = req.tags ?: userInfo.tags
        userInfo.interestGender = req.interestGender ?: userInfo.interestGender
        userInfo.showGender = req.showGender ?: userInfo.showGender
        userInfo.occupation = req.occupation ?: userInfo.occupation
        userInfo.nickname = req.nickname ?: userInfo.nickname
        userInfo.bio = req.bio ?: userInfo.bio
        userInfo.allowJoinToChat = req.allowJoinToChat ?: userInfo.allowJoinToChat
        userInfo.backgroundImage = req.backgroundImage ?: userInfo.backgroundImage

        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
        userInfo.birthday = req.birthday?.let { LocalDate.parse(it, formatter) } ?: userInfo.birthday

        //校验国家和语言代码是否正确
        if (codeDicService.check(CodeType.country, req.country)) {
            userInfo.country = req.country
        }
        if (codeDicService.check(CodeType.language, req.language)) {
            userInfo.language = req.language
        }
        // 若用户之前是未完善状态，当前传入了username，则需要修改其状态
        if (userInfo.status == UserStatus.uncompleted) {
            if (StrUtil.isNotBlank(userInfo.username) && StrUtil.isNotBlank(userInfo.nickname)) {
                userInfo.status = UserStatus.enabled
            }
        }

        var interestFlag = false
        req.sport?.let {
            userInfo.sport = it
            interestFlag = true
        }
        req.news?.let {
            userInfo.news = it
            interestFlag = true
        }
        req.gaming?.let {
            userInfo.gaming = it
            interestFlag = true
        }
        req.entertainment?.let {
            userInfo.entertainment = it
            interestFlag = true
        }
        req.artistic?.let {
            userInfo.artistic = it
            interestFlag = true
        }
        req.lifestyle?.let {
            userInfo.lifestyle = it
            interestFlag = true
        }
        req.social?.let {
            userInfo.social = it
            interestFlag = true
        }
        req.technology?.let {
            userInfo.technology = it
            interestFlag = true
        }

        if (interestFlag) {
            interestItemService.validateVector(userInfo)
        }

        appUserMapper.updateById(userInfo)

        //生成jwtToken
        return createToken(userInfo, loginUser.loginType, refresh = true)
    }

    override fun editUserLocation(req: EditUserLocationReq, userInfo: LoginUserInfo) {
        val user = appUserMapper.selectById(userInfo.userId)
        if (user != null) {
            user.curLat = req.curLat
            user.curLng = req.curLng
            appUserMapper.updateById(user)
        }
    }

    @Transactional
    override fun postPublicGoogleLogin(req: PostPublicGoogleLoginReq): AppUserResp {
        val ostype = req.ostype ?: Ostype.ios
        val verifier = GoogleIdTokenVerifier.Builder(NetHttpTransport(), GsonFactory())
            .setAudience(Collections.singletonList(ostype.clientId)).build()
        StaticLog.info("google login clientId:{}", ostype.clientId)
        StaticLog.info("google login req:{}", JSONUtil.toJsonStr(req))
        val token = verifier.verify(req.idToken)
        if (token != null) {
            val payload = token.payload
            StaticLog.info("google login payload:{}", payload)
            val email = payload.email
            var user = appUserMapper.selectOne(
                KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, email).orderByAsc(AppUserInfo::status)
                    .last("limit 1")
            )
            val firstLogin = if (user == null) {
                user = AppUserInfo().apply {
                    this.email = email
                    this.username = userService.generateName("google")
                    this.nickname = userService.generateName("google")
                    this.password = DigestUtil.sha256Hex(INIT_PWD)
                    this.status = UserStatus.enabled
                    this.country = req.country ?: "US"
                    this.language = req.language ?: "en"
                    this.botTotal = 0
                    this.subBotTotal = 0
                    this.storyTotal = 0
                    this.followerTotal = 0
                    this.lastLoginAt = LocalDateTime.now()
                    this.createdAt = LocalDateTime.now()
                    this.updatedAt = LocalDateTime.now()
                    this.dataVersion = 1
                    this.deleted = false
                    this.registerTime = LocalDateTime.now()
                    this.registerType = PlatformType.google
                    this.googlePayload = JSONUtil.toJsonStr(payload)
                }
                appUserMapper.insert(user)
                true
            } else {
                user.username = user.username ?: userService.generateName("google")
                user.nickname = user.nickname ?: userService.generateName("google")
                if (user.status == UserStatus.uncompleted || user.status == UserStatus.unverified) {
                    user.status = UserStatus.enabled
                    user.registerType = PlatformType.google
                }
                //校验用户状态
                Assert.state(user.status != UserStatus.disabled, "The user has been disabled")
                false
            }
            user.googlePayload = JSONUtil.toJsonStr(payload)
            return createToken(user, LoginType.google, user.country, user.language, firstLogin)
        } else {
            throw BusinessException("Invalid ID token.")
        }
    }

    /**
     * 创建token
     */
    override fun createToken(
        user: AppUserInfo,
        loginType: LoginType?,
        country: String?,
        language: String?,
        firstLogin: Boolean?,
        refresh: Boolean?
    ): AppUserResp {
        //同步用户信息
        syncAuthorService.syncAuthor(AuthorSyncBO().apply {
            this.userId = user.id!!
            this.username = user.username
            this.avatar = user.avatar
            this.nickname = user.nickname
            this.bio = user.bio
            this.gender = user.gender
            this.status = user.status
        })

        //同步用户信息到推荐系统
        userService.sysncUserIntoGorse(user.id!!)

        //校验用户状态
        Assert.state(user.status != UserStatus.disabled, "The user has been disabled")
        if (codeDicService.check(CodeType.country, country)) {
            user.country = country
        }
        if (codeDicService.check(CodeType.language, language)) {
            user.language = language
        }
        // 更新用户最新登录时间
        user.lastLoginAt = LocalDateTime.now()
        user.lastActivedAt = LocalDateTime.now()
        appUserMapper.updateById(user)
        //创建token
        val token = JWTUtil.createToken(HashMap<String, Any?>().apply {
            this["userId"] = user.id
            this["userType"] = UserTypeEnum.APPUSER
            this["status"] = user.status
            this["username"] = user.username
            this["nickname"] = user.nickname
            this["phone"] = user.phone
            this["email"] = user.email
            this["country"] = user.country
            this["language"] = user.language
            this["gender"] = user.gender
            this["loginType"] = loginType
            this["avatar"] = user.avatar
            this["setPassword"] = Objects.nonNull(user.password) && user.password != DigestUtil.sha256Hex(INIT_PWD)
            this[JWTPayload.EXPIRES_AT] = DateUtil.offsetDay(DateUtil.date(), expireDays)
        }, jwtKey.toByteArray())

        val userKey = """${RedisCont.USER_INFO}${user.id}"""
        val opsForHash = stringRedisTemplate.opsForHash<String, String?>()
        if (refresh == true) {
            //旧token签名
            val oldTokerSigner = opsForHash.get(userKey, "${UserTypeEnum.APPUSER.name}:tokenSigner")
            if (null != oldTokerSigner) {
                opsForHash.put(userKey, "oldTokerSigner", oldTokerSigner)
                opsForHash.put(
                    userKey,
                    "oldTokerSignerExpireAt",
                    LocalDateTimeUtil.formatNormal(LocalDateTime.now().plusSeconds(oldTokenExpireSeconds))
                )
            }
        }
        val tokenSigner = token.split(".")[2]
        StaticLog.info("[{}] tokenSigner:{}", UserTypeEnum.APPUSER.name, tokenSigner)
        opsForHash.put(userKey, "${UserTypeEnum.APPUSER.name}:tokenSigner", tokenSigner)
//        RedisUtil.hset(userKey, "${UserTypeEnum.APPUSER?.name}:token", token)
        opsForHash.put(userKey, "status", user.status!!.name)
        stringRedisTemplate.expire(userKey, (expireDays * 24 * 60 * 60).toLong(), TimeUnit.SECONDS)
        return BeanUtil.copyProperties(user, AppUserResp::class.java).apply {
            this.userId = user.id
            this.setPassword = Objects.nonNull(user.password) && user.password != DigestUtil.sha256Hex(INIT_PWD)
            this.loginType = loginType
            this.token = token
            this.firstLogin = firstLogin == true
        }
    }

    override fun appleLogin(req: AppleLoginReq): AppUserResp? {
        val playloadObj = IOSToeknUtils.parserIdentityToken(req.identityToken!!)
        StaticLog.info("appleLogin playload:{}", playloadObj)
        //验证token是否有效
        val success = IOSToeknUtils.verifyExc(req.identityToken, playloadObj)
        Assert.state(success, "Jwt token verification failed")
        val bool = playloadObj.getBool("is_private_email", false)
        val email = playloadObj.getStr("email")
        //根据第三方用户唯一标识查询是否绑定用户
        val thirdPlatform = thirdPlatformService.queryBindUserInfo(req.appleUserId, PlatformType.apple)
        var user: AppUserInfo?
        var firstLogin = false
        if (null != thirdPlatform) {
            user = appUserMapper.selectById(thirdPlatform.userId)
            if (null != user && StrUtil.isBlank(user.email) && !bool) {
                user.email = email
                user.username = user.username ?: userService.generateName("apple")
                user.nickname = user.nickname ?: userService.generateName("apple")
                user.status = UserStatus.enabled
            }
        } else {
            //根据邮箱进行查询
            user = appUserMapper.selectOne(
                KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, email).orderByAsc(AppUserInfo::status)
                    .last("limit 1")
            )
            if (null != user) {
                thirdPlatformService.bindUserInfo(user.id, req.appleUserId, PlatformType.apple)
            }
        }
        //若根据邮箱查询结果为null
        if (null == user) {
            user = AppUserInfo().apply {
                this.email = if (bool) "" else email
//                this.username = email.substringBefore(" ")
//                if (null != username) {
//                    if (userService.checkUserNameExist(this.username!!, null)) {
//                        this.username = userService.generateName(this.username)
//                    }
//                } else {
//                    this.username = userService.generateName()
//                }
                this.username = userService.generateName("apple")
                this.nickname = userService.generateName("apple")
                this.password = DigestUtil.sha256Hex(INIT_PWD)
                this.status = UserStatus.enabled
                this.country = req.country ?: "US"
                this.language = req.language ?: "en"
                this.botTotal = 0
                this.subBotTotal = 0
                this.storyTotal = 0
                this.followerTotal = 0
                this.lastLoginAt = LocalDateTime.now()
                this.createdAt = LocalDateTime.now()
                this.updatedAt = LocalDateTime.now()
                this.dataVersion = 1
                this.deleted = false
                this.registerTime = LocalDateTime.now()
                this.registerType = PlatformType.apple
            }
            appUserMapper.insert(user)
            firstLogin = true
            thirdPlatformService.bindUserInfo(user.id, req.appleUserId, PlatformType.apple)
        }
        user.applePayload = JSONUtil.toJsonStr(playloadObj)
        //校验用户状态
        Assert.state(user.status != UserStatus.disabled, "The user has been disabled")
        if (user.status == UserStatus.unverified || user.status == UserStatus.uncompleted) {
            user.username = user.username ?: userService.generateName("apple")
            user.nickname = user.nickname ?: userService.generateName("apple")
            user.status = UserStatus.enabled
        }
        return createToken(user, LoginType.apple, req.country, req.language, firstLogin)
    }

    @Transactional
    override fun facebookLogin(req: FacebookLoginReq): AppUserResp? {
        val facebookUserInfo = FacebookUtil.currentInfo(req.accessToken!!)
        //根据第三方用户唯一标识查询是否绑定用户
        val thirdPlatform = thirdPlatformService.queryBindUserInfo(facebookUserInfo.id, PlatformType.facebook)
        var user: AppUserInfo? = null
        var firstLogin = false
        if (null != thirdPlatform) {
            user = appUserMapper.selectById(thirdPlatform.userId)
            if (null != user) {
                if (StrUtil.isBlank(user.email) && StrUtil.isNotBlank(facebookUserInfo.email)) {
                    user.email = facebookUserInfo.email
                }
                user.facebookPayload = JSONUtil.toJsonStr(facebookUserInfo)
                return createToken(user, LoginType.facebook, req.country, req.language)
            }
            thirdPlatformService.deleteUserBindInfo(thirdPlatform.userId)
        }
        if (StrUtil.isNotBlank(facebookUserInfo.email)) {
            //根据邮箱进行查询
            user = appUserMapper.selectOne(
                KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, facebookUserInfo.email)
                    .orderByAsc(AppUserInfo::status).last("limit 1")
            )
        }
        if (null == user) {
            user = AppUserInfo().apply {
                this.email = facebookUserInfo.email
//                this.username = facebookUserInfo.name?.substringBefore(" ")
//                if (null != username) {
//                    if (userService.checkUserNameExist(this.username!!, null)) {
//                        this.username = userService.generateName(this.username)
//                    }
//                } else {
//                    this.username = userService.generateName()
//                }
                this.username = userService.generateName("facebook")
                this.nickname = userService.generateName("facebook")
                this.avatar = facebookUserInfo.picture
                this.password = DigestUtil.sha256Hex(INIT_PWD)
                this.status = UserStatus.uncompleted
                this.country = req.country ?: "US"
                this.language = req.language ?: "en"
                this.botTotal = 0
                this.subBotTotal = 0
                this.storyTotal = 0
                this.followerTotal = 0
                this.lastLoginAt = LocalDateTime.now()
                this.createdAt = LocalDateTime.now()
                this.updatedAt = LocalDateTime.now()
                this.dataVersion = 1
                this.deleted = false
                this.registerTime = LocalDateTime.now()
                this.registerType = PlatformType.facebook
            }
            appUserMapper.insert(user)
            firstLogin = true
        }
        thirdPlatformService.bindUserInfo(user.id, facebookUserInfo.id, PlatformType.facebook)
        user.facebookPayload = JSONUtil.toJsonStr(facebookUserInfo)
        if (user.status == UserStatus.unverified || user.status == UserStatus.uncompleted) {
            user.username = user.username ?: userService.generateName("facebook")
            user.nickname = user.nickname ?: userService.generateName("facebook")
            user.status = UserStatus.enabled
        }
        return createToken(user, LoginType.facebook, req.country, req.language, firstLogin)
    }

    override fun getGoogleUserInfo(clientId: String, idToken: String): GoogleIdToken.Payload? {
        val verifier = GoogleIdTokenVerifier.Builder(NetHttpTransport(), GsonFactory())
            .setAudience(Collections.singletonList(clientId)).build()
        val token = verifier.verify(idToken) ?: throw Exception("Invalid ID token.")
        return token.payload
    }

    override fun checkUserPassword(password: String, userId: Long) {
        val appUserInfo = appUserMapper.selectById(userId) ?: throw Exception("Invalid account")
        //校验密码
        Assert.state(DigestUtil.sha256Hex(password) == appUserInfo.password, "Invalid password")
    }

    override fun logout(userInfo: LoginUserInfo): Int {
        //删除用户的token
        this.expireToken(userInfo.userId!!)
        //解绑用户的firebaseToken
        return firebaseUserTokenService.unbindUserToken(userInfo.userId!!)
    }

    override fun expireToken(userId: Long?) {
        stringRedisTemplate.delete("""${RedisCont.USER_INFO}${userId}""")
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun deleteUser(userId: Long?) {
        appUserMapper.deleteById(userId)
        thirdPlatformService.deleteUserBindInfo(userId)
        contentFeignClient.deleteFollowRelation(userId!!)
        followerMapper.delete(KtQueryWrapper(Follower::class.java).and {
            it.eq(Follower::followingId, userId).or().eq(Follower::userId, userId)
        })
        //注销已删除用户的token
        this.expireToken(userId)
        //移除推荐系统中的用户信息
        gorseService.deleteUser(userId.toString())
        //解绑用户的firebaseToken
        firebaseUserTokenService.unbindUserToken(userId)
    }

}
