package com.parsec.aika.bot.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.core.collection.CollUtil
import cn.hutool.core.io.FileUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.config.RabbitmqConst.USER_BOT_INFO_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.USER_COUNT_DIRECT_EXCHANGE
import com.parsec.aika.bot.gpt.ChatMessage
import com.parsec.aika.bot.gpt.GptClient
import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.model.vo.resp.*
import com.parsec.aika.bot.remote.ContentFeignClient
import com.parsec.aika.bot.remote.OrderFeignClient
import com.parsec.aika.bot.remote.UserFeignClient
import com.parsec.aika.bot.service.*
import com.parsec.aika.common.mapper.*
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.model.vo.req.BotPostReq
import com.parsec.aika.common.util.ExcelUtil
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Lazy
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.ByteArrayOutputStream
import java.net.URL
import java.time.LocalDateTime
import java.util.*
import javax.annotation.PreDestroy
import javax.annotation.Resource

@Service
class BotServiceImpl : BotService {

    @Autowired
    private lateinit var gptClient: GptClient

    @Resource
    private lateinit var botMapper: BotMapper

    @Resource
    private lateinit var botTempMapper: BotTempMapper

    @Resource
    private lateinit var categoryMapper: CategoryMapper

    @Resource
    private lateinit var subscriptionMapper: BotSubscriptionMapper

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    @Resource
    private lateinit var rabbitMessageService: RabbitMessageService

    @Resource
    private lateinit var messageRecordMapper: MessageRecordMapper

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    @Resource
    private lateinit var roleProfessionMapper: RoleProfessionMapper

    @Resource
    private lateinit var botRateService: BotRateService

    @Resource
    private lateinit var orderFeignClient: OrderFeignClient

    @Resource
    private lateinit var syncAuthorService: SyncAuthorService

    @Lazy
    @Resource
    private lateinit var chatService: ChatService

    @Resource
    private lateinit var imageService: ImageService

    @Resource
    private lateinit var fileUploadService: FileUploadService

    @Resource
    private lateinit var contentFeignClient: ContentFeignClient

    @Resource
    private lateinit var userFeignClient: UserFeignClient

    @Resource
    private lateinit var groupChatRecordsService: GroupChatRecordsService

    private val executorService = ThreadUtil.newExecutor(5, 20)

    @PreDestroy
    fun destroy() {
        executorService.shutdown()
    }

    override fun appBotDetail(botId: Long, botStatus: BotStatusEnum?, loginUser: LoginUserInfo): AppBotDetailVO {
        val bot = botMapper.selectById(botId)
        Assert.notNull(bot, "The robot information does not exist")
        // 非机器人作者访问此接口，则直接返回Bot的相关信息。如果机器人已下架（botStatus=offline），则返回此机器人已下架的提示即可。
        if (bot.creator != loginUser.userId || botStatus == BotStatusEnum.online) {
            Assert.notEquals(bot.botStatus, BotStatusEnum.offline, "The robot has been taken down from the shelves")
            val resp = BeanUtil.copyProperties(bot, AppBotDetailVO::class.java)
            resp.commented = botRateService.canCommented(botId, loginUser.userId!!)
            //查询当前用户是否订阅该机器人
            val botSubscription = subscriptionMapper.selectOne(
                KtQueryWrapper(BotSubscription::class.java).eq(BotSubscription::botId, botId)
                    .eq(BotSubscription::userId, loginUser.userId).last("limit 1")
            )
            if (CollUtil.isNotEmpty(bot.album)) {
                resp.cover = bot.album?.first()
            }
            resp.subscribed = botSubscription != null
            if (resp.subscribed == true) {
                subscriptionMapper.update(
                    BotSubscription().apply {
                        this.lastReadAt = LocalDateTime.now()
                    },
                    KtUpdateWrapper(BotSubscription::class.java).eq(BotSubscription::botId, botId)
                        .eq(BotSubscription::userId, loginUser.userId)
                )
                if (null != botSubscription.botImage) {
                    if (StrUtil.isNotBlank(botSubscription.botImage!!.cover)) {
                        resp.cover = botSubscription.botImage!!.cover
                    }
                    if (StrUtil.isNotBlank(botSubscription.botImage!!.avatar)) {
                        resp.avatar = botSubscription.botImage!!.avatar
                    }
                }
            }
            return resp
        }
        // 机器人作者访问此接口，先取Bot_temp表里publishTime为空的记录，存在就返回之，如果不存在，则取Bot的记录返回之。
        val botTemp = botTempMapper.selectOne(
            KtQueryWrapper(BotTemp::class.java).eq(BotTemp::botId, botId).orderByDesc(BotTemp::id).last("limit 1")
        )
        val resp = if (Objects.isNull(botTemp)) {
            BeanUtil.copyProperties(bot, AppBotDetailVO::class.java)
        } else {
            BeanUtil.copyProperties(botTemp, AppBotDetailVO::class.java, "id")
        }
        resp.botStatus = bot.botStatus
        resp.id = botId
        resp.commented = false
        resp.subscribed = false
        resp.hasUpdated = if (resp.botStatus == BotStatusEnum.unrelease) {
            true
        } else {
            botTemp.dataVersion > 0
        }
        return resp
    }

