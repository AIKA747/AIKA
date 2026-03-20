package com.parsec.aika.bot.service.impl

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.resp.ChatroomJoinNotificationResp
import com.parsec.aika.bot.remote.UserFeignClient
import com.parsec.aika.bot.service.ChatroomMemberService
import com.parsec.aika.bot.service.ChatroomService
import com.parsec.aika.bot.service.GroupMessageService
import com.parsec.aika.bot.service.NotificationService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.ChatroomMemberMapper
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.dto.ChatroomMemberVo
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.Chatroom
import com.parsec.aika.common.model.entity.ChatroomMember
import com.parsec.aika.common.model.entity.GroupChatRecords
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import org.springframework.util.CollectionUtils
import java.time.LocalDateTime
import javax.annotation.Resource


/**
 * @author 77923
 * @description 针对表【t_chatroom_member】的数据库操作Service实现
 * @createDate 2025-02-24 11:53:38
 */
@Service
class ChatroomMemberServiceImpl : ServiceImpl<ChatroomMemberMapper?, ChatroomMember?>(), ChatroomMemberService {

    @Resource
    private lateinit var chatroomService: ChatroomService

    @Resource
    private lateinit var userFeignClient: UserFeignClient

    @Resource
    private lateinit var notificationService: NotificationService

    @Resource
    private lateinit var groupMessageService: GroupMessageService

    @Resource
    private lateinit var botMapper: BotMapper

    override fun queryRoomMembers(roomId: Int): List<ChatroomMember?> {
        return this.ktQuery().eq(ChatroomMember::roomId, roomId).eq(ChatroomMember::status, GroupMemberStatus.APPROVE)
            .list()
    }

    /**
     * 设置成员角色
     */
    override fun setMemberRole(roomId: Int, role: String, memberIds: List<String>, user: LoginUserInfo) {
        if (user.userType != UserTypeEnum.ADMINUSER) {
            // 检查当前用户是否是群主
            val queryWrapper = KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                .eq(ChatroomMember::memberId, user.userId)

            val currentMember = getOne(queryWrapper)
            if (currentMember == null || currentMember.memberRole != GroupMemberRole.OWNER) {
                throw BusinessException("You do not have permission to modify member roles.")
            }
        }
        // 批量更新成员角色
        val updateWrapper = KtUpdateWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
            .`in`(ChatroomMember::memberId, memberIds.map { it.toLong() })
            .set(ChatroomMember::memberRole, GroupMemberRole.valueOf(role))

        update(updateWrapper)
    }

    /**
     * 删除群成员
     */
    override fun deleteMembers(roomId: Int, memberIds: List<String>, user: LoginUserInfo) {

        // 检查当前用户角色
        val queryWrapper = KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
            .eq(ChatroomMember::memberId, user.userId)

        val currentMember = getOne(queryWrapper) ?: throw BusinessException("You are not a member of this chatroom.")

        val currentRole = currentMember.memberRole

        // 将字符串ID列表转为Long类型
        val memberIdsLong = memberIds.map { it.toLong() }
        val delMembers = ArrayList<ChatroomMember>()
        // 检查是否尝试删除自己
        if (memberIdsLong.contains(user.userId)) {
            // 如果是OWNER要删除自己，需要检查是否还有其他OWNER
            if (currentRole == GroupMemberRole.OWNER) {
                // 检查群内是否还有其他OWNER
                val ownerCount = count(
                    KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                        .eq(ChatroomMember::memberRole, GroupMemberRole.OWNER)
                )

                if (ownerCount <= 1) {
                    throw BusinessException("You cannot leave the group as you are the only owner.")
                }
            }
            delMembers.add(currentMember)
        }
        // 根据当前用户角色决定可以删除哪些成员
        for (memberId in memberIdsLong) {
            // 跳过自己（自己删除自己的情况前面已处理）
            if (memberId == user.userId) {
                continue
            }

            // 获取待删除成员的角色
            val targetMember = getOne(
                KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                    .eq(ChatroomMember::memberId, memberId)
            ) ?: continue // 成员不存在，跳过

            val targetRole = targetMember.memberRole
            // 权限验证
            when (currentRole) {
                GroupMemberRole.OWNER -> {
                    // Owner不能删除其他Owner
                    if (targetRole == GroupMemberRole.OWNER) {
                        throw BusinessException("You do not have permission to delete owner.")
                    }
                }

                GroupMemberRole.ADMIN -> {
                    // Owner不能删除其他Owner
                    if (targetRole == GroupMemberRole.OWNER || targetRole == GroupMemberRole.ADMIN) {
                        throw BusinessException("You do not have permission to delete ${if (targetRole == GroupMemberRole.OWNER) "an owner" else "a administrator"}.")
                    }
                }

                GroupMemberRole.MODERATOR -> {
                    // Moderator只能删除普通成员
                    if (targetRole == GroupMemberRole.OWNER || targetRole == GroupMemberRole.ADMIN || targetRole == GroupMemberRole.MODERATOR) {
                        throw BusinessException("You do not have permission to delete ${if (targetRole == GroupMemberRole.OWNER) "an owner" else if (targetRole == GroupMemberRole.ADMIN) "a administrator" else "a moderator"}.")
                    }
                }

                else -> {
                    // 普通成员不能删除其他成员
                    throw BusinessException("You do not have permission to delete others.")
                }
            }
            delMembers.add(targetMember)
        }
        //发送离开群聊的通知
        delMembers.forEach {
            this.sendMemberChangeNotify(it, "leave", user)
        }
        // 执行删除
        this.ktUpdate().eq(ChatroomMember::roomId, roomId)
            .`in`(ChatroomMember::memberId, delMembers.map { it.memberId }).remove()
    }

