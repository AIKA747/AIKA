package com.parsec.aika.bot.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.AppAssistantGenderReq
import com.parsec.aika.bot.model.vo.req.AppAssistantMsgRecordQueryVo
import com.parsec.aika.bot.model.vo.req.BadAnswerReq
import com.parsec.aika.bot.model.vo.req.ManageAssistantEditVo
import com.parsec.aika.bot.model.vo.resp.AppAssistantMsgRecordVo
import com.parsec.aika.bot.model.vo.resp.AppAssistantResp
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.bot.service.AssistantService
import com.parsec.aika.bot.service.ChatService
import com.parsec.aika.bot.service.RabbitMessageService
import com.parsec.aika.common.mapper.AssistantMapper
import com.parsec.aika.common.mapper.AssistantMsgRecordMapper
import com.parsec.aika.common.mapper.DigitalHumanProfileMapper
import com.parsec.aika.common.mapper.UserAssistantMapper
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.Assistant
import com.parsec.aika.common.model.entity.AssistantMsgRecord
import com.parsec.aika.common.model.entity.DigitalHumanProfile
import com.parsec.aika.common.model.entity.UserAssistant
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.annotation.Resource

@Service
class AssistantServiceImpl : AssistantService {

    @Resource
    private lateinit var assistantMapper: AssistantMapper

    @Resource
    private lateinit var userAssistantMapper: UserAssistantMapper

    @Resource
    private lateinit var assistantMsgRecordMapper: AssistantMsgRecordMapper

    @Resource
    private lateinit var digitalHumanProfileMapper: DigitalHumanProfileMapper

    @Resource
    private lateinit var rabbitMessageService: RabbitMessageService

    @Resource
    private lateinit var chatService: ChatService

    override fun manageAssistantEdit(assistant: ManageAssistantEditVo, user: LoginUserInfo): Assistant {
        val assistantVo = assistantMapper.selectOne(KtQueryWrapper(Assistant::class.java).last("limit 1"))
        val assistantSaveVo = Assistant().apply {
            this.maleAvatar = assistant.maleAvatar
            this.femaleAvatar = assistant.femaleAvatar
            this.greetWords = assistant.greetWords
            this.age = assistant.age
            this.profession = assistant.profession
            this.botCharacter = assistant.botCharacter
            this.personalStrength = assistant.personalStrength
            this.answerStrategy = assistant.answerStrategy
            this.botRecommendStrategy = assistant.botRecommendStrategy
            this.storyRecommendStrategy = assistant.storyRecommendStrategy
            this.rules = assistant.rules
            this.salutationPrompts = assistant.salutationPrompts
            this.salutationFrequency = assistant.salutationFrequency
            this.prompts = assistant.prompts
            this.digitaHumanService = assistant.digitaHumanService
            this.updatedAt = LocalDateTime.now()
        }
        if (assistantVo != null && assistantVo.id!! > 0) {
            assistantSaveVo.id = assistantVo.id
            assistantMapper.updateById(assistantSaveVo)
        } else {
            assistantSaveVo.createdAt = LocalDateTime.now()
            assistantMapper.insert(assistantSaveVo)
        }
        return assistantSaveVo
    }

    override fun manageAssistantDetail(): Assistant {
        val vo = assistantMapper.selectOne(KtQueryWrapper(Assistant::class.java).last("limit 1"))
        Assert.notNull(vo, "暂时没有助手配置信息")
        return vo
    }

    override fun appAssistantDetail(user: LoginUserInfo): AppAssistantResp {
        val vo = this.appAssistantDetail()
        val userSetting = this.getUserAssistant(user.userId!!)
        vo.userSettingGender = userSetting.gender
        // 查询男女助手的不同视频
        // 女性助手配置信息
        val femaleProfile = digitalHumanProfileMapper.selectOne(
            KtQueryWrapper(DigitalHumanProfile::class.java).eq(DigitalHumanProfile::profileType, ProfileType.assistant)
                .eq(DigitalHumanProfile::objectId, userSetting.assistantId)
                .eq(DigitalHumanProfile::gender, Gender.FEMALE).last("limit 1")
        )
        vo.femaleIdleVideo = femaleProfile?.idleVideo
        vo.femaleGreetVideo = femaleProfile?.greetVideo
        // 男性助手配置信息
        val maleProfile = digitalHumanProfileMapper.selectOne(
            KtQueryWrapper(DigitalHumanProfile::class.java).eq(DigitalHumanProfile::profileType, ProfileType.assistant)
                .eq(DigitalHumanProfile::objectId, userSetting.assistantId).eq(DigitalHumanProfile::gender, Gender.MALE)
                .last("limit 1")
        )
        vo.maleIdleVideo = maleProfile?.idleVideo
        vo.maleGreetVideo = maleProfile?.greetVideo
        return vo
    }