    /**
     * app端新增机器人
     */
    override fun postAppBot(req: PostAppBotReq, loginUser: LoginUserInfo): BotDetailVO {
        this.checkSubscriber(loginUser)
        this.checkBotName(req.botName, null)
        val bot = BeanUtil.copyProperties(req, Bot::class.java)
        bot.botStatus = BotStatusEnum.unrelease
        bot.botSource = BotSourceEnum.userCreated
        bot.creator = loginUser.userId
        bot.creatorName = loginUser.username
        botMapper.insert(bot)
        // 机器人成功发布后发送下列消息到rabbitmq队列中，更新用户机器人数量
        rabbitMessageService.createBotRabbitMsg(loginUser.userId!!)
        val botTemp = BeanUtil.copyProperties(bot, BotTemp::class.java)
        botTemp.botId = bot.id
        botTemp.id = null
        botTemp.publishTime = null
        botTemp.dataVersion = 0
        botTempMapper.insert(botTemp)
        if (bot.botStatus == BotStatusEnum.online) {
            syncAuthorService.syncAuthor(AuthorSyncBO().apply {
                this.nickname = bot.botName
                this.username = bot.botName
                this.userId = bot.id!!
                this.bio = bot.botIntroduce
                this.avatar = bot.avatar
                this.gender = bot.gender
            })
        }
        return BeanUtil.copyProperties(bot, BotDetailVO::class.java)
    }

    /**
     * 校验机器人名称是否重复
     */
    private fun checkBotName(botName: String?, botId: Long?) {
        val count = botMapper.selectCount(KtQueryWrapper(Bot::class.java).eq(Bot::botName, botName).ne(Bot::id, botId))
        Assert.state(count == 0, "The robot name already exists")
    }

    /**
     * app端发布机器人
     */
    @Transactional
    override fun putAppBotIdRelease(id: Long, loginUser: LoginUserInfo) {
        this.checkSubscriber(loginUser)
        val botTemp = botTempMapper.selectOne(
            KtQueryWrapper(BotTemp::class.java).eq(BotTemp::botId, id).orderByDesc(BotTemp::id).last("limit 1")
        )
        Assert.notNull(botTemp, "The robot information does not exist")
        botTemp.botStatus = BotStatusEnum.online
        botTemp.publishTime = LocalDateTime.now()
        botTempMapper.updateById(botTemp)
        //复制最新的botTemp信息
        val bot = BeanUtil.copyProperties(
            botTemp,
            Bot::class.java,
            "id",
            "createdAt",
            "rating",
            "chatTotal",
            "subscriberTotal",
            "dialogues",
            "sortNo",
            "categoryId",
            "categoryName",
            "dataVersion"
        )
        botMapper.update(bot, KtUpdateWrapper(Bot::class.java).eq(Bot::id, id))

        //新建一个botTemp
        val botTemp1 = BeanUtil.copyProperties(bot, BotTemp::class.java, "id", "createdAt")
        botTemp1.id = null
        botTemp1.botStatus = BotStatusEnum.unrelease
        botTemp1.botId = id
        botTemp1.createdAt = LocalDateTime.now()
        botTemp1.updatedAt = LocalDateTime.now()
        botTemp1.dataVersion = 0
        botTempMapper.insert(botTemp1)
        executorService.execute {
            // 机器人成功发布后发送下列消息到rabbitmq队列中，更新用户最后一次发布机器人时间
            //查询用户最新发布的机器列表
            val bots = botMapper.selectReleaseBots(loginUser.userId)
            val data = JSONObject().apply {
                set("userId", loginUser.userId)
                set("lastReleaseBotAt", botTemp.publishTime)
                set("bots", bots)
                set("updateAt", botTemp.updatedAt)
            }
            rabbitTemplate.convertAndSend(USER_COUNT_DIRECT_EXCHANGE, USER_BOT_INFO_ROUTE_KEY, JSONUtil.toJsonStr(data))
        }
        if (bot.botStatus == BotStatusEnum.online) {
            syncAuthorService.syncAuthor(AuthorSyncBO().apply {
                this.nickname = bot.botName
                this.username = bot.botName
                this.userId = bot.id!!
                this.bio = bot.botIntroduce
                this.avatar = bot.avatar
                this.gender = bot.gender
            })
        }
        //是否创建机器人发帖任务
        if (bot.botStatus == BotStatusEnum.online && StrUtil.isNotBlank(bot.postingFrequecy) && StrUtil.isNotBlank(bot.postingPrompt)) {
            val baseResult = userFeignClient.createBotPostTask(bot.id!!, bot.postingFrequecy!!)
            Assert.state(baseResult.isSuccess, baseResult.msg)
        }
    }

