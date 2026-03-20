package com.parsec.aika.bot.controller.app

import cn.hutool.json.JSONObject
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.service.AppChatroomService
import com.parsec.aika.bot.service.ChatroomMemberService
import com.parsec.aika.bot.service.ChatroomService
import com.parsec.aika.common.model.dto.PermissionVo
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.Chatroom
import com.parsec.aika.common.model.entity.ChatroomMember
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.exception.core.BusinessException
import java.time.LocalDateTime
import javax.annotation.Resource
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional

@Rollback
@Transactional
@SpringBootTest
class AppChatroomControllerTest {

    @Resource
    private lateinit var appChatroomController: AppChatroomController

    @Resource
    private lateinit var appChatroomService: AppChatroomService

    @Resource
    private lateinit var chatroomMemberService: ChatroomMemberService

    @Resource
    private lateinit var chatroomService: ChatroomService

    private lateinit var loginUserInfo: LoginUserInfo

    @BeforeEach
    fun setUp() {
        loginUserInfo = LoginUserInfo()
        loginUserInfo.userId = 1L
        loginUserInfo.username = "testUser"
    }

    @Test
    fun testFeatureMessage() {
        // 准备测试数据
        val req = AppFeatureMessageReq()
        req.mid = 1L
        req.uid = 2L
        req.st = "user"
        req.avatar = "avatar"
        req.nn = "测试用户"
        req.txt = "测试消息"
        req.roomId = "123"
        req.ct = ContentType.TEXT

        // 执行测试
        val result = appChatroomController.featureMessage(req, loginUserInfo)

        // 验证结果
        assertEquals(0, result.code)
        assertEquals("操作成功", result.data)
    }