    /**
     * 添加群成员
     */
    override fun addMembers(roomId: Int, members: List<ChatroomMemberVo>, currentUser: LoginUserInfo) {
        // 检查是否有权限添加成员
        val chatroom = chatroomService.getById(roomId) ?: throw BusinessException("Chatroom not found.")
        if (currentUser.userType != UserTypeEnum.ADMINUSER) {
            // 检查当前用户是否是群主或有添加成员权限
            val queryWrapper = KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                .eq(ChatroomMember::memberId, currentUser.userId!!)
                .eq(ChatroomMember::status, GroupMemberStatus.APPROVE)
            val currentMember =
                getOne(queryWrapper) ?: throw BusinessException("You are not a member of this chatroom.")

            val hasPermission = currentMember.memberRole == GroupMemberRole.OWNER || chatroom.permissions?.any {
                it.memberRole == currentMember.memberRole!!.name && it.addOtherMembers
            } ?: false
            if (!hasPermission) {
                throw BusinessException("You do not have permission to add members.")
            }
        }
        // 查询当前聊天室成员数量
        val memberCount = count(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                .eq(ChatroomMember::status, GroupMemberStatus.APPROVE)
        )
        if (memberCount + members.size > chatroom.memberLimit!!) {
            throw BusinessException("You have invited too many users. Currently, you can also invite ${chatroom.memberLimit!! - memberCount} users to join the group chat")
        }

        // 遍历处理每个要添加的成员
        val membersToAdd = ArrayList<ChatroomMember?>()
        val now = LocalDateTime.now()

        for (member in members) {
            // 检查成员是否已在群内
            val exists = count(
                KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                    .eq(ChatroomMember::memberId, member.memberId!!.toLong())
            ) > 0

            if (exists) {
                continue // 已存在，跳过
            }

            // 获取用户信息
            val userInfo = try {
                userFeignClient.userInfo(member.memberId!!.toLong())
            } catch (e: Exception) {
                null // 用户不存在，跳过
            } ?: continue

            // 创建新成员记录
            val member1 = ChatroomMember().apply {
                this.roomId = roomId
                this.memberId = member.memberId!!.toLong()
                // 默认都为普通角色（创建者除外），也就是说，memberRole = MEMBER （创建者是 OWNER）
                this.memberRole = if (member.memberId!!.toLong() == currentUser.userId!!) {
                    GroupMemberRole.OWNER
                } else {
                    GroupMemberRole.MEMBER
                }
                this.nickname = member.nickname
                this.username = member.username
                this.gender = userInfo.gender
                this.avatar = member.avatar
                this.status =
                    if (userInfo.allowJoinToChat == true) GroupMemberStatus.APPROVE else GroupMemberStatus.FRIEND_INVITE
                this.createdAt = now
                this.updatedAt = now
                this.creator = currentUser.userId!!
                this.updater = currentUser.userId!!
                this.dataVersion = 0
                this.deleted = false
                this.memberType = member.memberType
            }

            membersToAdd.add(member1)
        }
        val userIds = ArrayList<Long>()
        // 批量保存新成员
        if (!CollectionUtils.isEmpty(membersToAdd)) {
            // 发送通知
            for (member in membersToAdd) {
                //判断是否直接加入了群聊
                if (member!!.status == GroupMemberStatus.APPROVE) {
                    this.sendMemberChangeNotify(member, "join", currentUser)
                }
                //保存群成员
                this.save(member)
                //发送通知
                if (member.memberId != currentUser.userId!!) {
                    userIds.add(member.memberId!!)
                }
            }
            if (CollUtil.isNotEmpty(userIds)) {
                notificationService.chatroomMemberNotify(
                    userIds,
                    "${currentUser.nickname} has invited you to join a group chat.",
                    roomId,
                    chatroom.roomAvatar
                )
            }
        }
    }