    /**
     * app端获取自己的机器人列表
     */
    override fun getAppMyBots(req: GetAppMyBotsReq): PageResult<GetAppMyBotsResp> {
        PageHelper.startPage<GetAppMyBotsResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetAppMyBotsResp>().page(botMapper.getAppMyBots(req))

    }

    /**
     * app端获取推荐的机器人列表
     */
    override fun getAppRecommendBots(req: GetAppRecommendBotsReq): PageResult<GetAppRecommendBotsResp> {
        PageHelper.startPage<GetAppRecommendBotsResp>(req.pageNo!!, req.pageSize!!)
        val recommendBots = botMapper.getAppRecommendBots(req)
        recommendBots.forEach {
            if (JSONUtil.isTypeJSONObject(it.botImage)) {
                val botImage = JSONUtil.toBean(it.botImage, BotImage::class.java)
                if (StrUtil.isNotBlank(botImage.cover)) {
                    it.cover = botImage.cover
                }
                if (StrUtil.isBlank(botImage.avatar)) {
                    it.botAvatar = botImage.avatar
                }
            }
            if (StrUtil.isBlank(it.cover) && CollUtil.isNotEmpty(it.album)) {
                it.cover = it.album?.first()
            }
        }
        return PageUtil<GetAppRecommendBotsResp>().page(recommendBots)

    }

    /**
     * app端获取分类
     */
    override fun getAppBotCategory(req: GetAppBotCategoryReq): PageResult<GetAppBotCategoryResp> {
        PageHelper.startPage<GetAppBotCategoryResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetAppBotCategoryResp>().page(categoryMapper.getAppBotCategory(req))

    }

    /**
     * app端修改机器人
     */
    override fun putAppBotId(id: Long, req: PutAppBotIdReq, loginUser: LoginUserInfo): BotDetailVO {
        this.checkSubscriber(loginUser)
        val bot = botMapper.selectById(id)
        this.checkBotName(req.botName, id)
        Assert.notNull(bot, "The robot information does not exist")
        // 每次修改时，都需要去bot_temp表里，查询 publishTime 为空的记录
        var botTemp = botTempMapper.selectOne(
            KtQueryWrapper(BotTemp::class.java).eq(BotTemp::botId, id).isNull(BotTemp::publishTime).last("limit 1")
        )
        if (botTemp == null) {
            // 如果没有相关记录，就要复制Bot的相关记录，创建一条新的 bot_temp记录，并且设置publishTime为空。
            botTemp = BeanUtil.copyProperties(bot, BotTemp::class.java)
            BeanUtil.copyProperties(req, botTemp, "id")
            botTemp.botId = id
            botTemp.publishTime = null
            botTemp.updater = loginUser.userId
            botTemp.creatorName = loginUser.username
            botTemp.id = null
            botTemp.botStatus = BotStatusEnum.unrelease
            botTemp.createdAt = LocalDateTime.now()
            botTemp.updatedAt = LocalDateTime.now()
            botTempMapper.insert(botTemp)
        } else {
            // 如果有相关记录，就直接对此记录进行修改，注意，此时我们操作的表，是bot_temp表。
            BeanUtil.copyProperties(req, botTemp, "id")
            botTemp.publishTime = null
            botTemp.updater = loginUser.userId
            botTemp.creatorName = loginUser.username
            botTemp.botStatus = BotStatusEnum.unrelease
            botTemp.updatedAt = LocalDateTime.now()
            botTempMapper.updateById(botTemp)
        }
        if (bot.botStatus == BotStatusEnum.online) {
            syncAuthorService.syncAuthor(AuthorSyncBO().apply {
                this.nickname = bot.botName
                this.username = bot.botName
                this.userId = bot.id!!
                this.bio = bot.botIntroduce
                this.avatar = bot.avatar
                this.gender = bot.gender
            })
        }
        val botDetailVO = BeanUtil.copyProperties(botTemp, BotDetailVO::class.java)
        botDetailVO.id = id
        return botDetailVO
    }