    /** 这个用例不要看，你会后悔的 */
    @Test
    fun testFeatureMessageDeduplication() {
        // 创建测试用户
        val firstUser =
            LoginUserInfo().apply {
                userId = 1L
                username = "testUser1"
            }
        val secondUser =
            LoginUserInfo().apply {
                userId = 2L
                username = "testUser2"
            }

        // 定义测试案例
        val testCases =
            listOf(
                // 案例1：基本消息 - 应该插入成功
                Triple(
                    "基本消息插入",
                    AppFeatureMessageReq().apply {
                        uid = 1L
                        st = "user"
                        avatar = "avatar1"
                        nn = "用户1"
                        txt = "测试消息1"
                        roomId = "123"
                    },
                    true // 预期结果：插入成功
                ),

                // 案例2：与案例1完全相同的消息（相同creator + uid + st + txt） - 应该被查重
                Triple(
                    "相同消息查重",
                    AppFeatureMessageReq().apply {
                        uid = 1L
                        st = "user"
                        avatar = "avatar1"
                        nn = "用户1"
                        txt = "测试消息1"
                        roomId = "123"
                    },
                    false // 预期结果：查重导致插入失败
                ),

                // 案例3：txt为空的消息 - 应该插入成功
                Triple(
                    "txt为空的消息",
                    AppFeatureMessageReq().apply {
                        uid = 2L
                        st = "user"
                        avatar = "avatar2"
                        nn = "用户2"
                        txt = null
                        med = "media_url1"
                        fn = "file1.jpg"
                        roomId = "123"
                    },
                    true // 预期结果：插入成功
                ),

                // 案例4：与案例3相同但txt为空 - 应该被查重
                Triple(
                    "txt为空的相同消息",
                    AppFeatureMessageReq().apply {
                        uid = 2L
                        st = "user"
                        avatar = "avatar2"
                        nn = "用户2"
                        txt = null
                        med = "media_url1"
                        fn = "file1.jpg"
                        roomId = "123"
                    },
                    false // 预期结果：查重导致插入失败
                ),

                // 案例5：med为空的消息 - 应该插入成功
                Triple(
                    "med为空的消息",
                    AppFeatureMessageReq().apply {
                        uid = 3L
                        st = "user"
                        avatar = "avatar3"
                        nn = "用户3"
                        txt = "测试消息3"
                        med = null
                        roomId = "123"
                    },
                    true // 预期结果：插入成功
                ),

                // 案例6：与案例5相同但med为空 - 应该被查重
                Triple(
                    "med为空的相同消息",
                    AppFeatureMessageReq().apply {
                        uid = 3L
                        st = "user"
                        avatar = "avatar3"
                        nn = "用户3"
                        txt = "测试消息3"
                        med = null
                        roomId = "123"
                    },
                    false // 预期结果：查重导致插入失败
                ),

                // 案例7：fn为空的消息 - 应该插入成功
                Triple(
                    "fn为空的消息",
                    AppFeatureMessageReq().apply {
                        uid = 4L
                        st = "user"
                        avatar = "avatar4"
                        nn = "用户4"
                        txt = "测试消息4"
                        med = "media_url4"
                        fn = null
                        roomId = "123"
                    },
                    true // 预期结果：插入成功
                ),

                // 案例8：与案例7相同但fn为空 - 应该被查重
                Triple(
                    "fn为空的相同消息",
                    AppFeatureMessageReq().apply {
                        uid = 4L
                        st = "user"
                        avatar = "avatar4"
                        nn = "用户4"
                        txt = "测试消息4"
                        med = "media_url4"
                        fn = null
                        roomId = "123"
                    },
                    false // 预期结果：查重导致插入失败
                ),

                // 案例9：所有可选字段都为空的消息 - 应该插入成功
                Triple(
                    "所有可选字段为空的消息",
                    AppFeatureMessageReq().apply {
                        uid = 5L
                        st = "user"
                        avatar = "avatar5"
                        nn = "用户5"
                        txt = null
                        med = null
                        fn = null
                        roomId = "123"
                    },
                    true // 预期结果：插入成功
                ),

                // 案例10：与案例9相同但所有可选字段都为空 - 应该被查重
                Triple(
                    "所有可选字段为空的相同消息",
                    AppFeatureMessageReq().apply {
                        uid = 5L
                        st = "user"
                        avatar = "avatar5"
                        nn = "用户5"
                        txt = null
                        med = null
                        fn = null
                        roomId = "123"
                    },
                    false // 预期结果：查重导致插入失败
                ),

                // 案例11：相同内容但不同creator - 应该插入成功
                Triple(
                    "相同内容但不同creator",
                    AppFeatureMessageReq().apply {
                        uid = 1L
                        st = "user"
                        avatar = "avatar1"
                        nn = "用户1"
                        txt = "测试消息1"
                        roomId = "123"
                    },
                    true // 预期结果：插入成功（使用第二个用户）
                ),

                // 案例12：相同creator但不同uid - 应该插入成功
                Triple(
                    "相同creator但不同uid",
                    AppFeatureMessageReq().apply {
                        uid = 6L // 不同的uid
                        st = "user"
                        avatar = "avatar6"
                        nn = "用户6"
                        txt = "测试消息1" // 相同的txt
                        roomId = "123"
                    },
                    true // 预期结果：插入成功
                ),

                // 案例13：相同creator和uid但不同st - 应该插入成功
                Triple(
                    "相同creator和uid但不同st",
                    AppFeatureMessageReq().apply {
                        uid = 1L // 相同的uid
                        st = "system" // 不同的st
                        avatar = "avatar1"
                        nn = "用户1"
                        txt = "测试消息1" // 相同的txt
                        roomId = "123"
                    },
                    true // 预期结果：插入成功
                )
            )

        // 遍历测试案例
        for ((description, req, expectedResult) in testCases) {
            // 确定使用哪个用户
            val user = if (description == "相同内容但不同creator") secondUser else firstUser

            // 执行测试
            val result = appChatroomService.featureMessage(req, user)

            // 验证结果
            assertEquals(expectedResult, result, "测试失败：$description")
        }
    }

