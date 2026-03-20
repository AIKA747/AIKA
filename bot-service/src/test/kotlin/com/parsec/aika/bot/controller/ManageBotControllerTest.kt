package com.parsec.aika.bot.controller

import com.parsec.aika.bot.controller.manage.ManageBotController
import com.parsec.aika.bot.model.vo.req.PutAppBotIdReq
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class ManageBotControllerTest {

    @Resource
    private lateinit var manageBotController: ManageBotController

    @Resource
    private lateinit var botMapper: BotMapper

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_subscribed_init.sql")
    fun testPutManageBotId() {
        val req = PutAppBotIdReq().apply {
            this.avatar = "www.avatar.com"
            this.botCharacter = "tedian"
            this.botIntroduce = "jieshao"
            this.botName = "xiugaile"
            this.categoryId = 1001
            this.categoryName = "fenlanmingcheng"
            this.conversationStyle = "huidafengge"
            this.gender = Gender.HIDE
            this.personalStrength = "gerenshili"
            this.profession = "zhiye"
            this.rules = listOf()
            this.visibled = true
            this.age = 21
        }
        // 修改
        manageBotController.putManageBotId(1000000, req, LoginUserInfo())
        val bot = botMapper.selectById(1000000)
        assertEquals(bot.avatar, req.avatar)
    }


}