    override fun addOwner(roomId: Int, ownerId: Long, user: LoginUserInfo) {
        // 精确检查是否已存在Owner
        val exists = count(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                .eq(ChatroomMember::memberId, ownerId).eq(ChatroomMember::memberRole, GroupMemberRole.OWNER)
        ) > 0
        if (exists) {
            throw BusinessException("Owner ${user.nickname} already exists in chatroom")
        }
        // 获取用户信息
        val userInfo = userFeignClient.userInfo(ownerId)
        Assert.notNull(userInfo, "Owner User not found")
        ChatroomMember().apply {
            this.roomId = roomId
            this.memberId = ownerId
            this.memberRole = GroupMemberRole.OWNER
            this.nickname = userInfo!!.nickname
            this.username = userInfo.username
            this.avatar = userInfo.avatar
            this.gender = userInfo.gender
            this.status = GroupMemberStatus.APPROVE
            this.creator = user.userId!!
            this.updater = user.userId!!
            this.dataVersion = 0
            this.deleted = false
            this.memberType = AuthorType.USER
        }.let {
            save(it)
        }
    }

    /**
     * 同意加入群聊
     */
    override fun approveJoinRequest(id: Int, user: LoginUserInfo) {

        // 获取聊天室成员记录
        val chatroomMember = getById(id) ?: throw BusinessException("Record not found.")

        // 检查是否是自己同意别人的邀请
        if (chatroomMember.memberId == user.userId && chatroomMember.status == GroupMemberStatus.FRIEND_INVITE) {
            //发送通知
            this.sendMemberChangeNotify(chatroomMember, "join", user)
            // 更新状态为已同意
            this.ktUpdate().eq(ChatroomMember::id, id).set(ChatroomMember::status, GroupMemberStatus.APPROVE).update()
            return
        }

        // 检查是否是管理员同意他人的加入申请
        // 首先获取当前用户在该群的角色
        val currentMember = getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, chatroomMember.roomId)
                .eq(ChatroomMember::memberId, user.userId)
        )

        // 检查权限
        val chatroom = chatroomService.getById(chatroomMember.roomId) ?: throw BusinessException("Chatroom not found.")
        val hasPermission = currentMember?.memberRole == GroupMemberRole.OWNER || chatroom.permissions?.any {
            it.memberRole == currentMember?.memberRole?.name && it.approveNewMembers
        } ?: false

        if (!hasPermission) {
            throw BusinessException("You have no permission to approve this application.")
        }

        // 检查记录状态是否为用户申请加入
        if (chatroomMember.status != GroupMemberStatus.USER_JOIN_REQUEST) {
            throw BusinessException("Invalid request status.")
        }
        //发送加入群聊消息
        this.sendMemberChangeNotify(chatroomMember, "join", user)
        // 更新状态为已同意
        this.ktUpdate().eq(ChatroomMember::id, id).set(ChatroomMember::status, GroupMemberStatus.APPROVE).update()
    }

    override fun rejectJoinRequest(id: Int, user: LoginUserInfo): Boolean {
        return this.removeById(id)
    }

    override fun getChatroomMemberNotifycation(
        pageNo: Int, pageSize: Int, name: String?, user: LoginUserInfo
    ): PageResult<ChatroomJoinNotificationResp?> {
        PageHelper.startPage<ChatroomMember>(pageNo, pageSize)
        val list = this.baseMapper!!.getChatroomMemberNotifycation(user.userId!!, name)
        return PageUtil<ChatroomJoinNotificationResp?>().page(list)
    }

    override fun getChatroomMembers(
        roomId: Int,
        pageNo: Int,
        pageSize: Int,
        name: String?,
        status: GroupMemberStatus?,
        memberRole: GroupMemberRole?,
        memberType: AuthorType?
    ): PageResult<ChatroomMember?> {
        PageHelper.startPage<ChatroomMember>(pageNo, pageSize)
        val list = this.ktQuery().eq(ChatroomMember::roomId, roomId).and(StrUtil.isNotBlank(name)) {
            it.like(ChatroomMember::nickname, name).or().like(ChatroomMember::username, name)
        }.eq(null != status, ChatroomMember::status, status)
            .eq(null != memberRole, ChatroomMember::memberRole, memberRole)
            .eq(null != memberType, ChatroomMember::memberType, memberType).list()
        return PageUtil<ChatroomMember?>().page(list)
    }

    override fun adminDeleteMembers(roomId: Int, memberIds: List<String>, user: LoginUserInfo): Boolean {
        // 将字符串ID列表转为Long类型
        val chatroomMembers = this.ktQuery().eq(ChatroomMember::roomId, roomId)
            .`in`(ChatroomMember::memberId, memberIds.map { it.toLong() }).list()
        val any = chatroomMembers.any {
            it!!.memberRole == GroupMemberRole.OWNER
        }
        Assert.state(!any, "You can't delete the owner of the chatroom.")
        return this.ktUpdate().eq(ChatroomMember::roomId, roomId)
            .`in`(ChatroomMember::memberId, memberIds.map { it.toLong() }).remove()

    }

    override fun updateGroupMemberInfo(authorSyncBO: AuthorSyncBO?): Boolean {
        return this.ktUpdate().eq(ChatroomMember::memberId, authorSyncBO!!.userId)
            .eq(ChatroomMember::memberType, authorSyncBO.type)
            .set(StrUtil.isNotBlank(authorSyncBO.nickname), ChatroomMember::nickname, authorSyncBO.nickname)
            .set(StrUtil.isNotBlank(authorSyncBO.avatar), ChatroomMember::avatar, authorSyncBO.avatar)
            .set(StrUtil.isNotBlank(authorSyncBO.username), ChatroomMember::username, authorSyncBO.username)
            .set(null != authorSyncBO.gender, ChatroomMember::gender, authorSyncBO.gender).update()
    }

    override fun addBotMember(roomId: Int, botId: Long, user: LoginUserInfo): Boolean {
        // 检查当前用户是否是群主或有添加成员权限
        val currentMember = getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                .eq(ChatroomMember::memberId, user.userId!!).eq(ChatroomMember::status, GroupMemberStatus.APPROVE)
                .last("limit 1")
        ) ?: throw BusinessException("You are not a member of this chatroom.")
        Assert.state(
            currentMember.memberRole == GroupMemberRole.OWNER || currentMember.memberRole == GroupMemberRole.ADMIN,
            "You have no permission to add bot members."
        )
        //查询群聊中的机器人成员数量
        val roomBotCount =
            this.ktQuery().eq(ChatroomMember::roomId, roomId).eq(ChatroomMember::memberType, AuthorType.BOT).count()
        Assert.state(roomBotCount < 2, "The maximum number of bots in the group chat is 2.")
        //判断机器人是否已经存在
        val exists = this.ktQuery().eq(ChatroomMember::roomId, roomId).eq(ChatroomMember::memberId, botId)
            .eq(ChatroomMember::memberType, AuthorType.BOT).exists()
        Assert.state(!exists, "The bot already exists in the group.")
        val bot = botMapper.selectById(botId) ?: throw BusinessException("Bot not found.")
        //添加机器人成员
        return this.save(ChatroomMember().apply {
            this.roomId = roomId
            this.memberId = botId
            this.memberType = AuthorType.BOT
            this.memberRole = GroupMemberRole.MEMBER
            this.status = GroupMemberStatus.APPROVE
            this.nickname = bot.botName
            this.username = bot.botName
            this.avatar = bot.avatar
            this.gender = bot.gender
            this.creator = user.userId
        })

    }

    override fun deleteBotMember(roomId: Int, botId: Long, user: LoginUserInfo): Boolean {
        // 检查当前用户是否是群主或有添加成员权限
        val currentMember = getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                .eq(ChatroomMember::memberId, user.userId!!).eq(ChatroomMember::status, GroupMemberStatus.APPROVE)
                .last("limit 1")
        ) ?: throw BusinessException("You are not a member of this chatroom.")
        Assert.state(
            currentMember.memberRole == GroupMemberRole.OWNER || currentMember.memberRole == GroupMemberRole.ADMIN,
            "You have no permission to add bot members."
        )
        return this.ktUpdate().eq(ChatroomMember::roomId, roomId).eq(ChatroomMember::memberId, botId)
            .eq(ChatroomMember::memberType, AuthorType.BOT).remove()
    }


    /**
     * 发送群成员变动消息
     */
    override fun sendMemberChangeNotify(member: ChatroomMember, memberChangeType: String, currentUser: LoginUserInfo) {
        StaticLog.info("start: sendMemberChangeNotify: $memberChangeType , member: ${member.memberId} , roomId:${member.roomId}")
        //构建聊天记录对象
        val chatRecord = GroupChatRecords().apply {
            this.uid = currentUser.userId!!.toLong()
            this.st = SourceTypeEnum.user
            this.ct = ContentType.memberChange
            this.avatar = member.avatar
            this.nn = member.nickname
            this.txt = "${member.nickname} $memberChangeType the group"
            this.time = LocalDateTime.now()
            this.roid = member.roomId
            this.json = JSONObject().apply {
                this["type"] = memberChangeType
                this["memberType"] = member.memberType
                this["memberRole"] = member.memberRole
                this["memberId"] = member.memberId
                this["nickname"] = member.nickname
                this["username"] = member.username
            }.toString()
        }
        groupMessageService.sendChatMsgToGroupMember(member.roomId!!, chatRecord)
        StaticLog.info("end: sendMemberChangeNotify: $memberChangeType , member: ${member.memberId} , roomId:${member.roomId}")
    }

    override fun getChatroomMemberNotifycationCount(memberId: Long): Int {
        return baseMapper!!.getChatroomMemberNotifycationCount(memberId)
    }

    override fun joinGroupByRoomCode(roomCode: String, user: LoginUserInfo): Int? {
        val chatroom = (chatroomService.ktQuery().eq(Chatroom::roomCode, roomCode).one()
            ?: throw BusinessException("Room code not found."))
        if (chatroom.groupType == ChatroomGroupTypeEnum.PRIVATE) {
            throw BusinessException("The room is private.")
        }
        //判断一下该用户是否已是群成员或已申请加入
        val exists =
            this.ktQuery().eq(ChatroomMember::roomId, chatroom.id).eq(ChatroomMember::memberId, user.userId).exists()
        if (exists) {
            return chatroom.id
        }

        //直接加入群聊
        val member = ChatroomMember().apply {
            this.roomId = chatroom.id
            this.memberId = user.userId!!
            this.memberType = AuthorType.USER
            this.memberRole = GroupMemberRole.MEMBER
            this.status =
                if (chatroom.joinDirectly == true) GroupMemberStatus.APPROVE else GroupMemberStatus.USER_JOIN_REQUEST
            this.nickname = user.nickname
            this.username = user.username
            this.avatar = user.avatar
            this.gender = user.gender
            this.creator = user.userId
        }
        //保存群成员
        this.save(member)
        if (member.status == GroupMemberStatus.APPROVE) {
            //发送群成员变动消息
            sendMemberChangeNotify(member, "join", user)
        }
        return chatroom.id
    }

    override fun deleteChatSession(ids: List<Int>, user: LoginUserInfo): Boolean? {
        //标记用户聊天会话删除时间
        return this.ktUpdate().eq(ChatroomMember::memberId, user.userId).`in`(ChatroomMember::roomId, ids)
            .set(ChatroomMember::clearTime, LocalDateTime.now()).update()
    }
}




