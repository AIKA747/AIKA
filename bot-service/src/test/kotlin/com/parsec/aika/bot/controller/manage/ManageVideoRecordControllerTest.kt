package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.controller.manage.ManageBotDigitalHumanVideoController
import com.parsec.aika.bot.model.vo.req.GetManageBotDigitalHumanVideoRecordsReq
import com.parsec.aika.common.model.em.VideoRecordEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class ManageVideoRecordControllerTest {

    @Resource
    private lateinit var manageBotDigitalHumanVideoController: ManageBotDigitalHumanVideoController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_video.sql")
    fun testGetManageBotDigitalHumanVideoRecords() {
        val resp = manageBotDigitalHumanVideoController.getManageBotDigitalHumanVideoRecords(
            GetManageBotDigitalHumanVideoRecordsReq().apply { this.profileId },LoginUserInfo()
        ).data.list.last()
        assertEquals(2, resp.flag)
        assertEquals(VideoRecordEnum.talk, resp.type)
        assertEquals(1, resp.profileId)
        assertEquals("http://123.com", resp.videoUrl)
    }

}