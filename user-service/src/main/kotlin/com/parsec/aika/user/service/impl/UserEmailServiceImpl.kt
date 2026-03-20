package com.parsec.aika.user.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.crypto.digest.DigestUtil
import cn.hutool.json.JSONObject
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.common.model.em.UserResultCode
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.config.VerifyEmailConfig
import com.parsec.aika.user.mapper.AppUserMapper
import com.parsec.aika.user.model.em.RedisKeyPrefix
import com.parsec.aika.user.model.entity.AppUserInfo
import com.parsec.aika.user.model.entity.CodeType
import com.parsec.aika.user.model.entity.PlatformType
import com.parsec.aika.user.model.vo.req.AppEmailVerifyReq
import com.parsec.aika.user.model.vo.req.AppVerifyEmailReq
import com.parsec.aika.user.model.vo.req.ResetPasswordReq
import com.parsec.aika.user.model.vo.req.UpdateEmailReq
import com.parsec.aika.user.model.vo.resp.AppUserResp
import com.parsec.aika.user.model.vo.resp.LoginType
import com.parsec.aika.user.service.*
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.TimeUnit
import javax.annotation.Resource
import kotlin.math.abs

@RefreshScope
@Service
class UserEmailServiceImpl : UserEmailService {

    /**
     * 注册验证邮件中按钮对应链接
     */
    @Value("\${mail.url.register:}")
    private lateinit var registerEmailUrl: String

    /**
     * 重置密码邮件中按钮对应链接
     */
    @Value("\${mail.url.reset:}")
    private lateinit var resetPwdEmailUrl: String

    /**
     * 重置密码邮件中按钮对应链接
     */
    @Value("\${mail.url.update:}")
    private lateinit var updateEmailUrl: String

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    @Resource
    private lateinit var emailService: EmailService

    @Resource
    private lateinit var authService: AuthService

    @Resource
    private lateinit var userService: UserService

    @Resource
    private lateinit var appUserMapper: AppUserMapper

    @Resource
    private lateinit var codeDicService: CodeDicService

    @Value("\${spring.profiles.active}")
    private var env: String? = null

    private fun getVerifyCode(): Int {
        return if (listOf("local", "testci").contains(env)) {
            666666
        } else {
            ((Math.random() * 9 + 1) * 100000).toInt()
        }
    }

    @Transactional
    override fun verifyEmail(req: AppVerifyEmailReq): String {

        // 查询用户数据
        val user = this.getUserInfo(req)

        // 得到传入的email的hash值
        val emailHash = this.emailHashCode(req.email!!)
        // 随机一个六位数
        val verifyCode = getVerifyCode()
        val map = HashMap<String, Any>()
        map["description"] = VerifyEmailConfig.REGISTER_EMAIL_DESCRIPTION
        map["url"] = "${this.registerEmailUrl}?clientCode=$emailHash&verifyCode=$verifyCode"
        map["buttonText"] = VerifyEmailConfig.REGISTER_EMAIL_BUTTON_TEXT
        map["remarks"] = VerifyEmailConfig.REGISTER_EMAIL_REMARK
        emailService.sendMail(req.email!!, VerifyEmailConfig.VERIFY_EMAIL_TITLE, map, "verify")

        val jsonObject = JSONObject()
        jsonObject.set("userId", user.id)
        jsonObject.set("email", req.email)
        jsonObject.set("verifyCode", verifyCode)
        //type:1（登录）注册验证,2更换邮箱验证
        jsonObject.set("type", 1)
        jsonObject.set("status", 0)//0未验证，1已验证
        jsonObject.set("sendTime", LocalDateTime.now())
        stringRedisTemplate.opsForValue()
            .set("${RedisKeyPrefix.verifyEmail}$emailHash", jsonObject.toString(), 1, TimeUnit.DAYS)

        // 返回用户校验码（邮箱hash值）
        return emailHash
    }

