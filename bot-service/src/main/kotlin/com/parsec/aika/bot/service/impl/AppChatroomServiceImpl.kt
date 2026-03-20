package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.IdUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.model.vo.resp.*
import com.parsec.aika.bot.remote.UserFeignClient
import com.parsec.aika.bot.service.*
import com.parsec.aika.common.mapper.ChatroomMapper
import com.parsec.aika.common.model.dto.AppUserVO
import com.parsec.aika.common.model.dto.PermissionVo
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.Chatroom
import com.parsec.aika.common.model.entity.ChatroomMember
import com.parsec.aika.common.model.entity.MessageFeature
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import com.parsec.trantor.redis.annotation.RedisLock
import com.parsec.trantor.redis.enums.LockStrategy
import org.springframework.beans.BeanUtils
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import javax.annotation.Resource

@Service
class AppChatroomServiceImpl : AppChatroomService {

    @Resource
    private lateinit var chatroomService: ChatroomService

    @Resource
    private lateinit var chatroomMapper: ChatroomMapper

    @Resource
    private lateinit var chatroomMemberService: ChatroomMemberService

    @Resource
    private lateinit var messageFeatureService: MessageFeatureService

    @Resource
    private lateinit var onlineService: UserOnlineService

    @Resource
    private lateinit var botService: BotService

    @Resource
    private lateinit var userFeignClient: UserFeignClient


    @Transactional
    override fun createChatroom(req: AppChatroomCreatReq, user: LoginUserInfo): Int {
        val chatroom = Chatroom().apply {
            roomName = req.roomName
            roomType = CollectionType.GROUP_CHAT
            groupType = req.groupType
            roomAvatar = req.roomAvatar
            memberLimit = 200
            description = req.description
            roomCode = IdUtil.nanoId(6)
            permissions = listOf(PermissionVo().apply {
                memberRole = GroupMemberRole.MEMBER.name
                linkChatToPosts = true
            }, PermissionVo().apply {
                memberRole = GroupMemberRole.MODERATOR.name
                changeGroupInfo = true
                linkChatToPosts = true
                approveNewMembers = true
                addOtherMembers = true
                changeShowHis = true
            }, PermissionVo().apply {
                memberRole = GroupMemberRole.ADMIN.name
                changeGroupInfo = true
                linkChatToPosts = true
                approveNewMembers = true
                addOtherMembers = true
                changeShowHis = true
                changeGroupType = true
            }).toMutableList().apply {
                // 合并请求中的权限配置
                req.permissions?.forEach { reqPerm ->
                    val index = indexOfFirst { it.memberRole == reqPerm.memberRole }
                    if (index != -1) {
                        // 仅更新存在的字段，保持其他字段为默认false
                        reqPerm.changeGroupInfo.let { this[index].changeGroupInfo = it }
                        reqPerm.linkChatToPosts.let { this[index].linkChatToPosts = it }
                        reqPerm.approveNewMembers.let { this[index].approveNewMembers = it }
                        reqPerm.addOtherMembers.let { this[index].addOtherMembers = it }
                    }
                }
            }
            creator = user.userId
            updater = user.userId
            joinDirectly = true
            creatorType = user.userType
        }
        chatroomMapper.insert(chatroom)

        chatroomMemberService.addOwner(roomId = chatroom.id!!, req.ownerId ?: user.userId!!, user = user)
        if (req.members?.isNotEmpty() == true) {
            chatroomMemberService.addMembers(roomId = chatroom.id!!, members = req.members!!, currentUser = user)
        }
        return chatroom.id!!

    }

