package com.parsec.aika.bot.controller.app

import cn.hutool.log.StaticLog
import com.parsec.aika.bot.model.vo.req.ChatroomMsgLastTimeReq
import com.parsec.aika.bot.model.vo.req.LastTimeType
import com.parsec.aika.bot.service.ChatroomService
import com.parsec.aika.bot.service.GroupChatRecordsService
import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.SourceTypeEnum
import com.parsec.aika.common.model.entity.GroupChatRecords
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.exception.core.BusinessException
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@Rollback
@Transactional
@SpringBootTest
class AppGroupChatControllerTest {

    @Resource
    private lateinit var appGroupChatController: AppGroupChatController

    @Resource
    private lateinit var groupChatRecordsService: GroupChatRecordsService

    @Resource
    private lateinit var chatroomService: ChatroomService

    @Resource
    private lateinit var redisTemplate: RedisTemplate<String, Object>

    val user1 = LoginUserInfo().apply {
        userId = 1
        avatar = "1.jpg"
        username = "test1"
        nickname = "test2"
    }
    val user2 = LoginUserInfo().apply {
        userId = 2
        avatar = "1.jpg"
        username = "test1"
        nickname = "test2"
    }
    val user3 = LoginUserInfo().apply {
        userId = 3
        avatar = "1.jpg"
        username = "test1"
        nickname = "test2"
    }


    @BeforeEach
    fun before() {
        // 保存聊天记录
        groupChatRecordsService.saveChatRecord(1, GroupChatRecords().apply {
            this.uid = user1.userId
            this.st = SourceTypeEnum.user
            this.ct = ContentType.TEXT
            this.avatar = user1.avatar
            this.nn = user1.nickname
            this.txt = "test text"
            this.time = LocalDateTime.parse("2024-03-04T18:12:11")
        })
        groupChatRecordsService.saveChatRecord(1, GroupChatRecords().apply {
            this.uid = user1.userId
            this.st = SourceTypeEnum.user
            this.ct = ContentType.IMAGE
            this.avatar = user1.avatar
            this.nn = user1.nickname
            this.med = "http://www.xxx.com/1.jpg"
            this.fn = "image.jpg"
            this.time = LocalDateTime.parse("2099-03-04T15:12:11")
        })
        groupChatRecordsService.saveChatRecord(1, GroupChatRecords().apply {
            this.uid = user1.userId
            this.st = SourceTypeEnum.user
            this.ct = ContentType.VIDEO
            this.avatar = user1.avatar
            this.nn = user1.nickname
            this.med = "http://www.xxx.com/test.mp4"
            this.flength = 10.0
            this.fn = "test.mp4"
            this.time = LocalDateTime.parse("2099-03-04T15:12:12")
        })
        // 保存聊天记录
        groupChatRecordsService.saveChatRecord(2, GroupChatRecords().apply {
            this.uid = user1.userId
            this.st = SourceTypeEnum.user
            this.ct = ContentType.TEXT
            this.avatar = user1.avatar
            this.nn = user1.nickname
            this.txt = "test text"
            this.time = LocalDateTime.parse("2024-03-04T18:12:11")
        })
        groupChatRecordsService.saveChatRecord(2, GroupChatRecords().apply {
            this.uid = user1.userId
            this.st = SourceTypeEnum.user
            this.ct = ContentType.IMAGE
            this.avatar = user1.avatar
            this.nn = user1.nickname
            this.med = "http://www.xxx.com/1.jpg"
            this.time = LocalDateTime.parse("2026-03-04T15:12:11")
        })
        groupChatRecordsService.saveChatRecord(2, GroupChatRecords().apply {
            this.uid = user1.userId
            this.st = SourceTypeEnum.user
            this.ct = ContentType.TEXT
            this.avatar = user1.avatar
            this.nn = user1.nickname
            this.txt = "test last message"
            this.time = LocalDateTime.parse("2026-03-04T15:12:12")
        })
        StaticLog.info("初始化测试消息：success")

    }

    @AfterEach
    fun after() {
        redisTemplate.delete("group:chat:records:1")
        redisTemplate.delete("group:chat:records:2")
        StaticLog.info("删除测试消息：complated")
    }