    override fun verifyNewEmail(email: String, userId: Long, newPwd: String): String {
        // 验证邮箱唯一性。判断除当前登录用户外，是否有其他用户使用该邮箱
        this.validateEmail(email, userId)
        // 得到传入的email的hash值
        val emailHash = this.emailHashCode(email)
        // 随机一个六位数
        val verifyCode = getVerifyCode()
        val map = HashMap<String, Any>()
        map["description"] = VerifyEmailConfig.REGISTER_EMAIL_DESCRIPTION
        map["url"] = "${this.registerEmailUrl}?clientCode=$emailHash&verifyCode=$verifyCode"
        map["buttonText"] = VerifyEmailConfig.REGISTER_EMAIL_BUTTON_TEXT
        map["remarks"] = VerifyEmailConfig.REGISTER_EMAIL_REMARK
        emailService.sendMail(email, VerifyEmailConfig.VERIFY_EMAIL_TITLE, map, "verify")

        val jsonObject = JSONObject()
        jsonObject.set("userId", userId)
        jsonObject.set("email", email)
        jsonObject.set("password", DigestUtil.sha256Hex(newPwd))
        jsonObject.set("verifyCode", verifyCode)
        //type:1注册验证,2更换邮箱旧邮箱验证，3更换邮箱新邮箱验证
        jsonObject.set("type", 3)
        stringRedisTemplate.opsForValue().set(
            "${RedisKeyPrefix.verifyEmail}$emailHash", jsonObject.toString(), 1, TimeUnit.DAYS
        )
        return emailHash
    }

    override fun forgotPasswordSendEmail(email: String) {
        // 判断该邮箱是否对应有用户，若无则返回user does not exist
        val emailUser = appUserMapper.selectOne(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, email).last("limit 1")
        )
        Assert.notNull(emailUser, "This email isn’t linked to any account")
        // 验证码的生成规则：取得用户对象，将{邮箱}+{user.lastLoginAt}用 MD5 hash后放入到 Redis 中，以此验证码为key，以用户的ID为value，过期时间为5分钟。
        // 得到hash值
        val emailHash = this.emailHashCode("$email+${emailUser.lastLoginAt}")
        // 随机一个六位数
        val verifyCode = ((Math.random() * 9 + 1) * 100000).toInt()