    @Test
    fun testTurnOffNotificationWhenMemberExists() {
        // 准备测试数据
        val req = AppChatroomNotificationOffReq()
        req.roomId = 123
        req.notifyTurnOff = NotifyTurnOffType.ONE_HOUR.name

        val member =
            ChatroomMember().apply {
                id = 1
                roomId = 123
                memberId = 1L
                memberType = AuthorType.USER
                nickname = "测试用户"
                username = "testUser"
                avatar = "avatar"
                memberRole = GroupMemberRole.MEMBER
                notifyTurnOffTime = LocalDateTime.now()
                status = GroupMemberStatus.APPROVE
                theme = JSONObject()
                lastReadTime = LocalDateTime.now()
                creator = 1
                updater = 1
            }
        chatroomMemberService.save(member)
        // 执行测试
        val result = appChatroomController.turnOffNotification(req, loginUserInfo)

        // 验证结果
        assertEquals(0, result.code)
    }

    @Test
    fun testGetChatroomDetailWhenChatroomExists() {
        // 准备测试数据
        val chatroom =
            Chatroom().apply {
                roomName = "测试群聊"
                roomType = CollectionType.GROUP_CHAT
                groupType = ChatroomGroupTypeEnum.PUBLIC
                roomAvatar = "avatar"
                memberLimit = 500
                description = "测试群聊"
                roomCode = "test_group_chat"
                historyMsgVisibility = false
                permissions = listOf()
                creator = 1
                updater = 1
            }
        chatroomService.save(chatroom)
        // 执行测试
        val result = appChatroomController.getChatroomDetail(chatroom.id!!, LoginUserInfo().apply {
            userId = 1
        })

        // 验证结果
        assertEquals(0, result.code)
        assertEquals("测试群聊", result.data.roomName)
    }

    @Test
    fun testGetChatroomMembers() {
        // 准备测试数据
        val pageNo = 1
        val pageSize = 10
        val roomId = 123

        val member =
            ChatroomMember().apply {
                id = 1
                this.roomId = roomId
                memberId = 1L
                memberType = AuthorType.USER
                nickname = "测试用户"
                username = "testUser"
                avatar = "avatar"
                memberRole = GroupMemberRole.MEMBER
                notifyTurnOffTime = LocalDateTime.now()
                status = GroupMemberStatus.APPROVE
                theme = JSONObject()
                lastReadTime = LocalDateTime.now()
                creator = 1
                updater = 1
            }
        chatroomMemberService.save(member)

        val req =
            ChatroomMembersPageReq().apply {
                this.pageNo = pageNo
                this.pageSize = pageSize
                this.roomId = roomId
            }

        // 执行测试
        val result = appChatroomController.getChatroomMembers(req)

        // 验证结果
        assertEquals(0, result.code)
        assertEquals(1, result.data.total)
        assertEquals(1, result.data.list.size)
        assertEquals("测试用户", result.data.list[0].nickname)
    }

    @Test
    fun testGetChatroomList() {
        // 准备测试数据
        val pageNo = 1
        val pageSize = 10
        val roomId = 123
        val member =
            ChatroomMember().apply {
                id = 1
                this.roomId = roomId
                memberId = 1L
                memberType = AuthorType.USER
                nickname = "测试用户"
                username = "testUser"
                avatar = "avatar"
                memberRole = GroupMemberRole.MEMBER
                notifyTurnOffTime = LocalDateTime.now()
                status = GroupMemberStatus.APPROVE
                theme = JSONObject()
                lastReadTime = LocalDateTime.now()
                creator = 1
                updater = 1
            }
        chatroomMemberService.save(member)

        val chatroom =
            Chatroom().apply {
                id = roomId
                roomName = "测试群聊"
                roomType = CollectionType.GROUP_CHAT
                groupType = ChatroomGroupTypeEnum.PUBLIC
                roomAvatar = "avatar"
                memberLimit = 500
                description = "测试群聊"
                roomCode = "test_group_chat"
                historyMsgVisibility = false
                permissions = listOf()
                creator = 1
                updater = 1
            }
        chatroomService.save(chatroom)

        val req =
            ChatroomListPageReq().apply {
                this.pageNo = pageNo
                this.pageSize = pageSize
            }

        // 执行测试
        val result = appChatroomController.getChatroomList(req, loginUserInfo)

        // 验证结果
        assertEquals(0, result.code)
        assertEquals(1, result.data.total)
        assertEquals(1, result.data.list.size)
        assertEquals("测试群聊", result.data.list[0].roomName)

        val req2 =
            ChatroomListPageReq().apply {
                this.pageNo = pageNo
                this.pageSize = pageSize
                this.roomName = "无"
            }

        // 执行测试
        val result2 = appChatroomController.getChatroomList(req2, loginUserInfo)

        // 验证结果
        assertEquals(0, result2.code)
        assertEquals(0, result2.data.total)
    }

