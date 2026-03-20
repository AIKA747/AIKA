package com.parsec.aika.content.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.core.collection.CollUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.util.NumberUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.*
import com.parsec.aika.common.model.bo.StoryRecommendBO
import com.parsec.aika.common.model.dto.ChapterProcess
import com.parsec.aika.common.model.dto.MsgDTO
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.PostAppStoryRecorderReq
import com.parsec.aika.common.model.vo.resp.CategoryVo
import com.parsec.aika.common.model.vo.resp.GetAppStoryIdResp
import com.parsec.aika.common.model.vo.resp.GetAppStoryResp
import com.parsec.aika.common.model.vo.resp.PostAppStoryRecorderResp
import com.parsec.aika.common.util.ExcelUtil
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.config.RabbitmqConst.USER_COUNT_DIRECT_EXCHANGE
import com.parsec.aika.content.config.RabbitmqConst.USER_STORIES_INFO_ROUTE_KEY
import com.parsec.aika.content.gpt.ChatMessage
import com.parsec.aika.content.gpt.DeepseekClient
import com.parsec.aika.content.gpt.GptClient
import com.parsec.aika.content.model.vo.req.GetAppStoryReq
import com.parsec.aika.content.model.vo.req.ManageStoryCreateVo
import com.parsec.aika.content.model.vo.req.ManageStoryUpdateVo
import com.parsec.aika.content.service.StoryMessageService
import com.parsec.aika.content.service.StoryService
import com.parsec.aika.content.service.TranslateService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.redisson.api.RedissonClient
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.ByteArrayOutputStream
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.TimeUnit
import jakarta.annotation.Resource
import kotlin.math.exp

@Service
class StoryServiceImpl : StoryService {

    @Autowired
    private lateinit var rabbitTemplate: RabbitTemplate

    @Resource
    private lateinit var storyMapper: StoryMapper

    @Resource
    private lateinit var rewardsMapper: RewardsMapper

    @Resource
    private lateinit var storyRecorderMapper: StoryRecorderMapper

    @Resource
    private lateinit var storyChapterMapper: StoryChapterMapper

    @Resource
    private lateinit var storyPlayLogMapper: StoryPlayLogMapper

    @Resource
    private lateinit var storyChatLogMapper: StoryChatLogMapper

    @Resource
    private lateinit var collectStoryMapper: CollectStoryMapper

    @Resource
    private lateinit var giftMapper: GiftMapper

    @Resource
    private lateinit var giftRecorderMapper: GiftRecorderMapper

    @Resource
    private lateinit var categoryMapper: CategoryMapper

    @Lazy
    @Resource
    private lateinit var storyMessageService: StoryMessageService

    @Resource
    private lateinit var translateService: TranslateService

    @Resource
    private lateinit var deepseekClient: DeepseekClient

    @Resource
    private lateinit var gptClient: GptClient

    @Resource
    private lateinit var redissonClient: RedissonClient

    private final var storyRecorderLock = "story:recorder:lock"

    override fun replyToUser(userMessage: StoryChatLog, storyRecorder: StoryRecorder, locale: String?): MsgDTO {
        if (userMessage.contentType == ContentType.gift) {
            val giftJson = JSONObject(userMessage.json)
            val pair = this.receiveGift(storyRecorder.id!!, giftJson.getLong("id"), userMessage.creatorName)
            //标记用户消息已读
            userMessage.readFlag = true
            userMessage.readTime = LocalDateTime.now()
            storyChatLogMapper.updateById(userMessage)
            //更改未固定文本
            val message = translateService.translateLanguage(
                "Thank you for the gift of you sent, I think it's nice.", locale ?: "en"
            )
            return MsgDTO().apply {
                this.userId = userMessage.creator
                this.storyId = userMessage.storyId
                this.contentType = ContentType.TEXT
                this.message = message
                this.status = pair.second.first
                this.chapterProcess = pair.second.second
                this.gptJson = ""
            }
        }
        //查询故事章节的规则配置
        val chapter = storyChapterMapper.selectById(storyRecorder.chapterId)
        //调用chatgpt
        val respObj = this.getChatgptResp(storyRecorder, chapter)
        StaticLog.info("story: gptClient.resp:{}", respObj)
        var answer = respObj.getStr("answer") ?: respObj.getStr("myAnswer")
        var chapterProcess: ChapterProcess = ChapterProcess.current
        var gameStatus = GameStatus.PLAYING
        if (storyRecorder.status == GameStatus.PLAYING) {
            //将规则为true的规则筛选出来
            val chapterRules = chapter.chapterRule!!.filter {
                return@filter respObj.getBool(it.key, false)
            }.toList()
            //计算出生效的规则的 storyDegree  friendDegree
            val friendDegree = chapterRules.stream().mapToInt { it.rule!!.friendDegree!! }.sum()
            val storyDegree = chapterRules.stream().mapToInt { it.rule!!.storyDegree!! }.sum()
            val pair = this.updateScoreAndRecorder(
                storyRecorder.id!!, friendDegree, storyDegree, userMessage.textContent!!, userMessage.creatorName
            )
            chapterProcess = pair.second
            gameStatus = pair.first
            val chapterRulesList = chapterRules.filter { StrUtil.isNotBlank(it.rule!!.recommendAnswer) }.toList()
            if (CollUtil.isNotEmpty(chapterRulesList)) {
                val storyChapterRule = chapterRules.maxByOrNull { it.rule!!.weight!! }
                if (Objects.nonNull(storyChapterRule) && Objects.nonNull(storyChapterRule!!.rule) && StrUtil.isNotBlank(
                        storyChapterRule.rule!!.recommendAnswer
                    )
                ) {
                    answer = storyChapterRule.rule!!.recommendAnswer!!
                    respObj.set("answer", answer)
                    //gptClient.send(this.generateNewPrompt(storyRecorder, storyChapterRule!!.rule!!.recommendAnswer!!))
                }
            }
            if (gameStatus == GameStatus.SUCCESS) {
                //查询当前用户已完成的故事数量
                val count = storyRecorderMapper.selectCount(
                    KtQueryWrapper(StoryRecorder::class.java).eq(StoryRecorder::creator, storyRecorder.creator)
                        .eq(StoryRecorder::status, GameStatus.SUCCESS)
                )
                //异步更新用户完成故事数量统计信息
                rabbitTemplate.convertAndSend(
                    USER_COUNT_DIRECT_EXCHANGE, USER_STORIES_INFO_ROUTE_KEY, JSONObject().apply {
                        this["userId"] = storyRecorder.creator
                        this["count"] = count
                    }).toString()
            }
        }
        //标记用户消息已读
        userMessage.readFlag = true
        userMessage.readTime = LocalDateTime.now()
        userMessage.msgStatus = MsgStatus.success
        storyChatLogMapper.updateById(userMessage)
        return MsgDTO().apply {
            this.userId = storyRecorder.creator
            this.storyId = storyRecorder.storyId
            this.message = answer
            this.contentType = ContentType.TEXT
            this.status = gameStatus
            this.chapterProcess = chapterProcess
            this.gptJson = JSONUtil.toJsonStr(respObj)
        }

    }