        val jsonObject = JSONObject()
        jsonObject.set("userId", emailUser.id)
        jsonObject.set("email", emailUser.email)
        jsonObject.set("verifyCode", verifyCode)
        //type:1注册验证,2更换邮箱验证,4忘记密码
        jsonObject.set("type", 4)
        jsonObject.set("status", 0)//0未验证，1已验证
        stringRedisTemplate.opsForValue()
            .set("${RedisKeyPrefix.forgotPassword}$emailHash", jsonObject.toString(), 1, TimeUnit.DAYS)
        // 发送注册邮件
//        this.sendEmail(email, emailHash, "忘记密码")
        val map = HashMap<String, Any>()
        map["description"] = VerifyEmailConfig.RESET_PWD_EMAIL_DESCRIPTION
        map["url"] = "${this.resetPwdEmailUrl}?clientCode=$emailHash&verifyCode=$verifyCode"
        map["buttonText"] = VerifyEmailConfig.RESET_PWD_EMAIL_BUTTON_TEXT
        map["remarks"] = VerifyEmailConfig.RESET_PWD_EMAIL_REMARK
        emailService.sendMail(email, VerifyEmailConfig.RESET_PWD_EMAIL_TITLE, map, "verify")
    }

    override fun resetPassword(req: ResetPasswordReq) {
        // 通过传入的clientCode，得到redis中存的数据
        val redisKey = "${RedisKeyPrefix.forgotPassword}${req.clientCode!!}"
        val cacheJson = stringRedisTemplate.opsForValue().get(redisKey)
        Assert.notBlank(cacheJson, "The email verification code has expired")
        val jsonObject = JSONObject(cacheJson)
        //type:1注册验证,2更换邮箱验证,4忘记密码
        Assert.state(jsonObject.getInt("type") == 4, "The email verification code has expired")
        // 通过该redisKey得到的value值就是userId，通过userId查询得到用户信息
        val userInfo = appUserMapper.selectById(jsonObject.getLong("userId"))
        Assert.notNull(userInfo, "This email isn’t linked to any account, Unable to reset its password")
        Assert.state(req.verifyCode == jsonObject.getStr("verifyCode"), "Verification code error")
        // 修改用户的密码
        appUserMapper.updateById(AppUserInfo().apply {
            this.id = userInfo.id
            this.password = DigestUtil.sha256Hex(req.password!!)
        })
        stringRedisTemplate.delete(redisKey)
        //修改密码成功，也然用户token失效，重新登录一下
        authService.expireToken(userInfo.id)
    }

    override fun refreshToken(clientCode: String): AppUserResp? {
        // 通过传入的clientCode，得到redis中存的数据
        val redisKey = "${RedisKeyPrefix.verifyEmail}${clientCode}"
        val cacheJson: String? = stringRedisTemplate.opsForValue().get(redisKey)
        Assert.notBlank(cacheJson, "If the email has been verified, please directly return to the login page to log in")
        val jsonObject = JSONObject(cacheJson)
        val userInfo = appUserMapper.selectById(jsonObject.getLong("userId"))
        Assert.notNull(userInfo, "invalid clientCode")
        Assert.state(
            userInfo.status != UserStatus.unverified, "Please verify through email before continuing with the operation"
        )
        val status = jsonObject.getInt("status")
        if (status != 1) {
            throw BusinessException(UserResultCode.EMAIL_NOT_VERIFY)
        }
        //验证成功后，删除key
        stringRedisTemplate.delete(redisKey)
        return authService.createToken(userInfo, LoginType.email, firstLogin = jsonObject.getBool("firstLogin", false))
    }

    override fun registerEmailVerify(vo: AppEmailVerifyReq): String? {
        Assert.notNull(vo.clientCode, "ClientCode cannot be empty")
        // 通过传入的clientCode，得到redis中存的数据
        val redisKey = "${RedisKeyPrefix.verifyEmail}${vo.clientCode}"
        val cacheJson = stringRedisTemplate.opsForValue().get(redisKey)
        Assert.notNull(cacheJson, "The email verification code has expired")
        StaticLog.info("email verify cache json:{}", cacheJson)
        val jsonObject = JSONObject(cacheJson)
        Assert.state(
            jsonObject.getStr("verifyCode") == vo.verifyCode, "The verification code is incorrect"
        )
        // 通过该redisKey得到的value值就是userId，通过userId查询得到用户信息
        val userInfo = appUserMapper.selectById(jsonObject.getLong("userId"))
        Assert.notNull(userInfo, "The email verification code has expired")
        //type:1(登录)注册验证,3更换邮箱验证
        val type = jsonObject.getInt("type")
        if (type == 3) {
            val password = jsonObject.getStr("password")
            val email = jsonObject.getStr("email")
            // 验证邮箱唯一性。判断除当前用户外，是否有其他用户使用该邮箱
            this.validateEmail(email, userInfo.id)
            // 若用户状态为 unverified，则设置为 uncompleted
            if (userInfo.status == UserStatus.unverified) userInfo.status = UserStatus.uncompleted
            userInfo.email = email
            if (StrUtil.isNotBlank(password)) {
                userInfo.password = password
            }
            stringRedisTemplate.delete(redisKey)
        } else {
//            Assert.state(userInfo.status == UserStatus.unverified, "The email has been successfully verified.")
            // 若用户状态为 unverified，则设置为 uncompleted
            if (userInfo.status == UserStatus.unverified) {
                userInfo.status = UserStatus.uncompleted
                userInfo.registerTime = LocalDateTime.now()
                jsonObject.set("firstLogin", 1)
            } else {
                userInfo.lastLoginAt = LocalDateTime.now()
            }
            jsonObject.set("status", 1)
            stringRedisTemplate.opsForValue().set(redisKey, jsonObject.toString(), 1, TimeUnit.DAYS)
        }
        appUserMapper.updateById(userInfo)
        //若更新邮件成功，让用户重新登录一下，直接把用户token更新一下
        if (type == 3) {
            authService.expireToken(userInfo.id)
        }
        //移除和当前邮件相同但未验证通过的账号信息
        appUserMapper.delete(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, userInfo.email)
                .eq(AppUserInfo::status, UserStatus.unverified)
        )
        //返回新token
        return authService.createToken(userInfo, LoginType.email).token
    }

    override fun verifyOldEmail(user: LoginUserInfo): String {
        // 得到传入的email的hash值
        val emailHash = this.emailHashCode(user.email!!)
        // 随机一个六位数
        val verifyCode = ((Math.random() * 9 + 1) * 100000).toInt()
        val map = HashMap<String, Any>()
        map["description"] = VerifyEmailConfig.UPDATE_EMAIL_DESCRIPTION
        map["url"] = "${this.updateEmailUrl}?clientCode=$emailHash&verifyCode=$verifyCode"
        map["buttonText"] = VerifyEmailConfig.UPDATE_EMAIL_BUTTON_TEXT
        map["remarks"] = VerifyEmailConfig.UPDATE_EMAIL_REMARK
        emailService.sendMail(user.email!!, VerifyEmailConfig.UPDATE_EMAIL_TITLE, map, "verify")

        val jsonObject = JSONObject()
        jsonObject.set("userId", user.userId)
        jsonObject.set("email", user.email)
        jsonObject.set("verifyCode", verifyCode)
        //type:1注册验证,2更换邮箱验证
        jsonObject.set("type", 2)
        stringRedisTemplate.opsForValue().set(
            "${RedisKeyPrefix.updateEmail}$emailHash", jsonObject.toString(), 1, TimeUnit.DAYS
        )
        return emailHash
    }

    override fun oldEmailVerify(req: UpdateEmailReq) {
        Assert.notNull(req.clientCode, "ClientCode cannot be empty")
        // 通过传入的clientCode，得到redis中存的数据
        val redisKey = "${RedisKeyPrefix.updateEmail}${req.clientCode}"
        val cacheJson = stringRedisTemplate.opsForValue().get(redisKey)
        Assert.notNull(cacheJson, "The email verification code has expired")
        StaticLog.info("email verify cache json:{}", cacheJson)
        val jsonObject = JSONObject(cacheJson)
        //type:1注册验证,2更换邮箱旧邮箱验证,3更换邮箱验证
        Assert.state(jsonObject.getInt("type") == 2, "Verification type error")
        Assert.state(jsonObject.getStr("verifyCode") == req.verifyCode, "Verification code error")
        //发送邮件到新邮箱
        this.verifyNewEmail(req.newEmail!!, jsonObject.getLong("userId"), req.newPwd!!)
        stringRedisTemplate.delete(redisKey)
    }

    /**
     * 查询用户信息
     */
    private fun getUserInfo(req: AppVerifyEmailReq): AppUserInfo {
        // 判断该邮箱是否已注册过（未验证用户可以一直重新发）
        var user = appUserMapper.selectOne(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, req.email).last("limit 1")
        )
        if (Objects.isNull(user)) {
            user = AppUserInfo().apply {
                this.username = userService.generateName("guest")
                this.nickname = userService.generateName("guest")
                this.email = req.email
                this.country = if (codeDicService.check(CodeType.country, req.country)) {
                    req.country
                } else "US"
                this.language = if (codeDicService.check(CodeType.language, req.language)) req.language else "en"
                this.password = DigestUtil.sha256Hex(req.password!!)
                this.status = UserStatus.unverified
                this.botTotal = 0
                this.subBotTotal = 0
                this.storyTotal = 0
                this.followerTotal = 0
                this.createdAt = LocalDateTime.now()
                this.updatedAt = LocalDateTime.now()
                this.dataVersion = 1
                this.deleted = false
                this.registerTime = LocalDateTime.now()
                this.registerType = PlatformType.aika
            }
            appUserMapper.insert(user)
        } else {
            if (StrUtil.isBlank(user.username)) {
                user.username = userService.generateName("guest")
            }
            if (StrUtil.isBlank(user.nickname)) {
                user.nickname = userService.generateName("guest")
            }
            if (codeDicService.check(CodeType.country, req.country)) {
                user.country = req.country
            }
            if (codeDicService.check(CodeType.language, req.language)) {
                user.language = req.language
            }
            user.lastLoginAt = LocalDateTime.now()
            appUserMapper.updateById(user)
        }
        return user
    }

    // 验证邮箱的唯一性
    private fun validateEmail(email: String, userId: Long?) {
        // 验证邮箱唯一性。判断除当前登录用户外，是否有其他用户使用该邮箱
        val count = appUserMapper.selectCount(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, email)
                .ne(null != userId, AppUserInfo::id, userId).ne(AppUserInfo::status, UserStatus.unverified)
        )
        Assert.isFalse(count > 0, "This email has already been registered and cannot be duplicated")
    }

    // 获取邮箱的hash值，避免负数，减少重复率
    override fun emailHashCode(email: String): String {
        return (abs(email.hashCode()) % Long.MAX_VALUE).toString()
    }

    override fun verifyEmailV2(req: AppVerifyEmailReq): Any? {
        // 查询用户数据
        val user = this.getUserInfo(req)
        Assert.state(user.status == UserStatus.unverified, "An account with this email already exists")

        // 得到传入的email的hash值
        val emailHash = this.emailHashCode(req.email!!)
        // 随机一个六位数
        val verifyCode = getVerifyCode()
        val map = HashMap<String, Any>()
        map["description"] = VerifyEmailConfig.REGISTER_EMAIL_DESCRIPTION
        map["url"] = "${this.registerEmailUrl}?clientCode=$emailHash&verifyCode=$verifyCode"
        map["buttonText"] = VerifyEmailConfig.REGISTER_EMAIL_BUTTON_TEXT
        map["remarks"] = VerifyEmailConfig.REGISTER_EMAIL_REMARK
        map["verifyCode"] = verifyCode
        emailService.sendMail(req.email!!, VerifyEmailConfig.VERIFY_EMAIL_TITLE, map, "registerVerify")

        val jsonObject = JSONObject()
        jsonObject.set("userId", user.id)
        jsonObject.set("email", req.email)
        jsonObject.set("verifyCode", verifyCode)
        //type:1（登录）注册验证,2更换邮箱验证
        jsonObject.set("type", 1)
        jsonObject.set("status", 0)//0未验证，1已验证
        jsonObject.set("sendTime", LocalDateTime.now())
        stringRedisTemplate.opsForValue()
            .set("${RedisKeyPrefix.verifyEmail}$emailHash", jsonObject.toString(), 1, TimeUnit.DAYS)

        // 返回用户校验码（邮箱hash值）
        return JSONObject().apply {
            this.set("clientCode", emailHash)
        }
    }

    override fun verifyNewEmailV2(email: String, userId: Long): String? {
        //验证用户密码
//        authService.checkUserPassword(password, userId)
        // 验证邮箱唯一性。判断除当前登录用户外，是否有其他用户使用该邮箱
        this.validateEmail(email, userId)
        // 得到传入的email的hash值
        val emailHash = this.emailHashCode(email)
        // 随机一个六位数
        val verifyCode = getVerifyCode()
        val map = HashMap<String, Any>()
        map["description"] = VerifyEmailConfig.UPDATE_EMAIL_DESCRIPTION
        map["remarks"] = VerifyEmailConfig.UPDATE_EMAIL_REMARK
        map["verifyCode"] = verifyCode
        emailService.sendMail(email, VerifyEmailConfig.VERIFY_EMAIL_TITLE, map, "updateEmailVerify")

        val jsonObject = JSONObject()
        jsonObject.set("userId", userId)
        jsonObject.set("email", email)
        jsonObject.set("verifyCode", verifyCode)
        //type:1注册验证,2更换邮箱旧邮箱验证，3更换邮箱新邮箱验证
        jsonObject.set("type", 3)
        stringRedisTemplate.opsForValue().set(
            "${RedisKeyPrefix.verifyEmail}$emailHash", jsonObject.toString(), 1, TimeUnit.DAYS
        )
        return emailHash
    }


}