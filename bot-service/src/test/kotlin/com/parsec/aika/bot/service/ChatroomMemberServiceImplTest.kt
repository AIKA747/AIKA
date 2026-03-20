package com.parsec.aika.bot.service

import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.parsec.aika.bot.remote.UserFeignClient
import com.parsec.aika.bot.service.impl.ChatroomMemberServiceImpl
import com.parsec.aika.common.model.dto.AppUserVO
import com.parsec.aika.common.model.dto.ChatroomMemberVo
import com.parsec.aika.common.model.dto.PermissionVo
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.Chatroom
import com.parsec.aika.common.model.entity.ChatroomMember
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.exception.core.BusinessException
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@SpringBootTest
@Transactional // 所有测试方法将在事务中运行，并在测试完成后回滚
@Rollback
class ChatroomMemberServiceImplTest {

    @Autowired
    private lateinit var chatroomMemberService: ChatroomMemberServiceImpl

    @Autowired
    private lateinit var chatroomService: ChatroomService

    // 这些依赖我们仍需要模拟，因为它们可能是外部服务
    @MockBean
    private lateinit var userFeignClient: UserFeignClient

    @MockBean
    private lateinit var notificationService: NotificationService

    private val currentUser = LoginUserInfo().apply {
        userId = 1L
        username = "testuser"
        nickname = "Test User"
    }
    private val testRoomId = 100

    @BeforeEach
    fun setUp() {
        // 清理数据库并准备测试数据
        cleanDatabase()
        prepareTestData()
    }

    @AfterEach
    fun tearDown() {
        cleanDatabase()
    }

    // 清理数据库中的测试数据
    private fun cleanDatabase() {
        // 删除测试相关的聊天室成员记录
        chatroomMemberService.remove(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
        )
        // 删除测试聊天室
        chatroomService.removeById(testRoomId)
    }

    // 准备测试数据
    private fun prepareTestData() {
        // 创建测试聊天室
        val chatroom = Chatroom().apply {
            id = testRoomId
            roomName = "Test Chatroom"
            description = "Test Chatroom"
            // 设置其他必要属性
            roomCode = "testchatroom"
            roomType = CollectionType.GROUP_CHAT
            groupType = ChatroomGroupTypeEnum.PRIVATE
            memberLimit = 500
            roomAvatar = "avatar.jpg"
            historyMsgVisibility = true
            permissions = createPermissionVos()
            creator = currentUser.userId
            updater = currentUser.userId
            dataVersion = 0
            joinDirectly = true

        }
        chatroomService.save(chatroom)

        // 创建聊天室成员 - 当前用户是群主
        val ownerMember = createChatroomMember(currentUser.userId!!, GroupMemberRole.OWNER, GroupMemberStatus.APPROVE)
        chatroomMemberService.save(ownerMember)

        // 创建普通成员
        val regularMember = createChatroomMember(2L, GroupMemberRole.MEMBER, GroupMemberStatus.APPROVE)

        chatroomMemberService.save(regularMember)

        // 创建管理员成员
        val moderatorMember = createChatroomMember(3L, GroupMemberRole.MODERATOR, GroupMemberStatus.APPROVE)

        chatroomMemberService.save(moderatorMember)
    }