    override fun updatePermission(req: AppChatroomUpdateReq, user: LoginUserInfo): Int? {
        // 1. 校验群聊存在
        val chatroom = chatroomService.getById(req.id ?: throw IllegalArgumentException("Room ID required"))
            ?: throw RuntimeException("Chatroom not found")
        checkPerimission(req)

        // 2. 获取当前用户角色
        val member = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, req.id)
                .eq(ChatroomMember::memberId, user.userId)
        ) ?: throw RuntimeException("User not in this chatroom")
        when (member.memberRole) {
            GroupMemberRole.OWNER, GroupMemberRole.ADMIN -> {
                // Owner 拥有全部权限
            }

            else -> throw RuntimeException("You do not have permission to modify these settings")
        }
        chatroom.apply {
            permissions = req.permissions
        }
        // 5. 保存更新
        chatroomService.updateById(Chatroom().apply {
            id = chatroom.id
            permissions = chatroom.permissions
        })
        return chatroom.id
    }

    override fun updateGroupType(req: AppChatroomUpdateReq, user: LoginUserInfo): Int? {
        // 1. 校验群聊存在
        val chatroom = chatroomService.getById(req.id ?: throw IllegalArgumentException("Room ID required"))
            ?: throw RuntimeException("Chatroom not found")
        req.groupType ?: throw IllegalArgumentException("Group type required")
        val apply = AppChatroomUpdateReq().apply { id = req.id; groupType = req.groupType }

        return updateChatRoomBaseInfo(req, user, apply, chatroom)
    }

    override fun updatehistoryVisible(req: AppChatroomUpdateReq, user: LoginUserInfo): Int? {
        // 1. 校验群聊存在
        val chatroom = chatroomService.getById(req.id ?: throw IllegalArgumentException("Room ID required"))
            ?: throw RuntimeException("Chatroom not found")
        req.historyMsgVisibility ?: throw IllegalArgumentException("historyMsgVisibility type required")
        val apply = AppChatroomUpdateReq().apply { id = req.id; historyMsgVisibility = req.historyMsgVisibility }

        return updateChatRoomBaseInfo(req, user, apply, chatroom)
    }

