package com.parsec.aika.user.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.core.collection.CollUtil
import cn.hutool.core.date.LocalDateTimeUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.IdUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.crypto.digest.DigestUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.bo.GorseCategory
import com.parsec.aika.common.model.bo.GorseFeedbackType
import com.parsec.aika.common.model.constant.RedisCont
import com.parsec.aika.common.model.em.UserResultCode
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.vo.AppUserVO
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.utils.PageUtil
import com.parsec.aika.user.gorse.GorseService
import com.parsec.aika.user.mapper.*
import com.parsec.aika.user.model.em.InterestItemType
import com.parsec.aika.user.model.entity.*
import com.parsec.aika.user.model.vo.req.*
import com.parsec.aika.user.model.vo.resp.*
import com.parsec.aika.user.remote.ContentFeignClient
import com.parsec.aika.user.remote.OrderFeignClient
import com.parsec.aika.user.service.*
import com.parsec.trantor.common.response.BaseResultCode
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import java.time.temporal.ChronoUnit
import javax.annotation.PreDestroy
import javax.annotation.Resource
import kotlin.math.sqrt

@Service
class UserServiceImpl : UserService {

    @Autowired
    private lateinit var authService: AuthService

    @Autowired
    private lateinit var gorseService: GorseService

    @Autowired
    private lateinit var typicalUserVectorMapper: TypicalUserVectorMapper

    @Resource
    private lateinit var appUserMapper: AppUserMapper

    @Resource
    private lateinit var followerMapper: FollowerMapper

    @Resource
    private lateinit var groupMapper: AppGroupMapper

    @Resource
    private lateinit var userGroupRelMapper: UserGroupRelMapper

    @Resource
    private lateinit var orderFeignClient: OrderFeignClient

    @Resource
    private lateinit var contentFeignClient: ContentFeignClient

    @Resource
    private lateinit var pushListService: PushListService

    @Resource
    private lateinit var syncAuthorService: SyncAuthorService

    @Resource
    private lateinit var interestItemMapper: InterestItemMapper

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    @Resource
    private lateinit var userBlockRelMapper: UserBlockRelMapper

    @Autowired
    private lateinit var emailService: EmailService

    private val executorService = ThreadUtil.newExecutor(10)

    @PreDestroy
    fun preDestroy() {
        if (!executorService.isShutdown) {
            executorService.shutdown()
        }
    }

    override fun queryFansCount(userId: Long): Int {
        val userInfo = appUserMapper.selectById(userId) ?: throw BusinessException(BaseResultCode.USER_NOT_EXIST)
        return followerMapper.selectCount(KtQueryWrapper(Follower::class.java).eq(Follower::followingId, userInfo.id))
            .toInt()
    }

    override fun querySubscriptBotCount(userId: Long): Int {
        val userInfo = appUserMapper.selectById(userId) ?: throw BusinessException(BaseResultCode.USER_NOT_EXIST)
        return userInfo.subBotTotal!!
    }

    override fun queryBotsCount(userId: Long): Int {
        val userInfo = appUserMapper.selectById(userId) ?: throw BusinessException(BaseResultCode.USER_NOT_EXIST)
        return userInfo.botTotal!!
    }

    override fun queryStoriesCount(userId: Long): Int {
        val userInfo = appUserMapper.selectById(userId) ?: throw BusinessException(BaseResultCode.USER_NOT_EXIST)
        return userInfo.storyTotal!!
    }

    override fun deleteById(id: Long) {
//        val user = checkUser(id)
        authService.deleteUser(id)
    }

    override fun manageUserStatus(req: ManageUserStatusReq) {
        val user = checkUser(req.userId!!)
        Assert.notEquals(req.status, user.status, "do not repeat the operation")
        user.status = req.status
        val updateById = appUserMapper.updateById(user)
        stringRedisTemplate.opsForHash<String, String>()
            .put("""${RedisCont.USER_INFO}${req.userId}""", "status", req.status!!.name)
        if (updateById > 0) {
            //同步用户信息
            syncAuthorService.syncAuthor(AuthorSyncBO().apply {
                this.userId = user.id!!
                this.username = user.username
                this.nickname = user.nickname
                this.avatar = user.avatar
                this.bio = user.bio
                this.gender = user.gender
                this.status = req.status
            })
            if (user.status == UserStatus.disabled) {
                //移除推荐系统中的用户信息
                gorseService.deleteUser(user.id.toString())
            } else {
                //同步用户信息到推荐系统
                this.sysncUserIntoGorse(user.id!!)
            }
        }
    }