    @Test
    fun testGetFeatureMessages() {
        // 准备测试数据
        val pageNo = 1
        val pageSize = 10

        this.testFeatureMessage()

        val req =
            FeatureMessagesPageReq().apply {
                this.pageNo = pageNo
                this.pageSize = pageSize
                this.roomId = "123"
            }
        // 执行测试
        val result = appChatroomController.getFeatureMessages(req, loginUserInfo)

        // 验证结果
        assertEquals(0, result.code)
        assertEquals(1, result.data.total)
        assertEquals("测试消息", result.data.list[0].txt)

        val req2 =
            FeatureMessagesPageReq().apply {
                this.pageNo = pageNo
                this.pageSize = pageSize
                this.roomId = "1"
            }
        // 执行测试
        val result2 = appChatroomController.getFeatureMessages(req2, loginUserInfo)

        // 验证结果
        assertEquals(0, result2.code)
        assertEquals(0, result2.data.total)
    }

    @Test
    fun testNotificationTimeCalculation() {
        val testCases = listOf(
            Triple(NotifyTurnOffType.ONE_HOUR, 1, "小时"),
            Triple(NotifyTurnOffType.EIGHT_HOUR, 8, "小时"),
            Triple(NotifyTurnOffType.ONE_DAY, 1, "天"),
            Triple(NotifyTurnOffType.ONE_WEEK, 7, "天"),
            Triple(NotifyTurnOffType.ALWAYS, 365 * 100, "年")
        )

        val member = ChatroomMember().apply {
            roomId = 123
            memberId = 1L
            memberType = AuthorType.USER
            status = GroupMemberStatus.APPROVE
            avatar = "https://avtardfsf"
            nickname = "test"
            username = "testUser"
            notifyTurnOffTime = LocalDateTime.now()
            theme = JSONObject()
            lastReadTime = LocalDateTime.now()
            creator = 1
            updater = 1
            memberRole = GroupMemberRole.MEMBER
        }



        chatroomMemberService.save(member)

        testCases.forEach { (type, expectedValue, unit) ->
            val req = AppChatroomNotificationOffReq().apply {
                roomId = 123
                notifyTurnOff = type.name
            }


            val result = appChatroomController.turnOffNotification(req, loginUserInfo)

            assertEquals(0, result.code)
            val updated = chatroomMemberService.getById(member.id)
            assertNotNull(updated?.notifyTurnOffTime)
        }
    }


    @Test
    fun testFeatureMessagePagination() {
        // 创建10条测试数据
        (1..10).forEach {
            val req = AppFeatureMessageReq().apply {
                uid = 1L
                st = "user"
                txt = "消息$it"
                roomId = "123"
                avatar = "httpssdfsdfsd"
                nn = "test"
            }
            appChatroomService.featureMessage(req, loginUserInfo)
        }

        // 测试分页
        val req1 = FeatureMessagesPageReq().apply {
            pageNo = 1
            pageSize = 5
            roomId = "123"
        }
        val result1 = appChatroomController.getFeatureMessages(req1, loginUserInfo)
        assertEquals(10, result1.data.total)
        assertEquals(5, result1.data.list.size)

        // 测试第二页
        val req2 = FeatureMessagesPageReq().apply {
            pageNo = 2
            pageSize = 5
            roomId = "123"
        }
        val result2 = appChatroomController.getFeatureMessages(req2, loginUserInfo)
        assertEquals(5, result2.data.list.size)
        assertEquals("消息6", result2.data.list[0].txt)
    }

