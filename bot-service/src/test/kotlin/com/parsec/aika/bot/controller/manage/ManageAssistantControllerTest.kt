package com.parsec.aika.bot.controller.manage

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.controller.manage.ManageAssistantController
import com.parsec.aika.bot.model.vo.req.ManageAssistantEditVo
import com.parsec.aika.common.mapper.AssistantMapper
import com.parsec.aika.common.model.em.RecommendStrategy
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.Assistant
import com.parsec.aika.common.model.entity.RuleElement
import com.parsec.aika.common.model.entity.RuleRule
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class ManageAssistantControllerTest {

    @Resource
    private lateinit var controller: ManageAssistantController

    @Resource
    private lateinit var mapper: AssistantMapper

    private var userInfo: LoginUserInfo = LoginUserInfo()

    @BeforeEach
    fun setBefore() {
        userInfo = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
    }

    @Test
    @Rollback
    @Transactional
    fun assistantTest() {
        // 新增/修改助手设置
        val rules = mutableListOf<RuleElement>()
        rules.add(RuleElement().apply {
            this.key = "不开心"
            this.rule = RuleRule().apply {
                this.answer = "ces"
                this.question = "nih"
                this.weight = "20"
            }
        })
        val digitaHumanService = mutableListOf<String>()
        digitaHumanService.add("asdf")
        digitaHumanService.add("fdgs")
        val vo = ManageAssistantEditVo().apply {
            this.maleAvatar =
                "https://img0.baidu.com/it/u=2383759541,1098368289&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
            this.femaleAvatar =
                "https://img0.baidu.com/it/u=1102326282,1067783974&fm=253&fmt=auto&app=138&f=JPEG?w=389&h=389"
            this.greetWords = "你好，有什么需要帮助的吗"
            this.age = 18
            this.profession = "助手"
            this.botCharacter = "开心果"
            this.personalStrength = "精通各种沟通、开导"
            this.answerStrategy = listOf("主打开导")
            this.botRecommendStrategy = RecommendStrategy.balance
            this.storyRecommendStrategy = RecommendStrategy.popular
            this.rules = rules
            this.salutationPrompts = "开心"
            this.salutationFrequency = 1
            this.prompts = "asdfadf"
            this.digitaHumanService = digitaHumanService
        }
        val nowDatas = mapper.selectList(KtQueryWrapper(Assistant::class.java))
        if (nowDatas.isEmpty()) {
            // 传入id，如果数据库无数据，则不论传入的vo是否有id，都是新增数据
            vo.id = 1000
            val result = controller.addOrEditAssistant(vo, userInfo)
            // 调用接口成功
            assertEquals(result.code, 0)
            // 返回的数据就是刚刚传入的数据
            assertEquals(result.data.maleAvatar, vo.maleAvatar)
            assertEquals(result.data.femaleAvatar, vo.femaleAvatar)
            assertEquals(result.data.greetWords, vo.greetWords)
            assertEquals(result.data.profession, vo.profession)
        } else {
            // 有数据，也只有一条数据
            assertEquals(nowDatas.size, 1)
            // 数据库已有数据，不传入id，也是修改数据
            val result = controller.addOrEditAssistant(vo, userInfo)
            // 调用接口成功
            assertEquals(result.code, 0)
            // 返回的数据就是刚刚传入的数据
            assertEquals(result.data.maleAvatar, vo.maleAvatar)
            assertEquals(result.data.femaleAvatar, vo.femaleAvatar)
            assertEquals(result.data.greetWords, vo.greetWords)
            assertEquals(result.data.profession, vo.profession)
            // id为查询出来的数据
            assertEquals(result.data.id, nowDatas[0].id)
        }

        // 查询助手设置
        val result = controller.getAssistantConfig(userInfo)
        assertEquals(result.code, 0)
        assertNotNull(result.data)
    }
}