    override fun getManageUser(id: Long): ManagerUserResp {
        val resp = ManagerUserResp()
        val user = checkUser(id)
        BeanUtils.copyProperties(user, resp)

        val list = userGroupRelMapper.selectList(
            KtQueryWrapper(UserGroupRel::class.java).select(UserGroupRel::groupId).eq(UserGroupRel::userId, id)
        ).map { it.groupId }
        if (list.isNotEmpty()) {
            resp.group = groupMapper.selectList(
                KtQueryWrapper(AppGroupInfo::class.java).`in`(AppGroupInfo::id, list)
            ).map {
                val vo = Group()
                vo.id = it.id
                vo.groupName = it.groupName
                vo
            }
        } else {
            resp.group = ArrayList()
        }
        val userSubscriptions = orderFeignClient.userSubscription(id)
        if (userSubscriptions.isSuccess && CollUtil.isNotEmpty(userSubscriptions.data)) {
            resp.packages = userSubscriptions.data!!.map {
                return@map Package().apply {
                    this.id = it?.packageId
                    this.packageName = it?.packageName
                    this.expiredDate = it?.expiredDate
                    this.subscriptTime = it?.subscriptTime
                }
            }
        }
        return resp
    }

    override fun manageUserList(req: ManageUserListReq): PageResult<ManagerUserListResp> {
        val page = Page<ManagerUserListResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<ManagerUserListResp>().page(appUserMapper.manageUserList(page, req))
    }

    override fun updatePassword(req: UpdatePasswordReq, loginUserInfo: LoginUserInfo) {
        val userInfo =
            appUserMapper.selectById(loginUserInfo.userId) ?: throw BusinessException(BaseResultCode.USER_NOT_EXIST)
        // 验证原密码是否正确
        Assert.state(DigestUtil.sha256Hex(req.oldPwd) == userInfo.password, "The original password is incorrect")
        // 验证两次密码是否相同
//        Assert.state(req.oldPwd != req.newPwd, "The new password is the same as the original password")
        Assert.state(req.oldPwd != req.newPwd, "New password must be different from the current password")
        // 修改密码
        userInfo.password = DigestUtil.sha256Hex(req.newPwd)
        appUserMapper.updateById(userInfo)
    }

    override fun endPointUserCountrys(): List<String> {
        return appUserMapper.endPointUserCountryList()
    }