    @Test
    fun testGetChatroomJoinRequests() {
        // 1. 创建聊天室
        val chatroom =
            Chatroom().apply {
                roomName = "测试群聊"
                memberLimit = 100
                description = "测试群聊描述"
                roomCode = "test123"
                historyMsgVisibility = true
                joinDirectly = false
                roomType = CollectionType.GROUP_CHAT
                groupType = ChatroomGroupTypeEnum.PUBLIC
                roomAvatar = "avatar"
                creator = 1
                updater = 1

                // 创建权限配置
                val permissionArray = listOf(
                    PermissionVo().apply {
                        memberRole = "MEMBER"
                        approveNewMembers = true
                    },
                    PermissionVo().apply {
                        memberRole = "MODERATOR"
                        approveNewMembers = true
                    }
                )
                permissions = permissionArray
            }
        chatroomService.save(chatroom)

        // 2. 创建群主
        val ownerMember =
            ChatroomMember().apply {
                roomId = chatroom.id
                memberId = loginUserInfo.userId
                memberType = AuthorType.USER
                memberRole = GroupMemberRole.OWNER
                nickname = "群主"
                username = "owner"
                status = GroupMemberStatus.APPROVE
                avatar = "https://avtardfsf"
                notifyTurnOffTime = LocalDateTime.now()
                theme = JSONObject()
                lastReadTime = LocalDateTime.now()
                creator = 1
                updater = 1
            }
        chatroomMemberService.save(ownerMember)

        // 3. 创建入群申请记录
        val joinRequest1 =
            ChatroomMember().apply {
                roomId = chatroom.id
                memberId = 101L
                memberType = AuthorType.USER
                memberRole = GroupMemberRole.MEMBER
                nickname = "申请者1"
                username = "applicant1"
                status = GroupMemberStatus.USER_JOIN_REQUEST
                avatar = "https://avtardfsf"
                notifyTurnOffTime = LocalDateTime.now()
                theme = JSONObject()
                lastReadTime = LocalDateTime.now()
                creator = 1
                updater = 1
            }
        chatroomMemberService.save(joinRequest1)

        val joinRequest2 =
            ChatroomMember().apply {
                roomId = chatroom.id
                memberId = 102L
                memberType = AuthorType.USER
                memberRole = GroupMemberRole.MEMBER
                nickname = "申请者2"
                username = "applicant2"
                status = GroupMemberStatus.USER_JOIN_REQUEST
                avatar = "https://avtardfsf"
                notifyTurnOffTime = LocalDateTime.now()
                theme = JSONObject()
                lastReadTime = LocalDateTime.now()
                creator = 1
                updater = 1
            }
        chatroomMemberService.save(joinRequest2)

        // 4. 查询入群申请记录
        val req =
            ChatroomJoinRequestPageReq().apply {
                roomId = chatroom.id
                pageNo = 1
                pageSize = 10
            }

        val result = appChatroomController.getChatroomJoinRequests(req, loginUserInfo)

        // 5. 验证结果
        assertEquals(0, result.code)
        assertEquals(2, result.data.list.size)
        assertEquals(2, result.data.total)

        // 验证返回数据内容
        val requests = result.data.list
        val requestUsernames = requests.map { it.username }
        assertTrue(requestUsernames.contains("applicant1"))
        assertTrue(requestUsernames.contains("applicant2"))

        // 6. 测试权限：创建MODERATOR角色的用户，并验证其访问权限
        val moderatorMember =
            ChatroomMember().apply {
                roomId = chatroom.id
                memberId = 103L
                memberType = AuthorType.USER
                memberRole = GroupMemberRole.MODERATOR
                nickname = "版主"
                username = "moderator"
                status = GroupMemberStatus.APPROVE
                avatar = "https://avtardfsf"
                notifyTurnOffTime = LocalDateTime.now()
                theme = JSONObject()
                lastReadTime = LocalDateTime.now()
                creator = 1
                updater = 1
            }
        chatroomMemberService.save(moderatorMember)

        val moderatorUser =
            LoginUserInfo().apply {
                userId = 103L
                username = "moderator"
            }

        // 验证MODERATOR角色也能查询入群申请
        val resultForModerator = appChatroomController.getChatroomJoinRequests(req, moderatorUser)
        assertEquals(0, resultForModerator.code)
        assertEquals(2, resultForModerator.data.list.size)
    }