//

    private fun updateChatRoomBaseInfo(
        req: AppChatroomUpdateReq, user: LoginUserInfo, apply: AppChatroomUpdateReq, chatroom: Chatroom
    ): Int? {
        // 2. 获取当前用户角色
        val member = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, req.id)
                .eq(ChatroomMember::memberId, user.userId)
        ) ?: throw RuntimeException("User not in this chatroom")

        checkUpdateChatRoomPermission(member, apply, chatroom)
        // 5. 保存更新
        chatroomService.updateById(Chatroom().apply {
            id = apply.id!!.toInt()
//            dataVersion = chatroom.dataVersion!!+1
            apply.groupType?.let { groupType = it }
            apply.historyMsgVisibility?.let { historyMsgVisibility = it }
        })
        return chatroom.id
    }

    private fun checkPerimission(req: AppChatroomUpdateReq) {
        req.permissions ?: throw IllegalArgumentException("Permissions required")
        // 建议增加集合内容校验（根据业务需求选择）
        if (req.permissions!!.isEmpty()) { // 检查空集合
            throw IllegalArgumentException("Permissions cannot be empty")
        }
        val distinctRoles = req.permissions!!.map { it.memberRole }.distinct()
        if (distinctRoles.size != req.permissions!!.size) {
            throw IllegalArgumentException("Duplicate member roles in permissions")
        }
    }

    @Transactional
    override fun updateChatroom(req: AppChatroomUpdateReq, user: LoginUserInfo): Int? {
        // 1. 校验群聊存在
        val chatroom = chatroomService.getById(req.id ?: throw IllegalArgumentException("Room ID required"))
            ?: throw RuntimeException("Chatroom not found")

        // 2. 获取当前用户角色
        val member = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, req.id)
                .eq(ChatroomMember::memberId, user.userId)
        ) ?: throw RuntimeException("User not in this chatroom")

        // 3. 权限校验逻辑
        checkUpdateChatRoomPermission(member, req, chatroom)


        // 5. 保存更新
        chatroomService.updateById(Chatroom().apply {
            id = chatroom.id
            roomName = req.roomName
            groupType = req.groupType
            roomAvatar = req.roomAvatar
            description = req.description
            permissions = req.permissions
        })
        return chatroom.id
    }

    private fun checkUpdateChatRoomPermission(
        member: ChatroomMember, req: AppChatroomUpdateReq, chatroom: Chatroom
    ) {
        when (member.memberRole) {
            GroupMemberRole.OWNER -> {
                // Owner 拥有全部权限
            }

            GroupMemberRole.MODERATOR, GroupMemberRole.MEMBER -> {
                // 禁止修改权限配置
                if (req.permissions != null) {
                    throw RuntimeException("You do not have permission to modify permissions")
                }

                // 检查是否有修改基础设置的权限
                val hasPermission = checkUpdatePermission(
                    role = member.memberRole!!, permissions = chatroom.permissions!!
                )
                if (!hasPermission) {
                    throw RuntimeException("You do not have permission to modify these settings")
                }
            }

            else -> throw RuntimeException("Invalid role")
        }
    }

    private fun checkUpdatePermission(role: GroupMemberRole, permissions: List<PermissionVo>?): Boolean {
        // 默认无权限
        var allowed = false

        permissions?.firstOrNull { it.memberRole == role.name }?.let {
            allowed = it.changeGroupInfo == true
        }

        return allowed
    }


    /** 标记精选消息 */
    override fun featureMessage(req: AppFeatureMessageReq, user: LoginUserInfo): Boolean {
        // 创建MessageFeature对象
        val messageFeature = MessageFeature().apply {
            uid = req.uid
            st = req.st
            avatar = req.avatar
            nn = req.nn
            txt = req.txt
            med = req.med
            flength = req.flength?.toLongOrNull()
            fn = req.fn
            time = if (req.time != null) req.time else LocalDateTime.now()
            roomId = req.roomId
            creator = user.userId
            rid = req.rid
            rmessage = req.rmessage
            mid = req.mid
            ct = req.ct
        }

        // 查重条件
        val queryWrapper = KtQueryWrapper(MessageFeature::class.java).eq(MessageFeature::creator, user.userId)
            .eq(MessageFeature::mid, req.mid)

        // 查询是否已存在
        val count = messageFeatureService.count(queryWrapper)

        // 如果不存在，则保存
        if (count == 0) {
            messageFeatureService.save(messageFeature)
            return true
        }
        return false
    }

    /** 关闭消息提醒 */
    override fun turnOffNotification(req: AppChatroomNotificationOffReq, user: LoginUserInfo) {
        // 查询聊天室成员
        val queryWrapper = KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, req.roomId)
            .eq(ChatroomMember::memberId, user.userId)

        val chatroomMember =
            chatroomMemberService.getOne(queryWrapper) ?: throw RuntimeException("Cloud not find chatroom member")

        // 根据枚举类型设置关闭时间
        val now = LocalDateTime.now()
        chatroomMember.notifyTurnOff = req.notifyTurnOff
        chatroomMember.notifyTurnOffTime = when (req.notifyTurnOff) {
            NotifyTurnOffType.ONE_HOUR.name -> now.plus(1, ChronoUnit.HOURS)
            NotifyTurnOffType.EIGHT_HOUR.name -> now.plus(8, ChronoUnit.HOURS)
            NotifyTurnOffType.ONE_DAY.name -> now.plus(1, ChronoUnit.DAYS)
            NotifyTurnOffType.ONE_WEEK.name -> now.plus(7, ChronoUnit.DAYS)
            NotifyTurnOffType.ALWAYS.name -> now.plus(100, ChronoUnit.YEARS)
            else -> now
        }

        // 更新关闭时间
        chatroomMemberService.updateById(chatroomMember)
    }

    /** 查询群聊详情 */
    override fun getChatroomDetail(id: Int, userInfo: LoginUserInfo): AppChatroomDetailResp {
        val chatroom = chatroomService.getById(id) ?: throw RuntimeException("Cloud not find chatroom")
        return getChatroomDetail(chatroom, userInfo)
    }

    override fun getChatroomDetailByCode(code: String, userInfo: LoginUserInfo): AppChatroomDetailResp? {
        val chatroom = chatroomService.ktQuery().eq(Chatroom::roomCode, code).last("limit 1").one()
            ?: throw RuntimeException("Cloud not find chatroom")
        return getChatroomDetail(chatroom, userInfo)
    }

    private fun getChatroomDetail(chatroom: Chatroom, userInfo: LoginUserInfo): AppChatroomDetailResp {
        val resp = AppChatroomDetailResp()
        BeanUtils.copyProperties(chatroom, resp, "permissions")
        //查询当前用户设置的当前群聊的主题信息
        val oneOpt = chatroomMemberService.ktQuery().eq(ChatroomMember::memberId, userInfo.userId)
            .eq(ChatroomMember::roomId, chatroom.id).oneOpt()
        if (oneOpt.isPresent) {
            val member = oneOpt.get()
            resp.theme = member.theme
            resp.status = member.status
            resp.notifyTurnOff = member.notifyTurnOff
            resp.notifyTurnOffTime = member.notifyTurnOffTime
            if (resp.status == GroupMemberStatus.FRIEND_INVITE) {
                resp.inviteId = member.id
            }
            resp.memberRole = member.memberRole
            resp.permissions = chatroom.permissions
        } else {
            resp.status = GroupMemberStatus.NONE
        }
        //给一个默认设置
        if (null == resp.theme || resp.theme?.isEmpty() == true) {
            resp.theme = JSONObject().apply {
                set("type", "color")
                set("color", "#0B0C0A")
            }
        }
        //若为用户一对一聊天，则聊天室名称和头像设置为聊天对象的头像和昵称
        if (chatroom.roomType == CollectionType.CHAT) {
            val member = chatroomMemberService.ktQuery().eq(ChatroomMember::roomId, chatroom.id)
                .ne(ChatroomMember::memberId, userInfo.userId).last("limit 1").one()
            resp.roomName = member?.nickname
            resp.roomAvatar = member?.avatar
        }
        return resp
    }

    /** 查询群成员列表 */
    override fun getChatroomMembers(req: ChatroomMembersPageReq): PageResult<AppChatroomMemberResp> {
        var nickname: String? = null
        var username: String? = null
        if (StrUtil.isNotBlank(req.nickname)) {
            if (StrUtil.startWith(req.nickname, "@")) {
                username = StrUtil.removePrefix(req.nickname, "@")
            } else {
                nickname = req.nickname
            }
        }
        PageHelper.startPage<ChatroomMember>(req.pageNo!!, req.pageSize!!)
        val queryWrapper = KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, req.roomId)
            .like(StrUtil.isNotBlank(nickname), ChatroomMember::nickname, nickname)
            .like(StrUtil.isNotBlank(username), ChatroomMember::username, username)
            .`in`(StrUtil.isNotBlank(req.memberRole), ChatroomMember::memberRole, StrUtil.split(req.memberRole, ","))
            .eq(req.status != null, ChatroomMember::status, req.status)
            .eq(req.memberType != null, ChatroomMember::memberType, req.memberType).orderByAsc(ChatroomMember::status)
            .orderByAsc(ChatroomMember::nickname)

        val selectList = chatroomMemberService.list(queryWrapper)
        val pageResult = PageUtil<ChatroomMember?>().page(selectList)

        return PageResult<AppChatroomMemberResp>().apply {
            this.list = pageResult.list.map {
                val resp = AppChatroomMemberResp()
                BeanUtils.copyProperties(it!!, resp)
                if (resp.memberType == AuthorType.BOT) {
                    resp.onlineStatus = botService.onlineStatus(resp.memberId!!)
                } else {
                    resp.onlineStatus = onlineService.online(it.memberId!!)
                }
                resp
            }
            this.total = pageResult.total
            this.pageSize = pageResult.pageSize
            this.pageNum = pageResult.pageNum
            this.pages = pageResult.pages
        }
    }

    /** 获取聊天列表 */
    override fun getChatroomList(
        req: ChatroomListPageReq, user: LoginUserInfo
    ): PageResult<AppChatroomListResp> {
        PageHelper.startPage<AppChatroomListResp>(req.pageNo!!, req.pageSize!!)
        val list = chatroomMapper.getMyChatroomList(user.userId!!, req.roomName)
        list.forEach {
            // 获取未读消息数,未读数由前端同步数据后处理
            if (it.lastReadTime != null && it.id != null) {
                it.unreadNum = chatroomService.chatroomUnreadNum(it.lastReadTime!!, it.id!!)
            }
            it.lastMessage = chatroomService.lastMessage(it.id!!)
        }
        return PageUtil<AppChatroomListResp>().page(list)
    }

    /** 获取用户精选消息 */
    override fun getFeatureMessages(
        req: FeatureMessagesPageReq, user: LoginUserInfo
    ): PageResult<AppFeatureMessageResp> {
        PageHelper.startPage<MessageFeature>(req.pageNo!!, req.pageSize!!)
        val queryWrapper = KtQueryWrapper(MessageFeature::class.java).eq(MessageFeature::creator, user.userId)

        if (!req.roomId.isNullOrBlank()) {
            queryWrapper.eq(MessageFeature::roomId, req.roomId)
        }

        val list = messageFeatureService.list(queryWrapper)
        val pageResult = PageUtil<MessageFeature?>().page(list)

        return PageResult<AppFeatureMessageResp>().apply {
            this.list = pageResult.list.map {
                AppFeatureMessageResp().apply { BeanUtils.copyProperties(it!!, this) }
            }
            this.total = pageResult.total
            this.pageSize = pageResult.pageSize
            this.pageNum = pageResult.pageNum
            this.pages = pageResult.pages
        }
    }

    /** 查询入群申请列表 */
    override fun getChatroomJoinRequests(
        req: ChatroomJoinRequestPageReq, user: LoginUserInfo
    ): PageResult<AppChatroomJoinRequestResp> {
        // 1. 验证当前用户权限
        val queryWrapper = KtQueryWrapper(ChatroomMember::class.java)
        queryWrapper.eq(ChatroomMember::roomId, req.roomId)
        queryWrapper.eq(ChatroomMember::memberId, user.userId)
        val currentMember = chatroomMemberService.getOne(queryWrapper)
            ?: throw BusinessException("You are not a member of this chatroom")

        // 2. 权限校验 - OWNER 一定有权限，MODERATOR 需要检查权限
        val hasPermission = when (currentMember.memberRole) {
            GroupMemberRole.OWNER -> true
            GroupMemberRole.MODERATOR -> {
                // 获取聊天室对象
                val chatroom = chatroomService.getById(req.roomId) ?: throw BusinessException("Chatroom not found")

                // 检查 permissions 数组中该角色是否有 approveNewMembers 权限
                val permissionsObj = chatroom.permissions?.find {
                    it.memberRole == GroupMemberRole.MODERATOR.name
                }
                permissionsObj?.approveNewMembers ?: false

            }

            else -> false
        }

        if (!hasPermission) {
            throw BusinessException("You do not have permission for this operation.")
        }

        // 3. 查询符合条件的记录
        PageHelper.startPage<ChatroomMember>(req.pageNo!!, req.pageSize!!)
        val joinRequestQueryWrapper = KtQueryWrapper(ChatroomMember::class.java)
        joinRequestQueryWrapper.eq(ChatroomMember::roomId, req.roomId)
        joinRequestQueryWrapper.eq(ChatroomMember::status, GroupMemberStatus.USER_JOIN_REQUEST)
        val selectList = chatroomMemberService.list(joinRequestQueryWrapper)
        val pageResult = PageUtil<ChatroomMember?>().page(selectList)

        // 4. 转换响应对象
        return PageResult<AppChatroomJoinRequestResp>().apply {
            this.list = pageResult.list.map {
                val resp = AppChatroomJoinRequestResp()
                BeanUtils.copyProperties(it!!, resp)
                resp
            }
            this.total = pageResult.total
            this.pageSize = pageResult.pageSize
            this.pageNum = pageResult.pageNum
            this.pages = pageResult.pages
        }
    }

    @RedisLock(
        name = "userChatroom", keys = ["#oneUserId", "#twoUserId"], lockStrategy = LockStrategy.KEEP_ACQUIRE_TIMEOUT
    )
    override fun getUserChatroom(oneUserId: Long, twoUserId: Long, user: LoginUserInfo): Int? {
        //查询两个用户共同的一对一聊天室
        var chatroom = chatroomMapper.selectUserChatroom(oneUserId, twoUserId)
        if (null == chatroom) {
            chatroom = Chatroom().apply {
                roomName = "$oneUserId-$twoUserId"
                roomType = CollectionType.CHAT
                groupType = ChatroomGroupTypeEnum.PRIVATE
                roomAvatar = user.avatar
                memberLimit = 2
                description = "User one-on-one chat"
                roomCode = IdUtil.nanoId(6)
                permissions = emptyList()
                creator = user.userId
                updater = if (oneUserId == user.userId) twoUserId else oneUserId
                joinDirectly = false
            }
            chatroomMapper.insert(chatroom)
            val oneUserInfo: AppUserVO?
            val twoUserInfo: AppUserVO?
            if (oneUserId == user.userId) {
                oneUserInfo = AppUserVO().apply {
                    this.id = oneUserId
                    this.username = user.username
                    this.nickname = user.nickname
                    this.avatar = user.avatar
                }
                twoUserInfo = userFeignClient.userInfo(twoUserId)
            } else {
                twoUserInfo = AppUserVO().apply {
                    this.id = twoUserId
                    this.username = user.username
                    this.nickname = user.nickname
                    this.avatar = user.avatar
                }
                oneUserInfo = userFeignClient.userInfo(oneUserId)
            }
            val now = LocalDateTime.now()
            //创建群成员
            val memberOne = ChatroomMember().apply {
                this.roomId = chatroom.id
                this.memberId = oneUserId
                this.memberRole = GroupMemberRole.MEMBER
                this.nickname = oneUserInfo?.nickname
                this.username = oneUserInfo?.username
                this.gender = oneUserInfo?.gender
                this.avatar = oneUserInfo?.avatar
                this.status = GroupMemberStatus.APPROVE
                this.createdAt = now
                this.updatedAt = now
                this.creator = user.userId!!
                this.updater = user.userId!!
                this.dataVersion = 0
                this.deleted = false
                this.memberType = AuthorType.USER
            }
            chatroomMemberService.save(memberOne)
            //创建群成员
            val memberTwo = ChatroomMember().apply {
                this.roomId = chatroom.id
                this.memberId = twoUserId
                this.memberRole = GroupMemberRole.MEMBER
                this.nickname = twoUserInfo?.nickname
                this.username = twoUserInfo?.username
                this.gender = twoUserInfo?.gender
                this.avatar = twoUserInfo?.avatar
                this.status = GroupMemberStatus.APPROVE
                this.createdAt = now
                this.updatedAt = now
                this.creator = user.userId!!
                this.updater = user.userId!!
                this.dataVersion = 0
                this.deleted = false
                this.memberType = AuthorType.USER
            }
            chatroomMemberService.save(memberTwo)
        }
        return chatroom.id
    }

    override fun searchChatroomList(
        pageNo: Int?, pageSize: Int?, searchContent: String?, user: LoginUserInfo
    ): PageResult<ChatroomResp>? {
        PageHelper.startPage<ChatroomResp>(pageNo ?: 1, pageSize ?: 10)
        val list = chatroomMapper.searchChatroomList(searchContent, user.userId)
        list.filter {
            it.joined == true
        }.forEach {
            it.unreadNum =
                chatroomService.chatroomUnreadNum(it.lastReadTime ?: it.createdAt ?: LocalDateTime.now(), it.id!!)
        }
        return PageUtil<ChatroomResp>().page(list)
    }

    override fun updateTheme(req: AppChatroomThemeReq, user: LoginUserInfo): Int? {
        // 1. 校验群聊存在
        val chatroom = chatroomService.getById(req.roomId ?: throw IllegalArgumentException("Room ID required"))
            ?: throw RuntimeException("Chatroom not found")

        // 2. 获取当前用户的群成员信息
        val member = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, req.roomId)
                .eq(ChatroomMember::memberId, user.userId)
        ) ?: throw RuntimeException("User not in this chatroom")

        // 3.个人设置主题不用校验权限
        //checkUpdateChatRoomPermission(member, AppChatroomUpdateReq(), chatroom)

        // 4. 更新主题
        chatroomMemberService.ktUpdate().set(
            ChatroomMember::theme,
            JSONObject().apply { set("color", req.color);set("type", req.type);set("gallery", req.gallery) }.toString()
        ).eq(ChatroomMember::id, member.id).update()
        return chatroom.id
    }

    /**
     * ## 七. 删除群聊
     * 1. 路由地址：DELETE /bot/app/chatroom/{roomId}
     * 2. 文档路径：https://app.apifox.com/link/project/3612779/apis/api-262908315
     * 3. 数据实体 ChatRoom
     * ### 需求说明
     * 1. 删除群聊，并删除ChatroomMemeber中的相关成员。
     * 2. 只有Owner才能删除群，其它人均无权做此操作，越权操作时应抛出异常提醒 "You do not have permission to delete the group."
     *
     *
     */
    override fun deleteChatroom(roomId: Int, user: LoginUserInfo): Int? {
        val chatroom = chatroomService.getById(roomId) ?: throw RuntimeException("Cloud not find chatroom")
        if (chatroom.creator != user.userId) {
            throw RuntimeException("You do not have permission to delete the group.")
        }
        chatroomService.removeById(roomId)
        chatroomMemberService.remove(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
        )
        return chatroom.id
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun joinChatroom(roomId: Int, user: LoginUserInfo): Boolean {
        val chatroom = chatroomService.getById(roomId) ?: throw RuntimeException("Not find chatroom")

        Assert.state(
            chatroom.groupType == ChatroomGroupTypeEnum.PUBLIC, "Privacy group chat does not allow application to join"
        )

        val memberLimit = chatroom.memberLimit!!
        val joinDirectly = chatroom.joinDirectly!!

        // 是否已经加入群聊
        val member = chatroomMemberService.getOne(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                .eq(ChatroomMember::memberId, user.userId)
        )
        if (member != null) {
            if (member.status == GroupMemberStatus.APPROVE) {
                throw RuntimeException("You have already been in this group chat.")
            } else {
                throw RuntimeException("You have already applied, please wait for approval.")
            }
        }
        // 计算 roomId={roomId} and status="APPROVE" 的记录数量
        val memberCount = chatroomMemberService.count(
            KtQueryWrapper(ChatroomMember::class.java).eq(ChatroomMember::roomId, roomId)
                .eq(ChatroomMember::status, GroupMemberStatus.APPROVE)
        )
        if (memberCount >= memberLimit) {
            throw RuntimeException("The number of members in this group chat has reached the limit, and you cannot join.")
        }

        val chatroomMember = ChatroomMember().apply {
            this.roomId = roomId
            this.memberType = AuthorType.USER
            this.memberId = user.userId
            this.avatar = user.avatar
            this.nickname = user.nickname
            this.username = user.username
            this.memberRole = GroupMemberRole.MEMBER
            this.status = if (joinDirectly) GroupMemberStatus.APPROVE else GroupMemberStatus.USER_JOIN_REQUEST
            this.lastReadTime = null

            this.notifyTurnOffTime = LocalDateTime.now()
            this.theme = JSONObject()
            this.creator = user.userId
            this.updater = user.userId
        }
        chatroomMemberService.save(chatroomMember)
        if (chatroomMember.status == GroupMemberStatus.APPROVE) {
            //发送加入群聊通知
            chatroomMemberService.sendMemberChangeNotify(chatroomMember, "join", user)
        }
        return true
    }
}