    override fun endPointUserNums(date: String, country: String): EndPointUserNumData {
        // 该城市下的总用户数
        val userTotalNum =
            appUserMapper.selectCount(KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::country, country))
        // 当天的新用户数（当天创建的用户）—— 不查询未验证用户
        val newUsers = appUserMapper.selectCount(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::country, country)
                .ne(AppUserInfo::status, UserStatus.unverified).last("and DATE_FORMAT(createdAt, '%Y%m%d') = '${date}'")
        )
        // 当天活跃用户数（当天登录的用户）
        val activeUsers = appUserMapper.selectCount(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::country, country)
                .last("and DATE_FORMAT(lastLoginAt, '%Y%m%d') = '${date}'")
        )
        // 近三十天未活跃的用户（有三十天未登录的用户）
        val inactiveUsers = appUserMapper.selectCount(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::country, country)
                .last("and to_days('${date}') - to_days(lastLoginAt) > 30")
        )
        return EndPointUserNumData().apply {
            this.totalUsers = userTotalNum.toInt()
            this.newUsers = newUsers.toInt()
            this.activeUsers = activeUsers.toInt()
            this.inactiveUsers = inactiveUsers.toInt()
        }
    }

    override fun getAppUser(id: Long, loginUserInfo: LoginUserInfo): AppUserInfoResp {
        val user = checkUser(id)
        return userInfoResp(user, loginUserInfo).apply {
            this.isBlacked = userBlockRelMapper.selectCount(
                KtQueryWrapper(UserBlockRel::class.java).eq(
                    UserBlockRel::userId, loginUserInfo.userId
                ).eq(UserBlockRel::blockedUserId, id)
            ) > 0
        }
    }

    override fun getAppUserInfo(username: String, loginUserInfo: LoginUserInfo): AppUserInfoResp {
        val user = appUserMapper.selectOne(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::username, username)
                .ne(AppUserInfo::status, UserStatus.unverified).orderByDesc(AppUserInfo::id).last("limit 1")
        ) ?: throw BusinessException(UserResultCode.USER_NOT_EXIST)
        return userInfoResp(user, loginUserInfo).apply {
            this.isBlacked = userBlockRelMapper.selectCount(
                KtQueryWrapper(UserBlockRel::class.java).eq(
                    UserBlockRel::userId, loginUserInfo.userId
                ).eq(UserBlockRel::blockedUserId, id)
            ) > 0
        }
    }

    private fun userInfoResp(user: AppUserInfo, loginUserInfo: LoginUserInfo): AppUserInfoResp {
        val resp = BeanUtil.copyProperties(user, AppUserInfoResp::class.java)
        if (user.id == loginUserInfo.userId) {
            resp.followed = false
            resp.friend = false
            return resp
        }
        //查询用户关注关系
        val follower = followerMapper.selectByUidAndFollowingId(loginUserInfo.userId!!, user.id)
        if (null == follower) {
            resp.followed = false
            resp.friend = false
            return resp
        }
        if (follower.uf == 1 && follower.fu == 1) {
            resp.followed = true
            resp.friend = true
            return resp
        }
        resp.friend = false
        resp.followed =
            (follower.userId == loginUserInfo.userId && follower.uf == 1) || (follower.followingId == loginUserInfo.userId && follower.fu == 1)
        gorseService.saveFeedback(
            loginUserInfo.userId.toString(), user.id.toString(), "查看详情", GorseFeedbackType.read
        )
        return resp
    }

    override fun queryUserIdsByGroupId(groupId: Long?): List<Long>? {
        return userGroupRelMapper.selectList(
            KtQueryWrapper(UserGroupRel::class.java).select(UserGroupRel::userId).eq(UserGroupRel::groupId, groupId)
        ).map { it.userId ?: 0 }
    }

    override fun queryUserInfo(userId: Long): AppUserVO? {
        val userInfo = appUserMapper.selectById(userId) ?: throw BusinessException(UserResultCode.USER_NOT_EXIST)
        val appUserVO = AppUserVO()
        BeanUtils.copyProperties(userInfo, appUserVO)
        appUserVO.id = userInfo.id
        return appUserVO
    }

    override fun getInactiveUsers(inactiveDays: Int?): List<AppUserInfo> {
        //当前时间往前推inactiveDays天
        val localDateTime =
            LocalDateTimeUtil.offset(LocalDateTimeUtil.now(), (-inactiveDays!!).toLong(), ChronoUnit.DAYS)
        return appUserMapper.selectList(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::status, UserStatus.enabled)
                .gt(AppUserInfo::lastActivedAt, LocalDateTimeUtil.beginOfDay(localDateTime))
                .le(AppUserInfo::lastActivedAt, LocalDateTimeUtil.endOfDay(localDateTime))
        )

    }

    override fun pushInactiveUsersNotify(
        inactiveDays: Int?, title: String?, content: String?, jobId: Long?, operator: String?
    ) {
        val inactiveUsers = getInactiveUsers(inactiveDays)
        inactiveUsers.forEach {
            pushInactiveUsersNotify(it, title, content, jobId, operator)
        }
    }

    override fun pushToUser(userId: Long): Boolean? {
        val userInfo = checkUser(userId)
        val result = contentFeignClient.userNotify(userInfo.id, userInfo.username, 0, userInfo.username)
        return result
    }

    override fun checkUserNameExist(username: String, userId: Long?): Boolean {
        return appUserMapper.selectCount(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::username, username).eq(AppUserInfo::deleted, 0)
                .ne(userId != null, AppUserInfo::id, userId)
        ) > 0
    }

    override fun generateName(prefix: String?): String? {
//        val randomString = RandomUtil.randomString(RandomUtil.randomInt(5, 8))
//        val username = "$prefix$randomString"
//        if (checkUserNameExist(username, null)) {
//            return generateName(prefix)
//        }
//        return username
        //邀请统一使用AIKA前缀
        return "AIKA_${IdUtil.nanoId(16)}"
    }

    override fun syncUserList() {
        val list = appUserMapper.selectList(
            KtQueryWrapper(AppUserInfo::class.java).ne(
                AppUserInfo::status, UserStatus.unverified
            )
        )
        list.forEach { user ->
            var flag = false
            if (StrUtil.isBlank(user.username)) {
                user.username = generateName(user.registerType?.name ?: "aika")
                flag = true
            }
            if (StrUtil.isBlank(user.nickname)) {
                user.nickname = generateName(user.registerType?.name ?: "aika")
                flag = true
            }
            if (flag) {
                appUserMapper.updateById(user)
            }
            //同步用户信息
            syncAuthorService.syncAuthor(AuthorSyncBO().apply {
                this.userId = user.id!!
                this.username = user.username
                this.nickname = user.nickname
                this.avatar = user.avatar
                this.bio = user.bio
                this.gender = user.gender
                this.status = user.status
            })
            this.sysncUserIntoGorse(user.id!!)
        }
    }

    override fun getRecommendUserList(userId: Long): List<AppUserVO> {

        val userVector = prepareUserInterestVector(userId);


        //获得推荐用户列表

        val recommendList = appUserMapper.selectUserWithDistance(userVector)
        val resultList = ArrayList<AppUserVO>()

        for ((i, user) in recommendList.withIndex()) {
            if (i < 5) {
                resultList.add(user)
            } else if (1 - user.distance!! > 0.8 && i < 20) {
                if ((Math.random() * 100 % 11) == 2.0) {  //用概率开关，有1/10 的概率去替换前5
                    resultList[(Math.random() * 100 % 5).toInt()] = user
                } else {
                    resultList.add(user)
                }
            } else if (i < 50) {
                resultList.add(user)
            } else {
                if ((Math.random() * 100 % 11) > 5.0) {
                    resultList.add(user)   //用概率开关，有1/2 的几率进入列表
                }
            }

        }

        return resultList
    }


    override fun initTypicalUsers() {
        //遍历枚举InterestType
        val interestItemTypeList = InterestItemType.values()
        interestItemTypeList.forEach {

            if (it == InterestItemType.OTHER) return

            val lst = appUserMapper.selectTopUserOfInterestType(it.name)

            typicalUserVectorMapper.delete(
                KtQueryWrapper(TypicalUserVector::class.java).eq(TypicalUserVector::type, it)
            )


            lst.forEach { vectorDto ->
                val typicalUserVector = TypicalUserVector()
                typicalUserVector.vector = vectorDto.vector

                typicalUserVector.distance = 0.0 //我发现没有必要算这个距离
                typicalUserVector.type = it
                typicalUserVectorMapper.insert(typicalUserVector)
            }

        }

    }

    @Async
    override fun sysncUserIntoGorse(userId: Long) {
        val userInfo = appUserMapper.selectById(userId) ?: return
        val followingIds = followerMapper.getFollowingIdList(userInfo.id!!)
        gorseService.saveUser(userInfo, followingIds)
        followingIds.forEach {
            gorseService.saveFeedback(userInfo.id.toString(), it, "关注", GorseFeedbackType.star)
        }
    }

    override fun getRecommendUserListV2(userId: Long): List<AppUserVO>? {
        val recommendUserIds = gorseService.getRecommendation(userId, GorseCategory.user, 21)
        if (CollUtil.isEmpty(recommendUserIds)) {
            return emptyList()
        }
        val appUserInfos = appUserMapper.selectList(
            KtQueryWrapper(AppUserInfo::class.java).`in`(AppUserInfo::id, recommendUserIds).ne(AppUserInfo::id, userId)
        )
        return appUserInfos.map { info ->
            val appUserVO = AppUserVO()
            appUserVO.id = info.id
            appUserVO.username = info.username
            appUserVO.nickname = info.nickname
            appUserVO.avatar = info.avatar
            appUserVO.status = info.status
            appUserVO.phone = info.phone
            appUserVO.email = info.email
            appUserVO.country = info.country
            appUserVO.language = info.language
            appUserVO.gender = info.gender
//            appUserVO.distance = cacheScoredList.firstOrNull { info.id.toString() == it.Id }?.Score
            appUserVO.bio = info.bio
            appUserVO.allowJoinToChat = info.allowJoinToChat
            return@map appUserVO
        }
    }

    override fun inactiveUserEmails(date: String): Int {
        val selectList = appUserMapper.selectList(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::status, UserStatus.enabled)
                .le(AppUserInfo::lastActivedAt, date)
        )
        if (CollUtil.isEmpty(selectList)) {
            return 0
        }
        val list = selectList.filter {
            StrUtil.isNotBlank(it.email)
        }.filter {
            //苹果的虚拟邮箱
            !StrUtil.endWith(it.email, "@privaterelay.appleid.com")
        }
        val map = HashMap<String, Any>()
        list.forEach {
            emailService.sendMail(
                it.email!!, "We miss you at AIKA \uD83D\uDC99", map, "inactivePush"
            )
        }
        return list.size
    }

    fun getMaxDistance(userVector: Map<InterestItemType, MutableMap<String, Int>>, userVectorVo: AppUserVectorVo) {
        userVectorVo.sportMaxDistance = sqrt(userVector[InterestItemType.SPORT]?.keys?.size?.toDouble() ?: 1.0)
        userVectorVo.entertainmentMaxDistance =
            sqrt(userVector[InterestItemType.ENTERTAINMENT]?.keys?.size?.toDouble() ?: 1.0)
        userVectorVo.lifestyleMaxDistance = sqrt(userVector[InterestItemType.LIFESTYLE]?.keys?.size?.toDouble() ?: 1.0)
        userVectorVo.artisticMaxDistance = sqrt(userVector[InterestItemType.ARTISTIC]?.keys?.size?.toDouble() ?: 1.0)
        userVectorVo.gamingMaxDistance = sqrt(userVector[InterestItemType.GAMING]?.keys?.size?.toDouble() ?: 1.0)
        userVectorVo.newsMaxDistance = sqrt(userVector[InterestItemType.NEWS]?.keys?.size?.toDouble() ?: 1.0)
        userVectorVo.technologyMaxDistance =
            sqrt(userVector[InterestItemType.TECHNOLOGY]?.keys?.size?.toDouble() ?: 1.0)
        userVectorVo.socialMaxDistance = sqrt(userVector[InterestItemType.SOCIAL]?.keys?.size?.toDouble() ?: 1.0)

    }

    fun prepareUserInterestVector(userId: Long): AppUserVectorVo {
        val interests = interestItemMapper.selectList(
            KtQueryWrapper(InterestItem::class.java).eq(InterestItem::deleted, false).orderByAsc(InterestItem::itemType)
                .orderByAsc(InterestItem::orderNum)
        )
        val user = appUserMapper.selectById(userId) ?: throw BusinessException(BaseResultCode.USER_NOT_EXIST)
        val interestVectorUser: Map<InterestItemType, MutableMap<String, Int>> = mapOf(
            InterestItemType.SPORT to mutableMapOf(),
            InterestItemType.ENTERTAINMENT to mutableMapOf(),
            InterestItemType.NEWS to mutableMapOf(),
            InterestItemType.GAMING to mutableMapOf(),
            InterestItemType.ARTISTIC to mutableMapOf(),
            InterestItemType.LIFESTYLE to mutableMapOf(),
            InterestItemType.TECHNOLOGY to mutableMapOf(),
            InterestItemType.SOCIAL to mutableMapOf()
        )
        //遍历用户的兴趣
        interests.forEach {
            interestVectorUser[it.itemType!!]!![it.id.toString()] = 0
        }


        // 整理用户8个兴趣向,保持维度与兴趣设置一致，未选择的兴趣，其向量值设为0

        val userVector = AppUserVectorVo()
        userVector.id = user.id!!

        userVector.sport = this.mergeInterestVector(user.sport, interestVectorUser, InterestItemType.SPORT)
        userVector.entertainment =
            this.mergeInterestVector(user.entertainment, interestVectorUser, InterestItemType.ENTERTAINMENT)
        userVector.lifestyle = this.mergeInterestVector(user.lifestyle, interestVectorUser, InterestItemType.LIFESTYLE)
        userVector.artistic = this.mergeInterestVector(user.artistic, interestVectorUser, InterestItemType.ARTISTIC)
        userVector.gaming = this.mergeInterestVector(user.gaming, interestVectorUser, InterestItemType.GAMING)
        userVector.news = this.mergeInterestVector(user.news, interestVectorUser, InterestItemType.NEWS)
        userVector.technology =
            this.mergeInterestVector(user.technology, interestVectorUser, InterestItemType.TECHNOLOGY)
        userVector.social = this.mergeInterestVector(user.social, interestVectorUser, InterestItemType.SOCIAL)


        getMaxDistance(interestVectorUser, userVector)

        return userVector
    }

    private fun mergeInterestVector(
        userVector: Map<String, Int>?,
        interestVectorUser: Map<InterestItemType, MutableMap<String, Int>>,
        interestType: InterestItemType
    ): List<VectorItem> {
        var vectorMap: Map<String, Int>
        if (userVector == null) {
            vectorMap = interestVectorUser[interestType]!!
        }

        vectorMap = interestVectorUser[interestType]!!.mapValues { (k, _) -> userVector?.get(k) ?: 0 }
        return vectorMap.keys.map { VectorItem(it, vectorMap[it]!!) }
    }


    private fun pushInactiveUsersNotify(
        userInfo: AppUserInfo, title: String?, content: String?, jobId: Long?, operator: String?
    ) {
        executorService.execute {
            val result = contentFeignClient.userNotify(userInfo.id, userInfo.username, jobId, operator)
            if (!result) {
                pushListService.pushUserNotify(
                    userInfo.id, operator, title, content, jobId
                )
            }
        }
    }

    private fun checkUser(id: Long): AppUserInfo {
        return appUserMapper.selectById(id) ?: throw BusinessException(UserResultCode.USER_NOT_EXIST)
    }

}