    override fun generatePrompt(storyRecorder: StoryRecorder): String {
        //故事信息
        storyMapper.selectById(storyRecorder.storyId)
            ?: throw BusinessException("story[${storyRecorder.storyId}]does not exist")
        //查询章节信息
        val chapter = storyChapterMapper.selectById(storyRecorder.chapterId)
            ?: throw BusinessException("chapter[${storyRecorder.chapterId}]does not exist")
        //创建strBuilder
        val strBuilder =
            StringBuilder()/*.append("Let's do role-playing,information on the role you are playing:")*/.append(chapter.backgroundPrompt)
                .append(chapter.personality).append(".\r\n")
                .append("We are meeting for the first time, so your answers should be brief. You don't need to introduce your name to the other person.\r\n")
        //字数限制提示词：short简短回答（20字以内） normal普通篇幅（20-50）detail详细回答（50-100）
        val wordNumber = if ("short" == chapter.wordNumberPrompt) {
            "20"
        } else if ("normal" == chapter.wordNumberPrompt) {
            "20-50"
        } else {
            "50-100"
        }
        strBuilder.append("Finally, based on the chat history, provide a response to my new message.\r\n")
            .append("Please keep the language used to reply to the user consistent with the chat record.\r\n")
            .append("Keep your answer within $wordNumber words and place it in the template format in answer.\r\n")
        strBuilder.append("Please answer the following questions according to the template:\r\n")
        strBuilder.append("{")
        chapter.chapterRule!!.forEach {
            strBuilder.append(
                """ "${it.key}":"${it.rule!!.question}${
                    if (StrUtil.endWith(it.rule!!.question, "?")) "" else "?"
                } please return true or false","""
            )
        }
        strBuilder.append(""""answer":"your answer message, Request to reply to the user in the same language as their latest message."}""")
        return strBuilder.toString()
    }