    override fun appAssistantUpdGender(vo: AppAssistantGenderReq, user: LoginUserInfo) {
        val userSetting = this.getUserAssistant(user.userId!!)
        userAssistantMapper.updateById(UserAssistant().apply {
            this.id = userSetting.id
            this.gender = vo.gender
        })
    }

    override fun appAssistantChatRecordList(
        req: AppAssistantMsgRecordQueryVo, user: LoginUserInfo
    ): PageResult<AppChatRecordListVo> {
        // 查询是否有用户与助手的关联信息，无则添加
        val userAssistant = this.getUserAssistant(user.userId!!)
        PageHelper.startPage<AppAssistantMsgRecordVo>(req.pageNo!!, req.pageSize!!)
        val page = PageUtil<AppChatRecordListVo>().page(assistantMsgRecordMapper.appMsgRecordList(req, user.userId!!))
        if (page.total == 0L) {
            //主动打个招呼
            this.assistantSayHello(user, userAssistant)
            return appAssistantChatRecordList(req, user)
        }
        return page
    }

    /**
     * 查询是否有用户与助手的关联信息，无则添加
     */
    override fun getUserAssistant(userId: Long, user: LoginUserInfo?): UserAssistant {
        // 查询最新的助手配置信息
        val vo = this.appAssistantDetail()
        Assert.notNull(vo, "暂时没有助手配置信息")
        val userSetting = userAssistantMapper.selectOne(
            KtQueryWrapper(UserAssistant::class.java).eq(UserAssistant::userId, userId).last("limit 1")
        )
        if (Objects.isNull(userSetting)) {
            // 如果根据用户未查询到关联信息，则设置个默认关联
            val settingVo = UserAssistant().apply {
                this.assistantId = vo.id
                this.userId = userId
                this.gender = Gender.FEMALE // 默认为女性
                this.createdAt = LocalDateTime.now()
            }
            if (null != user && user.gender == Gender.FEMALE) {
                settingVo.gender = Gender.MALE
            }
            userAssistantMapper.insert(settingVo)
            return settingVo
        }
        return userSetting
    }

    private fun assistantSayHello(user: LoginUserInfo, userAssistant: UserAssistant) {
        val assistantDetail = this.appAssistantDetail()
        assistantDetail.greetWords?.let {
            // 发送mq
            rabbitMessageService.sayHello(
                user.userId!!,
                "hi! ${user.username}",
                it,
                ChatModule.assistant,
                user.username,
                assistantDetail.id!!,
                if (user.gender == Gender.MALE) assistantDetail.maleAvatar else assistantDetail.femaleAvatar
            )
            // 保存会话
            val msg = AssistantMsgRecord().apply {
                this.assistantId = userAssistant.assistantId
                this.userId = userAssistant.userId
                this.assistantGender = userAssistant.gender
                this.sourceType = SourceTypeEnum.assistant
                this.contentType = ContentType.TEXT
                this.textContent = it
                this.creator = userAssistant.userId
                this.createdAt = LocalDateTime.now()
                this.digitHuman = false
                this.msgStatus = MsgStatus.success
                this.creatorName = user.username
            }
            assistantMsgRecordMapper.insert(msg)
            chatService.assistantSayHello("${UserTypeEnum.APPUSER.name}${user.userId}", msg)
        }
    }

