package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.controller.app.AppRulesController
import com.parsec.aika.common.model.vo.PageVo
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class AppRulesControllerTest {

    @Resource
    private lateinit var appRulesController: AppRulesController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/rules_init.sql")
    fun testGetAppRules() {
        val data = appRulesController.getAppRules(PageVo()).data
        assertEquals(data.total, 1)
        assertEquals(data.list.last().rule,  "rule1")
    }
}