    /**
     * 管理端修改机器人
     */
    override fun putManageBotId(id: Long, req: PutAppBotIdReq, loginUser: LoginUserInfo) {
        this.checkBotName(req.botName, id)
        val bot = botMapper.selectById(id)
        Assert.notNull(bot, "The robot information does not exist")
        var flag = false
        var oldCategoryId: Long? = null
        var categoryId: Long? = null
        if (req.categoryId != bot.categoryId) {
            flag = true
            oldCategoryId = bot.categoryId
            categoryId = req.categoryId
        }
        BeanUtils.copyProperties(req, bot)
        bot.updater = loginUser.userId
        bot.updatedAt = LocalDateTime.now()
        botMapper.updateById(bot)
        // 修改配置文件
//        updateProfile(req.digitalHumanProfile)
        //更新栏目机器人数量
        if (flag) {
            countBotUpdateCate(oldCategoryId, loginUser)
            countBotUpdateCate(categoryId, loginUser)
        }
        if (bot.botStatus == BotStatusEnum.online) {
            syncAuthorService.syncAuthor(AuthorSyncBO().apply {
                this.nickname = bot.botName
                this.username = bot.botName
                this.userId = bot.id!!
                this.bio = bot.botIntroduce
                this.avatar = bot.avatar
                this.gender = bot.gender
            })
        }
        //是否创建机器人发帖任务
        if (bot.botStatus == BotStatusEnum.online && StrUtil.isNotBlank(bot.postingFrequecy) && StrUtil.isNotBlank(bot.postingPrompt) && bot.postingEnable == true) {
            val baseResult = userFeignClient.createBotPostTask(bot.id!!, bot.postingFrequecy!!)
            Assert.state(baseResult.isSuccess, baseResult.msg)
        }
    }

    /**
     * 打招呼
     */
    override fun sayHello(botId: Long, userId: Long, username: String?): MessageRecord? {
        val bot = botMapper.selectById(botId)
        Assert.notNull(bot, "The robot information does not exist")
        if (StrUtil.isBlank(bot.greetWords)) {
            return null
        }

        // 保存会话
        val msg = MessageRecord().apply {
            this.botId = botId
            this.userId = userId
            this.sourceType = SourceTypeEnum.bot
            this.contentType = ContentType.TEXT
            this.readFlag = false
            this.textContent = bot.greetWords
            this.msgStatus = MsgStatus.success
            this.creator = userId
            this.creatorName = username
            this.createdAt = LocalDateTime.now()
        }
        //保存消息
        messageRecordMapper.insert(msg)
        //推送mqtt消息
        chatService.botSayHello("${UserTypeEnum.APPUSER.name}${userId}", msg)
        // 发送mq
        rabbitMessageService.sayHello(
            userId, bot.botName!!, bot.greetWords!!, ChatModule.bot, username, botId, bot.avatar
        )
        return msg
    }

    override fun appDeleteBot(botId: Long, loginUser: LoginUserInfo) {
        // 删除机器人。软删除，只用修改bot表中的软删除标志
        // 查询机器人对象
        val bot = botMapper.selectById(botId)
        Assert.notNull(bot, "The robot information does not exist")
        // 若当前登录用户不是机器人作者，则提示不可操作
        Assert.equals(bot.creator!!.toLong(), loginUser.userId, "机器人作者才能进行当前操作")
        botMapper.deleteById(botId)
        botTempMapper.delete(KtQueryWrapper(BotTemp::class.java).eq(BotTemp::botId, botId))
        // 发送消息到rabbitmq队列中，并更新当前用户机器人数量
        rabbitMessageService.createBotRabbitMsg(loginUser.userId!!.toLong())
        // 更新分类的bot数量
        if (null != bot.categoryId) {
            countBotUpdateCate(bot.categoryId, loginUser)
        }
    }