    @Test
    @Sql(scripts = ["/sql/group_chatroom.sql"])
    fun getChatRecords() {
        // 场景1：正常用户查询
        val records1 = appGroupChatController.getChatRecords(1, 10, 1, user1)
        assertEquals(0, records1.code)
        assertEquals(3, records1.data.total)

        // 场景2：新用户+历史不可见
        val records2 = appGroupChatController.getChatRecords(1, 10, 1, user2)
        assertEquals(0, records2.code)
        assertEquals(0, records2.data.total)

        // 场景3：存在lastReadTime的查询
        val records3 = appGroupChatController.getChatRecords(1, 10, 1, user3)
        assertEquals(0, records3.code)
        assertEquals(2, records3.data.total)

        // 场景4：历史可见群聊查询
        val records4 = appGroupChatController.getChatRecords(1, 10, 2, user2)
        assertEquals(0, records4.code)
        assertEquals(3, records4.data.total)
        assertTrue { records4.data.list.first().createdAt!!.isAfter(records4.data.list.last().createdAt) }

        // 新增场景5：用户不在群聊中
        val exception = assertThrows<BusinessException> {
            appGroupChatController.getChatRecords(1, 10, 1, LoginUserInfo().apply { userId = 999 })
        }
        assertEquals("You are no longer in this chat group.", exception.message)

        // 新增场景6：用户状态非APPROVE
        val exception2 = assertThrows<BusinessException> {
            appGroupChatController.getChatRecords(1, 10, 2, LoginUserInfo().apply { userId = 4 })
        }
        assertEquals("You are no longer in this chat group.", exception2.message)
    }

    @Test
    @Sql(scripts = ["/sql/group_chatroom.sql"])
    fun chatroomMsgLastTime() {
        //用户2群聊1的消息读取完毕
        val baseResult = appGroupChatController.chatroomMsgLastTime(ChatroomMsgLastTimeReq().apply {
            roomIds = listOf(1)
            type = LastTimeType.LOAD
        }, user2)
        assertEquals(baseResult.code, 0)
        //加载时间为当前时间，查询聊天记录时，能够查询到2条记录
        val records2 = appGroupChatController.getChatRecords(1, 10, 1, user2)
        assertEquals(records2.code, 0)
        assertEquals(records2.data.total, 2)
    }

    @Test
    @Sql(scripts = ["/sql/group_chatroom.sql"])
    fun getChatroomFiles() {
        // 场景1：正常用户查询文件
        val baseResult = appGroupChatController.getChatroomFiles(1, 10, 1, null, user1)
        assertEquals(0, baseResult.code)
        assertEquals(2, baseResult.data.total)

        // 场景2：文件类型过滤
        val baseResult1 = appGroupChatController.getChatroomFiles(1, 10, 1, "image", user1)
        assertEquals(0, baseResult1.code)
        assertEquals(1, baseResult1.data.total)

        // 场景3：用户不在群聊中
        val exception = assertThrows<BusinessException> {
            appGroupChatController.getChatroomFiles(1, 10, 1, null, LoginUserInfo().apply { userId = 999 })
        }
        assertEquals("You are no longer in this chat group.", exception.message)

        // 场景4：用户状态非APPROVE
        val exception2 = assertThrows<BusinessException> {
            appGroupChatController.getChatroomFiles(1, 10, 2, null, LoginUserInfo().apply { userId = 4 })
        }
        assertEquals("You are no longer in this chat group.", exception2.message)

    }

    @Test
    @Sql(scripts = ["/sql/group_chatroom.sql"])
    fun getChatroomMemberNotifycation() {
        //空列表
        val baseResult = appGroupChatController.getChatroomMemberNotifycation(1, 10, null, user1)
        assertEquals(baseResult.code, 0)
        assertEquals(baseResult.data.total, 0)
        //场景：user1邀请user3进入群聊2，user3查询自己的邀请
        val notifycation = appGroupChatController.getChatroomMemberNotifycation(1, 10, null, user3)
        assertEquals(notifycation.code, 0)
        assertEquals(notifycation.data.total, 1)
        val resp = notifycation.data.list.first()!!
        //校验查询出来的信息
        assertEquals(resp.roomId, 2)
        assertEquals(resp.chatroomName, "TEST2")
        assertEquals(resp.creatorNickName, "test1")
    }

    @Test
    fun chatroomUnreadNum() {
        val unreadNum = chatroomService.chatroomUnreadNum(LocalDateTime.now(), 1)
        assertEquals(unreadNum, 2)
    }

//    @Test
//    fun lastMessageContent() {
//        //文本消息
//        val lastMessageContentAndTime = chatroomService.lastMessageContentAndTime(1)
//        assertEquals(lastMessageContentAndTime.first, "[VIDEO]")
//        val lastMessageContent2 = chatroomService.lastMessageContentAndTime(2)
//        assertEquals(lastMessageContent2.first, "test last message")
//    }

}