    // 1. 设置成员角色测试用例
    @Test
    fun testSetMemberRoleAsOwner() {
        // 准备测试数据 - 当前用户已是群主，在setUp方法中设置
        val memberIds = listOf("2")
        val role = "MODERATOR"

        // 执行测试
        chatroomMemberService.setMemberRole(testRoomId, role, memberIds, currentUser)

        // 验证结果
        val updatedMember = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, 2L)
        )
        assertNotNull(updatedMember)
        assertEquals(GroupMemberRole.MODERATOR, updatedMember?.memberRole)
    }

    @Test
    @Sql("/sql/init_chatroom.sql")
    fun testSetMemberRoleAsNonOwner() {
        // 将当前用户设为普通成员
        chatroomMemberService.update(
            KtUpdateWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, currentUser.userId)
                .set(ChatroomMember::memberRole, GroupMemberRole.MEMBER)
        )

        val memberIds = listOf("2")
        val role = "MODERATOR"

        // 执行测试并验证异常
        val exception = assertThrows(BusinessException::class.java) {
            chatroomMemberService.setMemberRole(testRoomId, role, memberIds, currentUser)
        }

        assertEquals("You do not have permission to modify member roles.", exception.message)


        LoginUserInfo().apply {
            userId = 2L
            username = "testuser"
        }.apply {
            assertThrows(BusinessException::class.java) {
                chatroomMemberService.setMemberRole(1, role, memberIds, this)
            }.let {
                assertEquals("You do not have permission to modify member roles.", it.message)
            }
        }

    }

    // 2. 删除群成员测试用例
    @Test
    fun testDeleteMembersAsOwner() {
        // 准备测试数据 - 当前用户已是群主，在setUp方法中设置
        val memberIds = listOf("2") // 普通成员ID

        // 执行测试
        chatroomMemberService.deleteMembers(testRoomId, memberIds, currentUser)

        // 验证结果
        val deletedMember = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, 2L)
        )
        assertNull(deletedMember) // 成员应该已被删除
    }

    @Test
    fun testDeleteOwnerAsOwner() {
        // 添加另一个群主
        val anotherOwner = createChatroomMember(4L, GroupMemberRole.OWNER, GroupMemberStatus.APPROVE)
        chatroomMemberService.save(anotherOwner)

        // 尝试删除另一个群主
        val memberIds = listOf("4")

        // 执行测试并验证异常
        val exception = assertThrows(BusinessException::class.java) {
            chatroomMemberService.deleteMembers(testRoomId, memberIds, currentUser)
        }

        assertEquals("You do not have permission to delete an owner.", exception.message)
    }

    @Test
    fun testDeleteSelfAsOnlyOwner() {
        // 当前用户是唯一群主
        val memberIds = listOf(currentUser.userId.toString())

        // 执行测试并验证异常
        val exception = assertThrows(BusinessException::class.java) {
            chatroomMemberService.deleteMembers(testRoomId, memberIds, currentUser)
        }

        assertEquals("You cannot leave the group as you are the only owner.", exception.message)
    }

    @Test
    fun testDeleteMembersAsModerator() {
        // 将当前用户角色设为管理员
        chatroomMemberService.update(
            KtUpdateWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, currentUser.userId)
                .set(ChatroomMember::memberRole, GroupMemberRole.MODERATOR)
        )

        // 尝试删除普通成员
        val memberIds = listOf("2")

        // 执行测试
        chatroomMemberService.deleteMembers(testRoomId, memberIds, currentUser)

        // 验证普通成员已被删除
        val deletedMember = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, 2L)
        )
        assertNull(deletedMember)
    }

    @Test
    fun testModeratorDeleteModerator() {
        // 将当前用户角色设为管理员
        chatroomMemberService.update(
            KtUpdateWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, currentUser.userId)
                .set(ChatroomMember::memberRole, GroupMemberRole.MODERATOR)
        )

        // 尝试删除其他管理员
        val memberIds = listOf("3") // ID 3是管理员

        // 执行测试并验证异常
        val exception = assertThrows(BusinessException::class.java) {
            chatroomMemberService.deleteMembers(testRoomId, memberIds, currentUser)
        }

        assertEquals("You do not have permission to delete a moderator.", exception.message)
    }

    // 3. 添加群成员测试用例
    @Test
    fun testAddMembersAsOwner() {
        // 准备用户信息数据
        val newUserId = 5L
        val userInfo = AppUserVO().apply {
            id = newUserId
            username = "newuser"
            allowJoinToChat = true
        }

        // 模拟用户服务返回
        `when`(userFeignClient.userInfo(newUserId)).thenReturn(userInfo)

        val members = listOf(ChatroomMemberVo().apply {
            this.memberId = newUserId
            this.memberType = AuthorType.USER
            this.username = "user"
            this.nickname = "newuser"
            this.avatar = "avatar.jpg"
        })

        // 执行测试
        chatroomMemberService.addMembers(testRoomId, members, currentUser)

        // 验证结果
        val addedMember = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, newUserId)
        )
        assertNotNull(addedMember)
        assertEquals(GroupMemberRole.MEMBER, addedMember?.memberRole)
        assertEquals(GroupMemberStatus.APPROVE, addedMember?.status) // 允许直接加入

        // 验证通知被发送
        verify(notificationService).chatroomMemberNotify(eq(listOf(newUserId)), anyString(), testRoomId, "")
    }

    @Test
    fun testAddMembersExceedingLimit() {

        // 查询当前聊天室成员数量
        val memberCount = chatroomMemberService.count(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::status, GroupMemberStatus.APPROVE)
        )
        // Set the member limit for the chatroom
        val memberLimit = 5
        chatroomService.update(
            KtUpdateWrapper(Chatroom::class.java).eq(Chatroom::id, testRoomId).set(Chatroom::memberLimit, memberLimit)
        )

        val members = arrayListOf<ChatroomMemberVo>()
        // Add members up to the limit
        for (i in 1..5) {
            members.add(ChatroomMemberVo().apply {
                this.memberId = i.toLong()
                this.memberType = AuthorType.USER
                this.username = "user$i"
                this.nickname = "user$i"
                this.avatar = "avatar.jpg"
            })
        }

        // Execute test and expect exception
        val exception = assertThrows(BusinessException::class.java) {
            chatroomMemberService.addMembers(testRoomId, members, currentUser)
        }

        assertEquals(
            "You have invited too many users. Currently, you can also invite ${memberLimit - memberCount} users to join the group chat",
            exception.message
        )
    }

    @Test
    fun testAddMembersWithoutPermission() {
        // 将当前用户角色设为普通成员
        chatroomMemberService.update(
            KtUpdateWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, currentUser.userId)
                .set(ChatroomMember::memberRole, GroupMemberRole.MEMBER)
        )

        val members = listOf(ChatroomMemberVo().apply {
            this.memberId = 5
            this.memberType = AuthorType.USER
            this.username = "user"
            this.nickname = "newuser"
            this.avatar = "avatar.jpg"
        })

        // 执行测试并验证异常
        val exception = assertThrows(BusinessException::class.java) {
            chatroomMemberService.addMembers(testRoomId, members, currentUser)
        }

        assertEquals("You do not have permission to add members.", exception.message)
    }

    @Test
    fun testAddExistingMember() {
        // 用户ID 2已经是群成员
        val members = listOf(ChatroomMemberVo().apply {
            this.memberId = 2
            this.memberType = AuthorType.USER
            this.username = "user"
            this.nickname = "newuser"
            this.avatar = "avatar.jpg"
        })


        // 执行测试 - 不应抛出异常
        chatroomMemberService.addMembers(testRoomId, members, currentUser)

        // 验证没有重复添加
        verify(userFeignClient, never()).userInfo(2L)

    }

    @Test
    fun addMemberPropertyCheck() {
        // 准备用户信息数据
        val newUserId = 5L
        val userInfo = AppUserVO().apply {
            id = newUserId
            username = "newuser"
            allowJoinToChat = false
        }

        // 模拟用户服务返回
        `when`(userFeignClient.userInfo(newUserId)).thenReturn(userInfo)


        val members = listOf(ChatroomMemberVo().apply {
            this.memberId = 21
            this.memberType = AuthorType.USER
            this.username = "user"
            this.nickname = "newuser"
            this.avatar = "avatar.jpg"
        })

        // 执行测试 - 不应抛出异常
        chatroomMemberService.addMembers(testRoomId, members, currentUser)


        //获得这个成员，检查其状态与最后阅读时间都满足要求
        chatroomMemberService.queryRoomMembers(testRoomId).forEach {
            if (it!!.memberId == 21L) {
                assertEquals(GroupMemberStatus.FRIEND_INVITE, it!!.status)
                assertNull(it!!.lastReadTime)
            }
        }
    }

    // 4. 同意加入群聊测试用例
    @Test
    fun testApproveOwnInvitation() {
        // 创建邀请记录
        val invitation = createChatroomMember(5L, GroupMemberRole.MEMBER, GroupMemberStatus.FRIEND_INVITE)
        chatroomMemberService.save(invitation)

        // 获取邀请记录ID
        val invitationId = invitation.id!!

        // 执行测试并验证异常
        val exception = assertThrows(BusinessException::class.java) {
            chatroomMemberService.approveJoinRequest(invitationId, currentUser)
        }

        assertEquals("Invalid request status.", exception.message)
    }

    @Test
    fun testApproveJoinRequestAsOwner() {
        // 创建加入申请
        val joinRequest = createChatroomMember(5L, GroupMemberRole.MEMBER, GroupMemberStatus.USER_JOIN_REQUEST)
        chatroomMemberService.save(joinRequest)

        // 获取申请ID
        val requestId = joinRequest.id!!

        // 执行测试
        chatroomMemberService.approveJoinRequest(requestId, currentUser)

        // 验证结果
        val updatedRequest = chatroomMemberService.getById(requestId)
        assertNotNull(updatedRequest)
        assertEquals(GroupMemberStatus.APPROVE, updatedRequest?.status)
    }

    @Test
    fun testApproveJoinRequestWithoutPermission() {
        // 将当前用户角色设为普通成员
        chatroomMemberService.update(
            KtUpdateWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, currentUser.userId)
                .set(ChatroomMember::memberRole, GroupMemberRole.MEMBER)
        )

        // 创建加入申请
        val joinRequest = createChatroomMember(5L, GroupMemberRole.MEMBER, GroupMemberStatus.USER_JOIN_REQUEST)
        chatroomMemberService.save(joinRequest)

        // 获取申请ID
        val requestId = joinRequest.id!!

        // 执行测试并验证异常
        val exception = assertThrows(BusinessException::class.java) {
            chatroomMemberService.approveJoinRequest(requestId, currentUser)
        }

        assertEquals("You have no permission to approve this application.", exception.message)
    }

    @Test
    fun testApproveInvalidStatus() {
        // 创建已批准的成员记录
        val approvedMember = createChatroomMember(5L, GroupMemberRole.MEMBER, GroupMemberStatus.APPROVE)
        chatroomMemberService.save(approvedMember)

        // 获取记录ID
        val memberId = approvedMember.id!!

        // 执行测试并验证异常
        val exception = assertThrows(BusinessException::class.java) {
            chatroomMemberService.approveJoinRequest(memberId, currentUser)
        }

        assertEquals("Invalid request status.", exception.message)
    }

    fun createChatroomMember(memberId: Long, memberRole: GroupMemberRole, status: GroupMemberStatus): ChatroomMember {
        return ChatroomMember().apply {
            this.roomId = testRoomId
            this.memberId = memberId
            this.memberRole = memberRole
            this.memberType = AuthorType.USER
            this.nickname = "Test User"
            this.username = "testuser"
            this.avatar = "avatar.jpg"
            this.status = status
            this.creator = currentUser.userId
            this.updater = currentUser.userId
            this.createdAt = LocalDateTime.now()
            this.updatedAt = LocalDateTime.now()
            this.dataVersion = 1
            this.deleted = false
            this.notifyTurnOffTime = LocalDateTime.now()
            this.lastReadTime = LocalDateTime.now()
            this.theme =
                JSONUtil.parseObj("{\"type\":\"主题类型：gallery、color\",\"color\":\"颜色\",\"gallery\":\"图片链接\"}")
        }
    }

    fun createPermissionVos(): List<PermissionVo> {
        return listOf(
            PermissionVo().apply {
                this.memberRole = GroupMemberRole.OWNER.name
                this.addOtherMembers = true
                this.changeGroupInfo = true
                this.linkChatToPosts = true
                this.approveNewMembers = true
            },
            PermissionVo().apply {
                this.memberRole = GroupMemberRole.ADMIN.name
                this.addOtherMembers = true
                this.changeGroupInfo = false
                this.linkChatToPosts = true
                this.approveNewMembers = true
            },
            PermissionVo().apply {
                this.memberRole = GroupMemberRole.MODERATOR.name
                this.addOtherMembers = true
                this.changeGroupInfo = false
                this.linkChatToPosts = true
                this.approveNewMembers = false
            },
            PermissionVo().apply {
                this.memberRole = GroupMemberRole.MEMBER.name
                this.addOtherMembers = false
                this.changeGroupInfo = false
                this.linkChatToPosts = true
                this.approveNewMembers = false
            },
        )
    }

    //测试添加群成员超过限制
    @Test
    @Sql("/sql/init_chatroom.sql")
    fun testMemberOverLimit() {

        //随便生成6个chatroomMember构成的list
        val list = (1..6).map {
            ChatroomMemberVo().apply {
                memberId = it.toLong()
                memberType = AuthorType.USER
                nickname = "testuser$it"
                username = "testuser$it"
                avatar = "avatar.jpg"
            }
        }

        LoginUserInfo().apply {
            userId = 4L  //4是owner
            username = "testuser"
        }.let {
            assertThrows(BusinessException::class.java) {
                chatroomMemberService.addMembers(1, list, it)
            }.let {
                assertEquals(
                    "You have invited too many users. Currently, you can also invite 2 users to join the group chat",
                    it.message
                )
            }
        }
    }

    //测试添加群成员没有权限
    @Test
    @Sql("/sql/init_chatroom.sql")
    fun testMemberNoPermission() {
        LoginUserInfo().apply {
            userId = 3L
            username = "testuser"
        }.let {
            assertThrows(BusinessException::class.java) {
                chatroomMemberService.addMembers(1, emptyList(), it)
            }.let {
                assertEquals("You do not have permission to add members.", it.message)
            }
        }
    }

    //测试没有通过同意的成员，没有权限加人
    @Test
    @Sql("/sql/init_chatroom.sql")
    fun testMemberHasNotJoinYet() {
        LoginUserInfo().apply {
            userId = 5L  // 5是没有通过同意的成员
            username = "testuser"
        }.let {
            assertThrows(BusinessException::class.java) {
                chatroomMemberService.addMembers(1, emptyList(), it)
            }.let {
                assertEquals("You are not a member of this chatroom.", it.message)
            }
        }
    }


    @Test
    fun testAddOwnerSuccess() {


        val newOwner = LoginUserInfo().apply {
            userId = 4L
            nickname = "newOwner"
            avatar = "new_avatar.jpg"
            username = "azhong"
        }

        // 首次添加
        chatroomMemberService.addOwner(testRoomId, newOwner.userId!!, newOwner)

        // 验证记录存在
        val ownerRecord = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, 4L).eq(ChatroomMember::memberRole, GroupMemberRole.OWNER)
        )
        assertNotNull(ownerRecord)

        // 第二次添加相同Owner

        assertThrows(BusinessException::class.java) {
            chatroomMemberService.addOwner(testRoomId, newOwner.userId!!, newOwner)
        }.let {
            assertEquals("Owner newOwner already exists in chatroom", it.message)
        }

        // 验证只有一条记录
        val count = chatroomMemberService.count(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, testRoomId)
                .eq(ChatroomMember::memberId, 4L).eq(ChatroomMember::memberRole, GroupMemberRole.OWNER)
        )
        assertEquals(1, count)

    }


}