    /**
     * app端检索机器人
     */
    override fun getAppExploreBots(
        req: GetAppExploreBotsReq,
        loginUser: LoginUserInfo,
    ): PageResult<GetAppExploreBotsResp> {
        PageHelper.startPage<GetAppExploreBotsResp>(req.pageNo!!, req.pageSize!!)
        val list = botMapper.getAppExploreBots(req, loginUser.userId)
        if (StrUtil.isNotBlank(req.keyword) && list.isNotEmpty()) {
            stringRedisTemplate.opsForZSet().incrementScore(RedisKeyPrefix.botkeywordexplore.name, req.keyword!!, 1.0)
        }
        list.forEach {
            if (JSONUtil.isTypeJSONObject(it.botImage)) {
                val botImage = JSONUtil.toBean(it.botImage, BotImage::class.java)
                if (StrUtil.isNotBlank(botImage.cover)) {
                    it.cover = botImage.cover
                }
                if (StrUtil.isNotBlank(botImage.avatar)) {
                    it.botAvatar = botImage.avatar
                }
            }
        }
        val pageResult = PageUtil<GetAppExploreBotsResp>().page(list)
        if (null != req.categoryId) {
            val category = categoryMapper.selectById(req.categoryId!!)
            val botPageResult = BotPageResult<GetAppExploreBotsResp>()
            BeanUtil.copyProperties(pageResult, botPageResult)
            botPageResult.tags = category.tags
            return botPageResult
        }
        return pageResult
    }

    override fun manageBotRecommendDetail(botId: Long, loginUser: LoginUserInfo): ManageBotRecommendDetail {
        val bot = botMapper.selectById(botId)
        Assert.notNull(bot, "The robot information does not exist")
        val botDetail = ManageBotRecommendDetail()
        BeanUtils.copyProperties(bot, botDetail)
        botDetail.botId = bot.id
        return botDetail
    }

    override fun manageBotDetail(botId: Long, loginUser: LoginUserInfo): ManageBotDetailVO {
        val bot = botMapper.selectById(botId)
        Assert.notNull(bot, "The robot information does not exist")
        return BeanUtil.copyProperties(bot, ManageBotDetailVO::class.java)
    }

    /**
     * app端获取别人的机器人
     */
    override fun getAppOwnerBots(req: GetAppOwnerBotsReq): PageResult<GetAppOwnerBotsResp> {
        req.botOwnerIdList = req.botOwnerIds?.split(",")?.map { it.toLong() }
        PageHelper.startPage<GetAppOwnerBotsResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetAppOwnerBotsResp>().page(botMapper.getAppOwnerBots(req))
    }

    override fun manageCancelRecommend(botId: Long, loginUser: LoginUserInfo) {
        val bot = botMapper.selectById(botId)
        Assert.notNull(bot, "The robot information does not exist")
        if (bot.recommend == true) {
            botMapper.updateById(Bot().apply {
                this.id = bot.id
                this.recommend = false
            })
        }
    }

    /**
     * 设置机器人sort
     */
    override fun putManageBotRecommendSort(req: PutManageBotRecommendSortReq, user: LoginUserInfo) {
        val bot = botMapper.selectById(req.botId)
        Assert.notNull(bot, "The robot information does not exist")
        bot.sortNo = req.sortNo
        bot.updater = user.userId
        bot.updatedAt = LocalDateTime.now()
        botMapper.updateById(bot)
    }

    /**
     * 新增机器人
     */
    override fun postManageBot(req: PostManageBotReq, loginUser: LoginUserInfo): Long {
        val bot = Bot()
        BeanUtils.copyProperties(req, bot)
        bot.botStatus = BotStatusEnum.unrelease
        bot.botSource = BotSourceEnum.builtIn
        bot.creator = loginUser.userId!!.toLong()
        bot.creatorName = loginUser.username
        botMapper.insert(bot)
//        updateProfile(req.digitalHumanProfile)
        countBotUpdateCate(req.categoryId!!, loginUser)
        return bot.id
    }

    /**
     * 设置推荐机器人
     */
    override fun putManageBotRecommend(req: PutManageBotRecommendReq, user: LoginUserInfo) {
        val bot = botMapper.selectById(req.botId)
        Assert.notNull(bot, "The robot information does not exist")
        bot.sortNo = req.sortNo
        bot.recommend = true
        bot.recommendImage = req.recommendImage
        bot.recommendWords = req.recommendWords
        bot.recommendTime = LocalDateTime.now()
        bot.updater = user.userId
        bot.updatedAt = LocalDateTime.now()
        botMapper.updateById(bot)
    }