    override fun generatePrompt(
        assistantId: Long, userAssistant: UserAssistant, locale: String, digitHuman: Boolean?, username: String?
    ): Pair<Assistant, String> {
        val assistant =
            assistantMapper.selectById(assistantId) ?: throw BusinessException("未查询到助手[$assistantId]信息")
        val strBuilder = StringBuilder()

        strBuilder.append("Let's role-play, you are a assistant, I'm ${username}.")
        strBuilder.append("you are ${userAssistant.gender},and ${assistant.age} years old,")
        strBuilder.append("Your profession is  ${assistant.profession}, \r\n ")
        strBuilder.append("Your experience covers ${assistant.botCharacter}. and ${assistant.personalStrength},\r\n")
        strBuilder.append("Remember, you always maintain ${assistant.answerStrategy} when chatting with people.\r\n")
        strBuilder.append("Please answer the following questions according to the template:\n")
//        val tempStrBuiler = StringBuilder()
        strBuilder.append("{")
        assistant.rules!!.forEach {
//            strBuilder.append("Question number (${it.key}): ").append(it.rule!!.question).append("\n")
            strBuilder.append(
                """ "${it.key}":"${it.rule!!.question}${
                    if (StrUtil.endWith(it.rule!!.question, "?")) "" else "?"
                } please return true or false","""
            )
        }
        strBuilder.append(
            """
                "recommendChatStory":"Do you think the user needs you to recommend games to him? please return true or false",
                "recommendChatStoryTags":"If recommendChatStory=true, please return the tag that recommends the story gameplay to the user, with multiple tags separated by commas",
                "generateImage": "the user ask you to respond to the content of the images? please return true or false",
                "assistingImage":"If generateImage returns true,Do users want to see photos of this assistant? please return true or false",
            	"imagePrompt": "If generateImage returns true and assistingImage returns false, then this field returns a prompt to generate the image",
                "language":"The language used for replying to messages,please return the language code of the International Organization for Standardization ISO 639-1 language code standard",
                "answer":"Reply to the user's latest message, the message content should not be empty and should be as concise and clear as possible"}
        """.trimIndent()
        )
        return Pair(assistant, strBuilder.toString())
    }

    override fun getPublicAssistantInfo(): AppAssistantResp? {
        val vo = this.appAssistantDetail()
        // 查询男女助手的不同视频
        // 女性助手配置信息
        val femaleProfile = digitalHumanProfileMapper.selectOne(
            KtQueryWrapper(DigitalHumanProfile::class.java).eq(DigitalHumanProfile::profileType, ProfileType.assistant)
                .eq(DigitalHumanProfile::objectId, vo.id).eq(DigitalHumanProfile::gender, Gender.FEMALE).last("limit 1")
        )
        vo.femaleIdleVideo = femaleProfile?.idleVideo
        vo.femaleGreetVideo = femaleProfile?.greetVideo
        // 男性助手配置信息
        val maleProfile = digitalHumanProfileMapper.selectOne(
            KtQueryWrapper(DigitalHumanProfile::class.java).eq(DigitalHumanProfile::profileType, ProfileType.assistant)
                .eq(DigitalHumanProfile::objectId, vo.id).eq(DigitalHumanProfile::gender, Gender.MALE).last("limit 1")
        )
        vo.maleIdleVideo = maleProfile?.idleVideo
        vo.maleGreetVideo = maleProfile?.greetVideo
        return vo
    }

    override fun badAnswer(req: BadAnswerReq) {
        val assistantMsgRecord =
            assistantMsgRecordMapper.selectById(req.msgId) ?: throw BusinessException("message not exit")
        Assert.state(
            assistantMsgRecord.sourceType == SourceTypeEnum.assistant, "Can only mark assistant reply messages"
        )
        assistantMsgRecord.badAnswer = req.badAnswer
        assistantMsgRecordMapper.updateById(assistantMsgRecord)
    }

    private fun appAssistantDetail(): AppAssistantResp {
        val assistant = assistantMapper.selectOne(
            KtQueryWrapper(Assistant::class.java).orderByDesc(Assistant::id).last("limit 1")
        ) ?: throw BusinessException("assistant data not configured")
        return BeanUtil.copyProperties(assistant, AppAssistantResp::class.java)
    }
}