    @Transactional(rollbackFor = [Exception::class])
    override fun updateScoreAndRecorder(
        storyRecorderId: Long, friendDegree: Int, storyDegree: Int, message: String, username: String?
    ): Pair<GameStatus, ChapterProcess> {
        //1.1、查询故事进度信息
        val storyRecorder = storyRecorderMapper.selectById(storyRecorderId)
            ?: throw BusinessException("story[${storyRecorderId}]does not exist")
        //1.2、保存游戏得分记录
        storyPlayLogMapper.insert(StoryPlayLog().apply {
            this.storyId = storyRecorder.storyId
            this.storyRecorderId = storyRecorderId
            this.chapterId = storyRecorder.chapterId
            this.friendDegree = friendDegree
            this.storyDegree = storyDegree
            this.reason = message
            this.creator = storyRecorder.creator
        })
        //1.3、查询故事本章节得分记录
        val storyPlayLogs = storyPlayLogMapper.selectList(
            KtQueryWrapper(StoryPlayLog::class.java).eq(StoryPlayLog::storyRecorderId, storyRecorderId)
                .eq(StoryPlayLog::chapterId, storyRecorder.chapterId)
        )
        //2.1、按 storyRecordId、chapterId 对 StoryPlayLog 表中的 storyDegree 进行统计，然后加上当前的storyDegree，更新到StoryRecorder中的storyDegree字段。
        storyRecorder.storyDegree = storyPlayLogs.stream().mapToInt { return@mapToInt it.storyDegree!! }.sum()
        //2.2、按 storyRecordId、storyId 对 StoryPlayLog 表中的 friendDegree 进行统计，然后加上当前的storyDegree，更新到StoryRecorder中的friendDegree字段。
        storyRecorder.friendDegree = storyPlayLogs.stream().mapToInt { return@mapToInt it.friendDegree!! }.sum()
        //2.3、查询当前章节(StoryChapter)的 chapterScore，利用以下公式计算 storyProcess 的值
        val storyChapter = storyChapterMapper.selectById(storyRecorder.chapterId)
            ?: throw BusinessException("chapter[${storyRecorder.chapterId}]does not exist")
        //最终计算得值，经过四舍六入五成双计算法，保留8位小数
        val s = storyRecorder.storyDegree!!.toDouble() / storyChapter.chapterScore!!.toDouble()
        storyRecorder.chapterProcess =
            NumberUtil.roundHalfEven(s / (s + exp(0.0 - storyRecorder.friendDegree!!)), 8).toDouble()
        StaticLog.info(
            "storyDegree:{}\tfriendDegree:{}\tchapterProcess:{}",
            storyRecorder.storyDegree,
            storyRecorder.friendDegree,
            storyRecorder.chapterProcess
        )
        //如果 storyProcess == 0 ，则 表示 此关失败，调用 changeChapter({storyRecordId},Forward.PREVIOUS) 退回到上一个章节，同时返回状态 FAIL。
        if (storyRecorder.chapterProcess!! < 0.0) {
            return this.changeChapter(storyRecorder, storyChapter, StoryService.Forward.PREVIOUS, username)
        }
        //如果 storyProcess == 1， 则表示 此关成功，调用 changeChapter({storyRecordId},Forward.NEXT) 进入下一个章节，同时返回状态 SUCCESS。
        if (storyRecorder.chapterProcess!! >= 1.0) {
            //查询用户在本章节聊天分钟数
            val chatMinutes = storyMessageService.getUserChatMinutes(storyRecorder.chapterId!!, storyRecorder.creator!!)
            //当章节配置的分钟数进行判断：  配置的分钟数为null  或  当前用户聊天分钟数达到了该章节配置的分钟数时
            if (Objects.isNull(storyChapter.chatMinutes) || chatMinutes >= storyChapter.chatMinutes!!) {
                return this.changeChapter(storyRecorder, storyChapter, StoryService.Forward.NEXT, username)
            }
        }
        //计算故事总进度
        storyRecorder.storyProcess = this.calcStoryProcess(storyRecorder)
        StaticLog.info("current========================>storyProcess:{}", storyRecorder.storyProcess)
        //如果 storyProcess∈(0,1)storyProcess\in{(0,1)}storyProcess∈(0,1) ， 则表示还在游戏中，更新storyRecorder，同时返回状态 PLAYING。
        storyRecorderMapper.updateById(storyRecorder)
        return Pair(GameStatus.PLAYING, ChapterProcess.current)
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun receiveGift(
        storyRecorderId: Long, giftId: Long, username: String?
    ): Pair<Gift, Pair<GameStatus, ChapterProcess>> {
        //查询礼物详情
        val gift = giftMapper.selectById(giftId) ?: throw BusinessException("Gift does not exist")
        //查询故事进度信息
        val storyRecorder = storyRecorderMapper.selectById(storyRecorderId)
            ?: throw BusinessException("story[${storyRecorderId}]does not exist")
        Assert.state(
            gift.storyId == null || storyRecorder.storyId == gift.storyId,
            "Receiving gift failed, unable to receive the gift in the current story"
        )
        Assert.state(
            gift.chapterId == null || storyRecorder.chapterId == gift.chapterId,
            "Receiving gift failed, unable to receive the gift in the current chapter"
        )
        giftRecorderMapper.insert(GiftRecorder().apply {
            this.storyRecorderId = storyRecorderId
            this.giftId = giftId
            this.creator = storyRecorder.creator
            this.storyDegree = gift.storyDegree
            this.friendDegree = gift.friendDegree
        })
        //查询故事进度
        return Pair(
            gift,
            updateScoreAndRecorder(storyRecorderId, gift.friendDegree!!, gift.storyDegree!!, "gift:${giftId}", username)
        )
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun changeChapter(
        storyRecorder: StoryRecorder, storyChapter: StoryChapter?, forward: StoryService.Forward, username: String?
    ): Pair<GameStatus, ChapterProcess> {
        var chapterProcess: ChapterProcess = ChapterProcess.current
        //查询当前章节信息
        val currentStoryChapter = storyChapter ?: storyChapterMapper.selectById(storyRecorder.chapterId)
        ?: throw BusinessException("chapter[${storyRecorder.chapterId}]does not exist")
        when (forward) {
            //切到下一个章节
            StoryService.Forward.NEXT -> {
                val chapter = storyChapterMapper.selectOne(
                    KtQueryWrapper(StoryChapter::class.java).eq(StoryChapter::storyId, storyRecorder.storyId)
                        .gt(StoryChapter::chapterOrder, currentStoryChapter.chapterOrder)
                        .orderByAsc(StoryChapter::chapterOrder).last("limit 1")
                )
                //下一个章节为空时,说明已通关
                if (Objects.isNull(chapter)) {
                    //查询故事得分
                    val story = storyMapper.selectById(storyRecorder.storyId)
                        ?: throw BusinessException("story[${storyRecorder.storyId}]does not exist")
                    storyRecorder.reward = story.rewardsScore
                    storyRecorder.status = GameStatus.SUCCESS
                    StaticLog.info("故事通过....")
                } else {
                    storyRecorder.chapterId = chapter.id
                    storyRecorder.chapterProcess = 0.1
                    storyRecorder.storyDegree = 1
                    storyRecorder.status = GameStatus.PLAYING
//                    storyRecorderMapper.updateById(storyRecorder)
                    StaticLog.info("故事进入下一章节成功....")
                    chapterProcess = ChapterProcess.next
                    //推送章节信息
                    storyMessageService.sendStoryMessageToUser(
                        storyRecorder, null, chapter.taskIntroduction, username, null, username
                    )
                }
            }
            //切到上一章节
            StoryService.Forward.PREVIOUS -> {
                val chapter = storyChapterMapper.selectOne(
                    KtQueryWrapper(StoryChapter::class.java).eq(StoryChapter::storyId, storyRecorder.storyId)
                        .lt(StoryChapter::chapterOrder, currentStoryChapter.chapterOrder)
                        .orderByAsc(StoryChapter::chapterOrder).last("limit 1")
                )
                //上一章节为空，说明该故事已失败
                if (Objects.isNull(chapter)) {
                    storyRecorder.status = GameStatus.FAIL
                    StaticLog.info("故事失败....")
                } else {
                    storyRecorder.chapterId = chapter.id
                    storyRecorder.storyDegree = 1
                    storyRecorder.status = GameStatus.PLAYING
                    storyRecorder.chapterProcess = 0.9
                    StaticLog.info("进入上一章节....")
                    chapterProcess = ChapterProcess.pre
                    //推送章节信息
                    storyMessageService.sendStoryMessageToUser(
                        storyRecorder, null, chapter.taskIntroduction, username, 0, username
                    )
                }
//                storyRecorderMapper.updateById(storyRecorder)
            }
        }
        storyRecorder.storyProcess = this.calcStoryProcess(storyRecorder)
        StaticLog.info("${forward.name}========================>storyProcess:{}", storyRecorder.storyProcess)
        storyRecorderMapper.updateById(storyRecorder)
        if (storyRecorder.status == GameStatus.SUCCESS) {
            //更新用户故事分
            this.updateUserRewards(storyRecorder.creator!!)
        }
        return Pair(storyRecorder.status!!, chapterProcess)
    }

    override fun updateUserRewards(userId: Long) {
        //查询用户得分记录
        var rewards = rewardsMapper.selectById(userId)
        //计算用户获奖总分
        val reward = storyRecorderMapper.calcUserReward(userId) ?: 0
        if (Objects.isNull(rewards)) {
            rewards = Rewards().apply {
                this.id = userId
                this.creator = userId
                this.reward = reward
                this.dataVersion = 1
            }
            rewardsMapper.insert(rewards)
            StaticLog.info("新增用户获奖总分记录..")
        } else {
            rewards.reward = reward
            rewardsMapper.updateById(rewards)
            StaticLog.info("更新用户获奖总分记录..")
        }

    }

    // 故事列表
    override fun getAppStory(req: GetAppStoryReq, loginUserInfo: LoginUserInfo): PageResult<GetAppStoryResp> {
        req.userId = loginUserInfo.userId
        val page = Page<GetAppStoryResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<GetAppStoryResp>().page(storyMapper.getAppStory(page, req))
    }

    // 故事详情
    override fun getAppStoryId(id: Long, loginUserInfo: LoginUserInfo): GetAppStoryIdResp {
        // 故事和存档
        val storyAndRecorder = getStoryAndRecorder(id, loginUserInfo.userId!!, false)
        val story = storyAndRecorder.first
        val storyRecorder = storyAndRecorder.second
        val resp = BeanUtil.copyProperties(story, GetAppStoryIdResp::class.java, "status")
        // 获取用户总积分
        val rewards = rewardsMapper.selectOne(
            KtQueryWrapper(Rewards::class.java).eq(
                Rewards::creator, loginUserInfo.userId
            ).last("limit 1")
        )?.reward ?: 0
        resp.unlocked = rewards < story.cutoffScore!!

        resp.image = story.defaultImage
        resp.status = GameStatus.NOT_STARTED
        resp.chapterProcess = 0.0
        resp.storyProcess = 0.0
        resp.backgroundPicture = story.defaultBackgroundPicture
        resp.backgroundPictureDark = story.defaultBackgroundPictureDark

        if (storyRecorder != null) {
            var storyChapter = storyChapterMapper.selectById(storyRecorder.chapterId)
            //对数据的默认修复操作
            if (Objects.isNull(storyChapter)) {
                storyChapter = storyChapterMapper.selectOne(
                    KtQueryWrapper(StoryChapter::class.java).eq(StoryChapter::storyId, storyRecorder.storyId)
                        .orderByAsc(StoryChapter::chapterOrder).last("limit 1")
                )
                if (Objects.nonNull(storyChapter)) {
                    storyRecorder.chapterId = storyChapter.id
                    storyRecorder.status = GameStatus.PLAYING
                    storyRecorderMapper.updateById(storyRecorder)
                }
            }
            storyChapter?.let {
                resp.image = it.image
                resp.introduction = it.summary
                resp.cover = it.cover
                resp.coverDark = it.coverDark
                resp.chapterId = it.id
                resp.passedPicture = it.passedPicture
                resp.passedCopywriting = it.passedCopywriting
                resp.chapterName = it.chapterName
                resp.backgroundPicture = it.backgroundPicture
                resp.backgroundPictureDark = it.backgroundPictureDark
            }
            if (null == storyRecorder.storyProcess) {
                storyRecorder.storyProcess = this.calcStoryProcess(storyRecorder)
                storyRecorderMapper.updateById(storyRecorder)
            }
            resp.status = storyRecorder.status
            resp.chapterProcess = storyRecorder.chapterProcess
            resp.storyProcess = storyRecorder.storyProcess
            resp.friendDegree = storyRecorder.friendDegree
        }
        if (StrUtil.isBlank(resp.introduction)) {
            resp.introduction = story.introduction
        }
        resp.collected = collectStoryMapper.selectCount(
            KtQueryWrapper(CollectStory::class.java).eq(CollectStory::storyId, id)
                .eq(CollectStory::creator, loginUserInfo.userId)
        ) > 0
        resp.category = this.queryCategoryForStory(story.categoryId)
        return resp
    }

    // 查看过关/失败的信息
    override fun getAppStoryIdChapter(
        id: Long, loginUserInfo: LoginUserInfo
    ): com.parsec.aika.common.model.vo.resp.GetAppStoryIdChapterResp {
        // 故事和存档
        val storyAndRecorder = getStoryAndRecorder(id, loginUserInfo.userId!!, false)
        val story = storyAndRecorder.first
        val storyRecorder = storyAndRecorder.second!!

        val resp = com.parsec.aika.common.model.vo.resp.GetAppStoryIdChapterResp()
        // 当前章节
        val currentChapter = storyChapterMapper.selectById(storyRecorder.chapterId)
        resp.id = currentChapter.id
        resp.storyId = id
        resp.chapterName = currentChapter.chapterName
        resp.image = currentChapter.image
        resp.status = storyRecorder.status

        when (storyRecorder.status!!) {
            // 失败
            GameStatus.FAIL -> {
                resp.copywriting = story.failureCopywriting
                resp.picture = story.failurePicture
            }
            // 成功
            GameStatus.SUCCESS -> {
                resp.copywriting = currentChapter.passedCopywriting
                resp.picture = currentChapter.passedPicture
            }
            // 游戏中返回上一个章节的数据
            GameStatus.PLAYING -> {
                val preChapter = storyChapterMapper.selectOne(
                    KtQueryWrapper(StoryChapter::class.java)
                        // 当前故事下的章节
                        .eq(StoryChapter::storyId, id)
                        // 章节顺序小于当前章节
                        .lt(StoryChapter::chapterOrder, currentChapter.chapterOrder)
                        // 降序排序
                        .orderByDesc(StoryChapter::chapterOrder)
                        // 获取到当前章节的上一个章节记录
                        .last("limit 1")
                )
                resp.copywriting = preChapter.passedCopywriting
                resp.picture = preChapter.passedPicture
            }

            GameStatus.NOT_STARTED -> {}
        }
        return resp
    }

    // 开始一个新的游戏
    @Transactional(rollbackFor = [Exception::class])
    override fun postAppStoryRecorder(
        req: PostAppStoryRecorderReq,
        loginUserInfo: LoginUserInfo,
    ): PostAppStoryRecorderResp {
        // 获取用户总积分
        val rewards = rewardsMapper.selectOne(
            KtQueryWrapper(Rewards::class.java).eq(
                Rewards::creator, loginUserInfo.userId
            )
        )?.reward ?: 0
        // 获取故事和第一个章节
        val story = storyMapper.selectById(req.storyId)
        Assert.state(rewards >= (story.cutoffScore ?: 0), "Story not unlocked")

        val rLock = redissonClient.getLock("$storyRecorderLock:${story.id}:${loginUserInfo.userId}")
        try {
            //加锁
            val locked = rLock.tryLock(15, TimeUnit.SECONDS)
            Assert.state(locked, "Frequent operations, try again later")
            //查询该用户的游戏存档
            val oldStoryRecorder = storyRecorderMapper.selectOne(
                KtQueryWrapper(StoryRecorder::class.java).eq(StoryRecorder::creator, loginUserInfo.userId)
                    .eq(StoryRecorder::storyId, story.id).orderByDesc(StoryRecorder::id).last("limit 1")
            )
            if (null != oldStoryRecorder) {
                if (GameStatus.SUCCESS == oldStoryRecorder.status) {
                    throw BusinessException("The story has been successfully cleared")
                }
//                if (GameStatus.PLAYING == oldStoryRecorder.status) {
//                    throw BusinessException("The story has begun")
//                }
                // 删档
                storyRecorderMapper.delete(
                    KtQueryWrapper(StoryRecorder::class.java).eq(StoryRecorder::storyId, req.storyId)
                        .eq(StoryRecorder::creator, loginUserInfo.userId)
                )
                //删除聊天记录
                storyChatLogMapper.delete(
                    KtUpdateWrapper(StoryChatLog::class.java).eq(StoryChatLog::creator, loginUserInfo.userId)
                        .eq(StoryChatLog::storyId, req.storyId)
                )
            }
            val firstChapter = storyChapterMapper.selectOne(
                KtQueryWrapper(StoryChapter::class.java).eq(StoryChapter::storyId, req.storyId)
                    .orderByAsc(StoryChapter::chapterOrder).last("limit 1")
            ) ?: throw BusinessException("The story has no chapters set up")

            // 创建新的
            val storyRecorder = StoryRecorder().apply {
                this.storyId = req.storyId
                this.chapterId = firstChapter.id
                this.chapterProcess = 0.01
                this.storyProcess = 0.01
                this.storyDegree = 1
                this.friendDegree = 0
                this.reward = 0
                this.status = GameStatus.PLAYING
                this.creator = loginUserInfo.userId
                this.dataVersion = 1
                this.preview = false
            }
            storyRecorderMapper.insert(storyRecorder)
            //发送故事任务信息给用户
            storyMessageService.sendStoryMessageToUser(
                storyRecorder,
                loginUserInfo.language,
                story.taskIntroduction,
                loginUserInfo.username,
                0,
                loginUserInfo.username
            )
            //推送章节信息
            storyMessageService.sendStoryMessageToUser(
                storyRecorder,
                loginUserInfo.language,
                firstChapter.taskIntroduction,
                loginUserInfo.username,
                0,
                loginUserInfo.username
            )
            return PostAppStoryRecorderResp().apply {
                this.id = firstChapter.id
                this.storyId = story.id
                this.chapterName = firstChapter.chapterName
                this.image = firstChapter.image
                this.picture = firstChapter.cover
                this.copywriting = firstChapter.introduction
                this.status = storyRecorder.status
            }
        } finally {
            //释放锁
            if (rLock.isHeldByCurrentThread && rLock.isLocked) {
                rLock.unlock()
            }
        }
    }

    override fun getStoryAndRecorder(storyId: Long, userId: Long, preview: Boolean): Pair<Story, StoryRecorder?> {
        val story = storyMapper.selectById(storyId)
        Assert.notNull(story, "The story does not exist")
        // 存档
        val storyRecorder = storyRecorderMapper.selectOne(
            KtQueryWrapper(StoryRecorder::class.java).eq(StoryRecorder::creator, userId)
                .eq(StoryRecorder::storyId, story.id).eq(StoryRecorder::preview, preview).orderByDesc(StoryRecorder::id)
                .last("limit 1")
        )
        return Pair(story, storyRecorder)
    }

    override fun manageStoryList(req: com.parsec.aika.common.model.vo.req.ManageStoryQueryVo): PageResult<com.parsec.aika.common.model.vo.resp.ManageStoryListVo> {
        val page = Page<com.parsec.aika.common.model.vo.resp.ManageStoryListVo>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<com.parsec.aika.common.model.vo.resp.ManageStoryListVo>().page(storyMapper.manageStoryList(page, req))
    }

    override fun manageStoryCreate(vo: ManageStoryCreateVo, user: LoginUserInfo): Long {
        // 验证故事名称是否已存在
        val checkName = storyMapper.selectOne(
            KtQueryWrapper(Story::class.java).eq(Story::storyName, vo.storyName).last("limit 1")
        )
        Assert.isNull(checkName, "The story name already exists")
        val categories = categoryMapper.selectList(
            KtQueryWrapper(Category::class.java).`in`(Category::id, vo.categoryId)
        )
        Assert.equals(vo.categoryId!!.size, categories.size, "The category is abnormal")
        val storyVo = Story()
        BeanUtils.copyProperties(vo, storyVo)
        storyVo.cover = vo.cover ?: vo.coverDark
        storyVo.coverDark = vo.coverDark ?: vo.cover
        storyVo.defaultBackgroundPicture = vo.defaultBackgroundPicture ?: vo.defaultBackgroundPictureDark
        storyVo.defaultBackgroundPictureDark = vo.defaultBackgroundPictureDark ?: vo.defaultBackgroundPicture
        storyVo.listCover = vo.listCover ?: vo.listCoverDark
        storyVo.listCoverDark = vo.listCoverDark ?: vo.listCover
        storyVo.status = StoryStatus.invalid
        storyVo.creator = user.userId
        storyVo.createdAt = LocalDateTime.now()
        storyVo.salutationContent = vo.salutationContent
        storyMapper.insert(storyVo)
        return storyVo.id!!
    }

    override fun manageStoryUpdate(vo: ManageStoryUpdateVo, user: LoginUserInfo): Story {
        // 验证id是否存在
        val storyVo = storyMapper.selectById(vo.id)
        Assert.notNull(storyVo, "The story information does not exist")
        // 验证故事名称是否已存在
        val checkName = storyMapper.checkStoryName(vo.storyName!!, vo.id!!)
        Assert.isNull(checkName, "The story name already exists")
        val categories = categoryMapper.selectList(
            KtQueryWrapper(Category::class.java).`in`(Category::id, vo.categoryId)
        )
        Assert.equals(vo.categoryId!!.size, categories.size, "The category is abnormal")
        BeanUtils.copyProperties(vo, storyVo)
        storyVo.updatedAt = LocalDateTime.now()
        storyMapper.updateById(storyVo)
        return storyVo
    }

    override fun manageStoryDelete(id: Long, user: LoginUserInfo) {
        // 验证id是否存在
        val storyVo = storyMapper.selectById(id)
        Assert.notNull(storyVo, "The story information does not exist")
        storyMapper.deleteById(id)
    }

    override fun manageStoryUpdateStatus(
        vo: com.parsec.aika.common.model.vo.req.ManageStoryUpdateStatusVo, user: LoginUserInfo
    ) {
        // 验证id是否存在
        val storyVo = storyMapper.selectById(vo.id)
        Assert.notNull(storyVo, "The story information does not exist")
        // 设置状态
        storyMapper.updateById(Story().apply {
            this.id = vo.id
            this.status = vo.status
            this.updatedAt = LocalDateTime.now()
        })
    }

    override fun manageStoryDetail(id: Long): Story {
        // 验证id是否存在
        val storyVo = storyMapper.selectById(id)
        Assert.notNull(storyVo, "The story information does not exist")
        storyVo.category = this.queryCategoryForStory(storyVo.categoryId)
        return storyVo
    }

    override fun storyRecommend(
        userId: Long, tags: List<String>, recommendStrategy: RecommendStrategy
    ): StoryRecommendBO? {
        // 获取分数
        val userRewards = rewardsMapper.selectOne(KtQueryWrapper(Rewards::class.java).eq(Rewards::creator, userId))
        val rewards = if (Objects.isNull(userRewards)) 0 else userRewards.reward!!
        // 获取没有玩过并且按照RecommendStrategy排序的故事
        var storyList = storyMapper.storyRecommend(tags, recommendStrategy, userId)
        if (storyList.isEmpty()) storyList = storyMapper.storyRecommend(null, recommendStrategy, userId)
        if (storyList.isEmpty()) {
            return null
        }
        //先从未玩过的里边选
        val storyList1 = storyList.filter { it.recorderUserId != userId }
        val storyList2 = storyList1.ifEmpty { storyList }
        // 如果有分数够的，则直接获取第一个
        val story = if (storyList2.any { it.cutoffScore!! <= rewards }) {
            storyList2.first { it.cutoffScore!! <= rewards }
        } else {
            // 如果分数都不够，则获取分数最小的
            val min = storyList2.minByOrNull { it.cutoffScore!! }!!.cutoffScore!!
            storyList2.first { it.cutoffScore == min }
        }
        val recommendBO = BeanUtil.copyProperties(story, StoryRecommendBO::class.java)
        recommendBO.storyId = story.id.toString()
        recommendBO.cover = story.listCover
        return recommendBO
    }

    override fun storyPreview(storyId: Long?, chapterId: Long?, userId: Long?): StoryRecorder? {
        val story = storyMapper.selectById(storyId) ?: throw BusinessException("The story information does not exist")
        val chapter = storyChapterMapper.selectById(chapterId)
            ?: throw BusinessException("The chapter information does not exist")
        Assert.state(story.id == chapter.storyId, "The story does not have this chapter")

        var storyRecorder = storyRecorderMapper.selectOne(
            KtQueryWrapper(StoryRecorder::class.java).eq(StoryRecorder::preview, true)
                .eq(StoryRecorder::storyId, storyId).eq(StoryRecorder::creator, userId)
                .orderByDesc(StoryRecorder::createdAt).last("limit 1")
        )
        if (Objects.isNull(storyRecorder)) {
            // 创建新的
            storyRecorder = StoryRecorder().apply {
                this.storyId = storyId
                this.chapterId = chapterId
                this.chapterProcess = 0.01
                this.storyProcess = 0.01
                this.storyDegree = 1
                this.friendDegree = 0
                this.reward = 0
                this.status = GameStatus.PLAYING
                this.creator = userId
                this.dataVersion = 1
                this.preview = true
            }
            storyRecorderMapper.insert(storyRecorder)
        } else {
            storyRecorder.chapterId = chapterId
            storyRecorder.chapterProcess = 0.01
            storyRecorder.storyProcess = 0.01
            storyRecorder.storyDegree = 1
            storyRecorder.friendDegree = 0
            storyRecorder.reward = 0
            storyRecorder.status = GameStatus.PLAYING
            storyRecorderMapper.updateById(storyRecorder)
        }

        return storyRecorder
    }

    override fun calcStoryProcess(storyRecorder: StoryRecorder): Double? {
        return when (storyRecorder.status) {
            GameStatus.SUCCESS -> {
                1.0
            }

            GameStatus.FAIL -> {
                0.0
            }

            GameStatus.NOT_STARTED -> {
                0.0
            }

            else -> {
                //查询故事所有章节
                val chapters = storyChapterMapper.selectList(
                    KtQueryWrapper(StoryChapter::class.java).eq(StoryChapter::storyId, storyRecorder.storyId)
                        .orderByAsc(StoryChapter::chapterOrder)
                )
                val storyChapter = chapters.stream().filter {
                    it.id == storyRecorder.chapterId
                }.findFirst().get()
                val i = chapters.indexOf(storyChapter).toDouble()
                val n = chapters.size.toDouble()
                //计算章节进度
                NumberUtil.roundHalfEven(i / n + (1 / n) * storyRecorder.chapterProcess!!, 8).toDouble()
            }
        }
    }

    override fun userNotify(userId: Long, username: String?, jobId: Long, operator: String?): Boolean {
        //查询用户最近一次的聊天记录
        val userChatLog = storyChatLogMapper.selectOne(
            KtQueryWrapper(StoryChatLog::class.java).eq(StoryChatLog::creator, userId).orderByDesc(StoryChatLog::id)
                .last("limit 1")
        ) ?: null
        if (null != userChatLog) {
            val storyRecorder = storyRecorderMapper.selectById(userChatLog.storyRecorderId) ?: return false
            val chapter = storyChapterMapper.selectById(storyRecorder.chapterId) ?: return false
            val respObj = getChatgptResp(storyRecorder, chapter)
            StaticLog.info("story: gptClient.resp:{}", respObj)
            val answer = respObj.getStr("answer") ?: respObj.getStr("myAnswer")
            if (StrUtil.isBlank(answer)) {
                return false
            }
            storyMessageService.sendStoryMessageToUser(
                storyRecorder, null, answer, username, jobId, operator
            )
            return true
        }
        return false
    }

    override fun storyUserCount(): ByteArray? {
        val list = storyRecorderMapper.storyUserCount()
        val workbook = XSSFWorkbook()
        val sheet = workbook.createSheet("Story")
        val data = ArrayList<List<String>>()
        data.add(listOf("Story Name", "Progress Count", "Finish Count"))
        data.addAll(list.map {
            listOf(it.getStr("storyName"), it.getStr("progressCount"), it.getStr("finishCount"))
        })
        ExcelUtil.writeDataToSheet(data, sheet, workbook)
        ByteArrayOutputStream().use { outputStream ->
            workbook.write(outputStream)
            return outputStream.toByteArray()
        }
    }

    private fun getChatgptResp(
        storyRecorder: StoryRecorder, chapter: StoryChapter, useRule: Boolean? = null
    ): JSONObject {
        //生成prompt
        val prompt = this.generatePrompt(storyRecorder)
        //查询用户该章节的聊天记录,仅查询最后10条记录
        val chatLogs = storyChatLogMapper.selectList(
            KtQueryWrapper(StoryChatLog::class.java).eq(StoryChatLog::storyRecorderId, storyRecorder.id)
                .eq(StoryChatLog::chapterId, storyRecorder.chapterId).orderByDesc(StoryChatLog::createdAt)
                .last("limit 50")
        )
        //发送消息给gpt，并得到响应
        val chatmessages = chatLogs.reversed().filter {
            StrUtil.isNotBlank(it.textContent)
        }.map {
            if (it.sourceType == SourceTypeEnum.user) {
                ChatMessage("user", it.textContent!!)
            } else {
                if (!JSONUtil.isTypeJSONObject(it.gptJson)) {
                    val strBuilder = StringBuilder()
                    strBuilder.append("{")
                    chapter.chapterRule!!.forEach {
                        strBuilder.append(
                            """"${it.key}":true,"""
                        )
                    }
                    strBuilder.append(""""answer":"${it.textContent}"}""")
                    it.gptJson = strBuilder.toString()
                }
                ChatMessage("assistant", JSONUtil.toJsonStr(it.gptJson))
            }
        }
//        val properties = JSONObject()
//        properties["answer"] = JSONObject().apply {
//            this["type"] = "string"
//            this["description"] =
//                "your answer message, Request to reply to the user in the same language as their latest message."
//        }
//        if(useRule == true){
//            chapter.chapterRule!!.forEach {
//                properties[it.key] = JSONObject().apply {
//                    this["type"] = "boolean"
//                    this["description"] =
//                        """${it.rule!!.question}${if (StrUtil.endWith(it.rule!!.question, "?")) "" else "?"} please return true or false"""
//                }
//            }
//        }
//        val jsonProperties = JSONObject()
//        jsonProperties["type"] = "object"
//        jsonProperties["properties"] = properties
//        jsonProperties["required"] = properties.keys
//        val respStr =
//            gptClient.send(prompt, chatmessages = chatmessages, useFun = true, jsonProperties = jsonProperties)
        val respStr = deepseekClient.send(prompt, chatmessages = chatmessages)
        return JSONUtil.parseObj(respStr)
    }

    private fun queryCategoryForStory(categoryId: List<Long>?): List<CategoryVo> {
        if (categoryId.isNullOrEmpty()) {
            return emptyList()
        }
        return this.categoryMapper.selectList(
            KtQueryWrapper(Category::class.java).`in`(Category::id, categoryId)
        ).map {
            CategoryVo().apply {
                this.id = it.id
                this.name = it.name
                this.weight = it.weight
            }
        }.toList()
    }
}