    /**
     * 设置机器人状态
     */
    override fun putManageBotStatus(req: PutManageBotStatusReq, user: LoginUserInfo) {
        val bot = botMapper.selectById(req.botId)
        Assert.notNull(bot, "The robot information does not exist")
        syncAuthorService.syncAuthor(AuthorSyncBO().apply {
            this.nickname = bot.botName
            this.username = bot.botName
            this.userId = bot.id!!
            this.bio = bot.botIntroduce
            this.avatar = bot.avatar
            this.gender = bot.gender
        })
        if (req.botStatus == BotStatusEnum.unrelease) return
        bot.botStatus = req.botStatus
        bot.updater = user.userId
        bot.updatedAt = LocalDateTime.now()
        botMapper.updateById(bot)
        //是否创建机器人发帖任务
        if (bot.botStatus == BotStatusEnum.online && StrUtil.isNotBlank(bot.postingFrequecy) && StrUtil.isNotBlank(bot.postingPrompt) && bot.postingEnable == true) {
            val baseResult = userFeignClient.createBotPostTask(bot.id!!, bot.postingFrequecy!!)
            Assert.state(baseResult.isSuccess, baseResult.msg)
        }
    }

    /**
     * 机器人推荐列表
     */
    override fun getManageBotRecommend(
        req: GetManageBotRecommendReq,
        loginUser: LoginUserInfo,
    ): PageResult<GetManageBotRecommendResp> {
        PageHelper.startPage<GetManageBotRecommendResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetManageBotRecommendResp>().page(botMapper.getManageBotRecommend(req))
    }

    /**
     * 机器人列表
     */
    override fun getManageBots(req: GetManageBotsReq, loginUser: LoginUserInfo): PageResult<GetManageBotsResp> {
        PageHelper.startPage<GetManageBotsResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetManageBotsResp>().page(botMapper.getManageBots(req))
    }

    override fun manageCategorySearchBot(
        queryVo: ManageCategoryBotQueryVo, user: LoginUserInfo
    ): PageResult<ManageCategoryBotListVo> {
        // 根据查询条件查询机器人信息
        PageHelper.startPage<ManageCategoryBotListVo>(queryVo.pageNo!!, queryVo.pageSize!!)
        return PageUtil<ManageCategoryBotListVo>().page(botMapper.selectBots(queryVo))
    }

    override fun getBotPofessions(pageVo: PageVo): PageResult<RoleProfession>? {
        PageHelper.startPage<ManageCategoryBotListVo>(pageVo.pageNo!!, pageVo.pageSize!!)
        return PageUtil<RoleProfession>().page(roleProfessionMapper.selectList(KtQueryWrapper(RoleProfession::class.java)))
    }

    /**
     * Your name is {name},{gender},{age} years old.
     * You are playing the role of a {role} with {Character}.You need to embody a character like this: {personal strength}.
     * You always maintain {conversation style}  when chatting with people. It is important to emphasize that when communicating with me, You must keep the following rules: {rules} .
     */
    override fun generatePrompt(
        botId: Long, test: Boolean, username: String?
    ): Pair<Bot, String> {
        //判断是否为测试消息
        val bot: Bot?
        if (test) {
            val botTemp = botTempMapper.selectOne(
                KtQueryWrapper(BotTemp::class.java).eq(BotTemp::botId, botId).orderByDesc(BotTemp::createdAt)
                    .last("limit 1")
            )
            if (Objects.nonNull(botTemp)) {
                bot = Bot()
                BeanUtils.copyProperties(botTemp, bot)
            } else {
                bot = botMapper.selectById(botId) ?: throw BusinessException("Robot not present or data error")
            }
        } else {
            bot = botMapper.selectById(botId) ?: throw BusinessException("Robot not present or data error")
            if (bot.botStatus != BotStatusEnum.online) {
                return Pair(bot, "The current session has failed. The robot status is ${bot.botStatus}.")
            }
        }
        val strBuilder = StringBuilder()
        if (StrUtil.isNotBlank(username)) {
            strBuilder.append("my name is ${username}, Let's start our chat!\r\n")
        }
        strBuilder.append(this.getPrompt(bot))
        return Pair(bot, strBuilder.toString())
    }

