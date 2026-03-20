package com.parsec.aika.user.controller

import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.mapper.PushListMapper
import com.parsec.aika.user.model.vo.req.GetPushListsReq
import com.parsec.aika.user.model.vo.req.PostPushListReq
import org.junit.jupiter.api.Test

import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource
import kotlin.test.assertEquals

@SpringBootTest
internal class ManagePushListControllerTest {

    @Resource
    private lateinit var managePushListController: ManagePushListController

    @Resource
    private lateinit var pushListMapper: PushListMapper

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/push_list_init.sql")
    fun testPushList() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1
            this.userType = UserTypeEnum.ADMINUSER
        }
        val result = managePushListController.getPushLists(GetPushListsReq().apply {
            this.title = "title"
            this.content = "content"
            this.operator = "yyl"
            this.minPushTime = "2024-01-17T13:07:21"
            this.maxPushTime = "2024-01-17T15:07:21"
        }, loginUser).data.list.last()
        assertEquals(result.title, "title")
        assertEquals(result.content, "content")
        assertEquals(result.pushTo, "all")
        assertEquals(result.soundAlert, true)
        assertEquals(result.operator, "yyl")
        assertEquals(result.received, 11)
        assertEquals(result.pushTotal, 11)

        val pushListId = managePushListController.getPushListId(result.id!!, loginUser).data
        assertEquals(result.title, pushListId.title)
        assertEquals(result.content, pushListId.content)
        assertEquals(result.pushTo, pushListId.pushTo)
        assertEquals(result.soundAlert, pushListId.soundAlert)
        assertEquals(result.operator, pushListId.operator)
        assertEquals(result.received, pushListId.received)
        assertEquals(result.pushTotal, pushListId.pushTotal)
        assertEquals(result.pushTime, pushListId.pushTime)
        assertEquals(result.createdAt, pushListId.createdAt)

    }

//    @Test
    @Rollback
    @Transactional
    @Sql("/sql/user_page.sql")
    fun testPostPushList() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1
            this.username = "yyl"
            this.userType = UserTypeEnum.ADMINUSER
        }
        managePushListController.postPushList(PostPushListReq().apply {
            this.title = "title"
            this.content = "content"
            this.pushTo = "all"
            this.soundAlert = true
        }, loginUser)

        val resp = pushListMapper.selectList(null).last()
        assertEquals(0, resp.received)
        assertEquals(2, resp.pushTotal)
        assertEquals("title", resp.title)
        assertEquals("content", resp.content)
        assertEquals("yyl", resp.operator)

    }
}