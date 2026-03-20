package com.parsec.aika.bot.service

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.fasterxml.jackson.databind.ObjectMapper
import com.parsec.aika.bot.controller.app.AppChatroomController
import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.remote.UserFeignClient
import com.parsec.aika.common.model.dto.AppUserVO
import com.parsec.aika.common.model.dto.ChatroomMemberVo
import com.parsec.aika.common.model.dto.PermissionVo
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.ChatroomGroupTypeEnum
import com.parsec.aika.common.model.em.GroupMemberRole
import com.parsec.aika.common.model.em.GroupMemberStatus
import com.parsec.aika.common.model.entity.ChatroomMember
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.`when`
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class AppChatroomServiceImplTest {
    @Resource
    private lateinit var appChatroomService: AppChatroomService

    @Resource
    private lateinit var appChatroomController: AppChatroomController

    @Resource
    private lateinit var chatroomService: ChatroomService

    @Resource
    private lateinit var objectMapper: ObjectMapper

    @Resource
    private lateinit var chatroomMemberService: ChatroomMemberService

    @MockBean
    private lateinit var userFeignClient: UserFeignClient

    @Test
    @Transactional
    @Rollback
    fun `createChatroom with valid request should success`() {

        val userInfo = AppUserVO().apply {
            id = 2L
            username = "newuser"
            allowJoinToChat = false
        }

        // 模拟用户服务返回
        `when`(userFeignClient.userInfo(2L)).thenReturn(userInfo)


        // Given
        val user = LoginUserInfo().apply {
            userId = 1L; nickname = "TestUser"; username = "TestUsername"; avatar = "http:xx.com/a.jpg"
        }
        val req = AppChatroomCreatReq().apply {
            roomName = "Test Room"
            groupType = ChatroomGroupTypeEnum.PUBLIC
            roomAvatar = "avatar.jpg"
            description = "Test description"
            permissions = listOf(PermissionVo().apply {  memberRole =GroupMemberRole.ADMIN.name; changeGroupInfo = true})
            members = listOf(ChatroomMemberVo().apply {
                memberId = 2
                username = "TestUser"
                nickname = "TestUsername"
                avatar = "http:xx.com"
                memberType = AuthorType.USER
            })
        }

        // When
        val roomId = appChatroomService.createChatroom(req, user)

        // Then
        val chatrooms = chatroomService.list()
        assertEquals(1, chatrooms.size)
        with(chatrooms[0]!!) {
            assertEquals("Test Room", roomName)
            assertEquals(ChatroomGroupTypeEnum.PUBLIC, groupType)
            assertEquals(user.userId, creator)
            assertEquals(200,memberLimit)
        }

        val members = chatroomMemberService.list(
            KtQueryWrapper(ChatroomMember::class.java)
                .eq(ChatroomMember::roomId, roomId)
        )
        assertEquals(2, members.size)
        assertEquals( GroupMemberStatus.FRIEND_INVITE,members[1]!!.status)

    }


    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `updateChatroom update by owner should success`() {
        // Given
        val user = LoginUserInfo().apply { userId = 1L }
        val req = AppChatroomUpdateReq().apply {
            id = 1001
            roomName = "new name"
            permissions = listOf(PermissionVo().apply {  memberRole = GroupMemberRole.OWNER.name; changeGroupInfo = true})
        }

        // When
        appChatroomService.updateChatroom(req, user)

        // Then
        val updated = chatroomService.getById(1001)
        assertEquals("new name", updated!!.roomName)
        assertEquals(1, updated!!.dataVersion)
    }

    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `updateChatroom moderator with permission can update`() {
        // Given 配置权限允许MODERATOR修改
        val user = LoginUserInfo().apply { userId = 2L }
        val req = AppChatroomUpdateReq().apply {
            id = 1001
            roomName = "moderator update"
        }

        // When & Then
        assertDoesNotThrow {
            appChatroomService.updateChatroom(req, user)
        }
    }

    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `updateChatroom member without permission should throw`() {
        // Given
        val user = LoginUserInfo().apply { userId = 3L }
        val req = AppChatroomUpdateReq().apply {
            id = 1001
            roomName = "unauthorized update"
        }

        // When & Then
        assertThrows<RuntimeException> {
            appChatroomService.updateChatroom(req, user)
        }
    }

    @Test
    @Transactional
    @Rollback
    fun `updateChatroom update non-existent chatroom should throw`() {
        // Given
        val user = LoginUserInfo().apply { userId = 1L }
        val req = AppChatroomUpdateReq().apply { id = 9999 }

        // When & Then
        assertThrows<RuntimeException> {
            appChatroomService.updateChatroom(req, user)
        }
    }


    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `updatePermission by admin with valid input should succeed`() {
        // Given
        val user = LoginUserInfo().apply { userId = 1L } // 管理员用户
        val req = AppChatroomUpdateReq().apply {

            id = 1001
            permissions = listOf(
                PermissionVo().apply {

                    memberRole = GroupMemberRole.MEMBER.name
                    changeGroupInfo = true
                    linkChatToPosts = true
                }
            )
        }

        // When
        appChatroomService.updatePermission(req, user)

        // Then
        val updated = chatroomService.getById(1001)
        val permissions = updated!!.permissions!!

        assertTrue(permissions.any {
            it.memberRole == GroupMemberRole.MEMBER.name &&
                    it.changeGroupInfo!! &&
                    it.linkChatToPosts!!
        })
    }

    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `updatePermission with invalid role should throw`() {
        // Given
        val user = LoginUserInfo().apply { userId = 3 }
        val req = AppChatroomUpdateReq().apply() {
            id = 1001L
            permissions = listOf(
                PermissionVo().apply {

                    memberRole = GroupMemberRole.MEMBER.name// 普通成员无权修改权限
                    changeGroupInfo = true
                }
            )
        }
        // When & Then
        assertThrows<RuntimeException> {
            try {
                appChatroomService.updatePermission(req, user)
            } catch (e: Exception) {
                assertEquals("You do not have permission to modify these settings", e.message)
                StaticLog.error("do throw error", e)
                throw e
            }
        }
    }


    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `updateGroupType`() {
        // Given
        val user = LoginUserInfo().apply { userId = 1 }
        val req = AppChatroomUpdateReq().apply() {
            id = 1001L
            groupType = ChatroomGroupTypeEnum.PRIVATE
        }
        // When & Then
        appChatroomService.updateGroupType(req, user)
        val updated = chatroomService.getById(1001)
        assertEquals(ChatroomGroupTypeEnum.PRIVATE, updated!!.groupType)
    }


    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `updatehistoryVisible`() {
        // Given
        val user = LoginUserInfo().apply { userId = 1 }
        val req = AppChatroomUpdateReq().apply() {
            id = 1001L
            historyMsgVisibility = false
        }
        // When & Then
        appChatroomService.updatehistoryVisible(req, user)
        val updated = chatroomService.getById(1001)
        assertEquals(false, updated!!.historyMsgVisibility)
        val req1 = AppChatroomUpdateReq().apply() {
            id = 1001L
            historyMsgVisibility = true
        }
        // When & Then
        appChatroomService.updatehistoryVisible(req1, user)
        val updated1 = chatroomService.getById(1001)
        assertEquals(true, updated1!!.historyMsgVisibility)
    }


    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `updateTheme by owner should succeed`() {
        // Given
        val user = LoginUserInfo().apply { userId = 1L }
        val req = AppChatroomThemeReq().apply {
            roomId = 1001L
            color = "#FF5733"
            type = "custom"
            gallery = "https://example.com/gallery.jpg"
        }

        // When
        appChatroomService.updateTheme(req, user)

        // Then
        val member = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java)
                .eq(ChatroomMember::roomId, 1001L)
                .eq(ChatroomMember::memberId, 1L)
        )
        val parseObj = JSONUtil.parseObj(member!!.theme)
        assertEquals(req.color, parseObj.getStr("color"))
        assertEquals(req.type, parseObj.getStr("type"))
        assertEquals(req.gallery, parseObj.getStr("gallery"))
    }

    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `updateTheme by moderator with permission should succeed`() {
        // Given
        val user = LoginUserInfo().apply { userId = 2L }
        val req = AppChatroomThemeReq().apply {
            roomId = 1001L
            color = "#FF5733"
            type = "custom"
            gallery = "https://example.com/gallery.jpg"
        }

        // When & Then
        assertDoesNotThrow {
            appChatroomService.updateTheme(req, user)
        }
    }

    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `updateTheme by member without permission should throw`() {
        // Given
        val user = LoginUserInfo().apply { userId = 3L }
        val req = AppChatroomThemeReq().apply {
            roomId = 1001L
            color = "#FF5733"
            type = "custom"
            gallery = "https://example.com/gallery.jpg"
        }


        // When & Then
        val exception = assertThrows<RuntimeException> {
            appChatroomService.updateTheme(req, user)
        }
        assertEquals("You do not have permission to modify these settings", exception.message)
    }

    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `deleteChatroom owner success`() {
        // Given
        val user = LoginUserInfo().apply { userId = 1L }


        // When & Then
        appChatroomService.deleteChatroom(1001, user)

        kotlin.test.assertNull(chatroomService.getById(1001))
        assertEquals(0, chatroomMemberService.queryRoomMembers(1001).size)
    }

    // member 无权限删除
    @Test
    @Transactional
    @Rollback
    @Sql("/sql/chatroom_init.sql")
    fun `deleteChatroom  member fail`() {
        // Given
        val user = LoginUserInfo().apply { userId = 3L }

        // When & Then
        val exp = assertThrows<RuntimeException> {
            appChatroomService.deleteChatroom(1001, user)
        }
        assertEquals("You do not have permission to delete the group.", exp.message)
    }

    @Test
    @Transactional
    @Rollback
    fun `createChatroom should fill default permission fields`() {
        val user = LoginUserInfo().apply {
            userId = 1L; nickname = "TestUser"; username = "TestUsername"; avatar = "http:xx.com/a.jpg"
        }
        val req = AppChatroomCreatReq().apply {
            roomName = "Test Room"
            groupType = ChatroomGroupTypeEnum.PUBLIC
            roomAvatar = "avatar.jpg"
            description = "Test description"
            permissions = listOf(PermissionVo().apply {  memberRole =GroupMemberRole.ADMIN.name; changeGroupInfo = true})
            members = listOf(ChatroomMemberVo().apply { memberId = 2 })
        }

        // When
        val roomId = appChatroomService.createChatroom(req, user)

        val created = chatroomService.getById(roomId)
        val moderatoPerm = created!!.permissions!!.find { it.memberRole == "MODERATOR" }

        assertFalse(moderatoPerm!!.approveNewMembers)
        assertFalse(moderatoPerm!!.addOtherMembers)
    }

}