    private fun getPrompt(bot: Bot): String {
        val strBuilder = StringBuilder()
        strBuilder.append("Your name is ${bot.botName},${bot.gender},${bot.age} years old.\r\n")
            .append("Your role is a ${bot.profession} with ${bot.botCharacter}.")
            .append("You need to portray a character who ${bot.personalStrength}.")
            .append("You always maintain ${bot.conversationStyle} when chatting with people.")
            .append("It is important to emphasize that when communicating with me,")
        if (CollUtil.isNotEmpty(bot.rules)) {
            strBuilder.append("You must keep the following rules:\r\n")
            bot.rules!!.forEachIndexed { index, element ->
                strBuilder.append("${index + 1}.$element.\r\n")
            }
        }
        return strBuilder.toString()
    }

    override fun updateBotChatNum(botId: Long?) {
        executorService.execute {
            val bot = botMapper.selectById(botId) ?: throw BusinessException("Robot not present")
            StaticLog.info("更新机器人[$botId]聊天数据.....")
            val userIds = messageRecordMapper.selectList(
                KtQueryWrapper(MessageRecord::class.java).select(MessageRecord::userId).eq(MessageRecord::botId, botId)
            ).map { it.userId }
            bot.dialogues = userIds.distinct().size
            bot.chatTotal = userIds.size
            botMapper.updateById(bot)
        }
    }

    override fun deleteBot(id: Long): Int? {
        botMapper.deleteById(id)
        return messageRecordMapper.delete(KtUpdateWrapper(MessageRecord::class.java).eq(MessageRecord::botId, id))
    }

    override fun manageCategorySelectBots(
        queryVo: ManageCategoryBotQueryVo, user: LoginUserInfo
    ): PageResult<ManageCategoryBotListVo>? {
        // 根据查询条件查询机器人信息
        PageHelper.startPage<ManageCategoryBotListVo>(queryVo.pageNo!!, queryVo.pageSize!!)
        return PageUtil<ManageCategoryBotListVo>().page(botMapper.manageCategorySelectBots(queryVo))
    }

    /**
     * 更新bot的栏目的机器人数量
     */
    override fun countBotUpdateCate(categoryId: Long?, loginUser: LoginUserInfo) {
        if (categoryId == null) {
            return
        }
        executorService.execute {
            val botCount = botMapper.selectCount(KtQueryWrapper(Bot::class.java).eq(Bot::categoryId, categoryId))
            categoryMapper.update(Category().apply {
                this.botCount = botCount
                this.updater = loginUser.userId
            }, KtUpdateWrapper(Category::class.java).eq(Category::id, categoryId))
        }
    }

    /**
     * 校验是否为订阅者
     */
    private fun checkSubscriber(loginUser: LoginUserInfo) {
        val resp = orderFeignClient.getFeignUserSubscriptionExpiredTime(loginUser.userId!!, loginUser.country)
        StaticLog.debug("查询订阅这信息：{}", JSONUtil.toJsonStr(resp))
        if (Objects.isNull(resp.data)) {
            throw BusinessException(SubscribeResultCode.NOT_SUBSCRIBED)
        }
        if (resp.data!!.isBefore(LocalDateTime.now())) {
            throw BusinessException(SubscribeResultCode.SUBSCRIBED_EXPIRED)
        }
    }

    override fun existsByName(name: String): Boolean {
        return botMapper.selectCount(
            KtQueryWrapper(Bot::class.java).eq(Bot::botName, name)
        ) > 0
    }