    @Test
    fun testGetChatroomJoinRequestsNoPermission() {
        // 1. 创建聊天室
        val chatroom =
            Chatroom().apply {
                roomName = "测试群聊2"
                memberLimit = 100
                description = "测试群聊描述"
                roomCode = "test456"
                historyMsgVisibility = true
                joinDirectly = false

                roomType = CollectionType.GROUP_CHAT
                groupType = ChatroomGroupTypeEnum.PUBLIC
                roomAvatar = "avatar"
                creator = 1
                updater = 1

                // 创建权限配置 - 不允许MODERATOR审批新成员


                val permissionArray = listOf(
                    PermissionVo().apply {
                        memberRole = "MODERATOR"
                        approveNewMembers = false
                    }
                )
                permissions = permissionArray
            }
        chatroomService.save(chatroom)

        // 2. 创建普通成员
        val memberUser =
            ChatroomMember().apply {
                roomId = chatroom.id
                memberId = 104L
                memberType = AuthorType.USER
                memberRole = GroupMemberRole.MEMBER
                nickname = "普通成员"
                username = "member"
                status = GroupMemberStatus.APPROVE
                avatar = "https://avtardfsf"
                notifyTurnOffTime = LocalDateTime.now()
                theme = JSONObject()
                lastReadTime = LocalDateTime.now()
                creator = 1
                updater = 1
            }
        chatroomMemberService.save(memberUser)

        // 3. 创建没有权限的版主
        val noPermissionModerator =
            ChatroomMember().apply {
                roomId = chatroom.id
                memberId = 105L
                memberType = AuthorType.USER
                memberRole = GroupMemberRole.MODERATOR
                nickname = "无权限版主"
                username = "moderator_no_permission"
                status = GroupMemberStatus.APPROVE
                avatar = "https://avtardfsf"
                notifyTurnOffTime = LocalDateTime.now()
                theme = JSONObject()
                lastReadTime = LocalDateTime.now()
                creator = 1
                updater = 1
            }
        chatroomMemberService.save(noPermissionModerator)

        // 4. 创建入群申请记录
        val joinRequest =
            ChatroomMember().apply {
                roomId = chatroom.id
                memberId = 106L
                memberType = AuthorType.USER
                memberRole = GroupMemberRole.MEMBER
                nickname = "申请者3"
                username = "applicant3"
                status = GroupMemberStatus.USER_JOIN_REQUEST
                avatar = "https://avtardfsf"
                notifyTurnOffTime = LocalDateTime.now()
                theme = JSONObject()
                lastReadTime = LocalDateTime.now()
                creator = 1
                updater = 1
            }
        chatroomMemberService.save(joinRequest)

        // 5. 构建请求参数
        val req =
            ChatroomJoinRequestPageReq().apply {
                roomId = chatroom.id
                pageNo = 1
                pageSize = 10
            }

        // 6. 使用普通成员身份访问，应该报错
        val memberUserInfo =
            LoginUserInfo().apply {
                userId = 104L
                username = "member"
            }

        // 验证普通成员无法查询入群申请
        val exception1 =
            assertThrows<BusinessException> {
                appChatroomController.getChatroomJoinRequests(req, memberUserInfo)
            }
        assertEquals("You do not have permission for this operation.", exception1.message)

        // 7. 使用无权限版主身份访问，应该报错
        val moderatorUserInfo =
            LoginUserInfo().apply {
                userId = 105L
                username = "moderator_no_permission"
            }

        // 验证无权限版主无法查询入群申请
        val exception2 =
            assertThrows<BusinessException> {
                appChatroomController.getChatroomJoinRequests(req, moderatorUserInfo)
            }
        assertEquals("You do not have permission for this operation.", exception2.message)
    }