    override fun createBotPost(botId: Long) {
        val bot = botMapper.selectById(botId) ?: throw BusinessException(BotPostResultCode.BOT_NOT_EXIST)
        if (bot.botStatus != BotStatusEnum.online || bot.postingEnable != true) {
            throw BusinessException(BotPostResultCode.BOT_NOT_ONLINE)
        }
        val messages = listOf(
            ChatMessage(
                "user",
                """Please publish a post containing a title, abstract, and a prompt for generating a cover image."""
            )
        )
        //生成帖文
        if (StrUtil.isNotBlank(bot.postingPrompt)) {
            val result = gptClient.send(
                bot.postingPrompt!!, chatmessages = messages, useFun = true, jsonProperties = JSONObject().apply {
                    this["type"] = "object"
                    this["properties"] = JSONObject().apply {
                        this["title"] = JSONObject().apply {
                            this["type"] = "string"
                            this["description"] = "title"
                        }
                        this["summary"] = JSONObject().apply {
                            this["type"] = "string"
                            this["description"] = "abstract"
                        }
                        this["imagePrompt"] = JSONObject().apply {
                            this["type"] = "string"
                            this["description"] = "prompt for generating a cover image"
                        }
                        this["topicTags"] = JSONObject().apply {
                            this["type"] = "string"
                            this["description"] = "topic tags, multiple separated by commas"
                        }
                    }
                    this["required"] = listOf("title", "summary", "imagePrompt", "topicTags")
                })
            StaticLog.info("deepseek生成贴文结果：{}", result)
            val json = JSONUtil.parseObj(result)
            val imagePrompt = json.getStr("imagePrompt")
            //生成图片
            val image = imageService.textToImage(imagePrompt)
            val imagePath = URL(image).toURI().path
            val suffix = FileUtil.getSuffix(imagePath)
            val contentType = FileUtil.getMimeType(imagePath)
            //将生成的图片上传到S3
            val cover = fileUploadService.uploadFile(image, suffix, contentType, "images")
            //生成帖文
            val botPostReq = BotPostReq().apply {
                this.botId = botId
                this.title = json.getStr("title")
                this.summary = json.getStr("summary")
                this.cover = cover
                this.topicTags = json.getStr("topicTags")
            }
            val createBotPost = contentFeignClient.createBotPost(botPostReq)
            StaticLog.info("feign创建帖文结果：{}", createBotPost)
            Assert.state(createBotPost.isSuccess, createBotPost.msg)
        }
    }

    override fun syncBotList() {
        val list = botMapper.selectList(KtQueryWrapper(Bot::class.java).ne(Bot::botStatus, BotStatusEnum.unrelease))
        list.forEach { bot ->
            syncAuthorService.syncAuthor(AuthorSyncBO().apply {
                this.nickname = bot.botName
                this.username = bot.botName
                this.userId = bot.id!!
                this.bio = bot.botIntroduce
                this.avatar = bot.avatar
                this.gender = bot.gender
            })
        }
    }

    override fun onlineStatus(botId: Long): Boolean? {
        return botMapper.selectById(botId)?.botStatus == BotStatusEnum.online
    }

    override fun replayAMsg(roomId: Int, botId: Long): String? {
        val bot = botMapper.selectById(botId) ?: return "The robot has been deleted"
        if (bot.botStatus != BotStatusEnum.online) {
            return "The robot is not online yet"
        }
        //查询群聊最新20条消息
        val records = groupChatRecordsService.queryChatroomRecords(roomId, 20)
        val messages = records.filter {
            StrUtil.isNotBlank(it.textContent)
        }.map { record ->
            if (record.sourceType == SourceTypeEnum.user) {
                ChatMessage(
                    "user", "[${record.nickname}]: ${record.textContent!!}"
                )
            } else {
                ChatMessage(
                    "assistant", record.textContent!!
                )
            }
        }
        if (CollUtil.isNotEmpty(messages)) {
            return gptClient.send(
                "You are a group chat assistant that helps multiple users engage in conversations and provides useful suggestions. ${bot.prompts}",
                returnJson = false,
                chatmessages = messages.reversed()
            )
        }
        return "The robot cannot understand the message, please use text description for clearer understanding"
    }

    override fun botConversationCount(): ByteArray? {
        //查询机器人会话人数
        val list = botMapper.botConversationCount()
        //创建工作簿
        val workbook = XSSFWorkbook()
        // 第一个 Category 数据
        val sheet1 = workbook.createSheet("Category")
        val data1 = ArrayList<List<String>>()
        data1.add(listOf("Catogery", "Conversation  Count"))
        val mapValues = list.groupBy({ it.getStr("categoryName") }, {
            it.getInt("userCount")
        }).mapValues {
            it.value.sum()
        }.toList().sortedByDescending { it.second }
        data1.addAll(mapValues.map {
            listOf(it.first.toString(), it.second.toString())
        })
        ExcelUtil.writeDataToSheet(data1, sheet1, workbook)

        val sheet2 = workbook.createSheet("Bot")
        val data2 = ArrayList<List<String>>()
        data2.add(listOf("Catogery", "Bot Name", "Conversation  Count"))
        data2.addAll(
            list.map {
                listOf(it.getStr("categoryName"), it.getStr("botName"), it.getStr("userCount", "0"))
            })
        ExcelUtil.writeDataToSheet(data2, sheet2, workbook)
        ByteArrayOutputStream().use { outputStream ->
            workbook.write(outputStream)
            return outputStream.toByteArray()
        }
    }
}