    @Test
    fun testJoinChatroom() {
        //1. 创建一个群聊人数只有1的群聊，用于测试加入群聊
        val chatroom = Chatroom().apply {
            roomName = "测试群聊"
            roomType = CollectionType.GROUP_CHAT
            groupType = ChatroomGroupTypeEnum.PUBLIC
            roomAvatar = "avatar"
            memberLimit = 1
            description = "测试群聊"
            roomCode = "test_group_chat"
            historyMsgVisibility = false
            permissions = listOf()
            creator = 1
            updater = 1
            joinDirectly = true
        }.also { chatroomService.save(it) }


        //2. 创建一个用户, 加入群聊
        val user = LoginUserInfo().apply {
            userId = 2L
            username = "testUser2"
            nickname = "testUser2"
            avatar = "http://icon.jpg"
        }
        val result = appChatroomController.joinChatroom(JoinRoomReq().apply {
            roomId = chatroom.id
        }, user)
        assertEquals(0, result.code)
        assertEquals("success", result.data)


        // 验证数据库记录
        val member1 = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(
                ChatroomMember::roomId,
                chatroom.id
            ).eq(ChatroomMember::memberId, user.userId)
        )
        assertNotNull(member1)
        assertEquals(GroupMemberStatus.APPROVE, member1!!.status)
        assertNull(member1.lastReadTime)  // 明确验证lastReadTime为空

        // 3. 重新再加入群聊，应该会触发抛出异常
        try {
            appChatroomController.joinChatroom(JoinRoomReq().apply {
                roomId = chatroom.id
            }, user)
            fail()
        } catch (e: Exception) {
            kotlin.test.assertEquals(e.message, "You have already been in this group chat.")
        }
        // 4. 再创建一个用户, 加入群聊，应该会触发限制异常
        val user2 = LoginUserInfo().apply {
            userId = 3L
            username = "testUser3"
            nickname = "testUser3"
            avatar = "http://icon.jpg"
        }
        try {
            appChatroomController.joinChatroom(JoinRoomReq().apply {
                roomId = chatroom.id
            }, user2)
            fail()
        } catch (e: Exception) {
            kotlin.test.assertEquals(
                e.message,
                "The number of members in this group chat has reached the limit, and you cannot join."
            )
        }
        // 5. 更新群聊信息，joinDirectly=false，memberLimit=2
        chatroom.joinDirectly = false
        chatroom.memberLimit = 2
        chatroomService.updateById(chatroom)
        // 6. 再创建一个用户, 加入群聊，应该能成功申请加入群聊
        val user3 = LoginUserInfo().apply {
            userId = 4L
            username = "testUser4"
            nickname = "testUser4"
            avatar = "http://icon.jpg"
        }
        val result3 = appChatroomController.joinChatroom(JoinRoomReq().apply {
            roomId = chatroom.id
        }, user3)
        assertEquals(0, result3.code)
        assertEquals("success", result.data)
        // 7. 重新再加入群聊，应该会触发已经加入群聊得异常
        try {
            appChatroomController.joinChatroom(JoinRoomReq().apply {
                roomId = chatroom.id
            }, user3)
            fail()
        } catch (e: Exception) {
            kotlin.test.assertEquals(e.message, "You have already applied, please wait for approval.")
        }
        // 6. 再创建一个用户, 加入群聊，应该能成功申请加入群聊
        val user4 = LoginUserInfo().apply {
            userId = 5L
            username = "testUser5"
            nickname = "testUser5"
            avatar = "http://icon.jpg"
        }
        val result4 = appChatroomController.joinChatroom(JoinRoomReq().apply {
            roomId = chatroom.id
        }, user4)
        assertEquals(0, result4.code)
        assertEquals("success", result.data)
    }
}
