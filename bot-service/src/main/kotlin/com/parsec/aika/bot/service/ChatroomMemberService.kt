package com.parsec.aika.bot.service

import com.baomidou.mybatisplus.extension.service.IService
import com.parsec.aika.bot.model.vo.resp.ChatroomJoinNotificationResp
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.dto.ChatroomMemberVo
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.GroupMemberRole
import com.parsec.aika.common.model.em.GroupMemberStatus
import com.parsec.aika.common.model.entity.ChatroomMember
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

/**
 * @author 77923
 * @description 针对表【t_chatroom_member】的数据库操作Service
 * @createDate 2025-02-24 11:53:38
 */
interface ChatroomMemberService : IService<ChatroomMember?> {
    /**
     * 查询群成员
     */
    fun queryRoomMembers(roomId: Int): List<ChatroomMember?>

    /**
     * 设置成员角色
     * @param roomId 聊天室ID
     * @param role 角色
     * @param memberIds 成员ID列表
     */
    fun setMemberRole(roomId: Int, role: String, memberIds: List<String>, user: LoginUserInfo)

    /**
     * 删除群成员
     * @param roomId 聊天室ID
     * @param memberIds 成员ID列表
     */
    fun deleteMembers(roomId: Int, memberIds: List<String>, user: LoginUserInfo)

    /**
     * 添加群成员
     * @param roomId 聊天室ID
     * @param members 成员ID列表
     */
    fun addMembers(roomId: Int, members: List<ChatroomMemberVo>, currentUser: LoginUserInfo)


    /**
     * 添加群主
     */
    fun addOwner(roomId: Int, ownerId: Long, user: LoginUserInfo)

    /**
     * 同意加入群聊
     * @param id 聊天室成员ID
     */
    fun approveJoinRequest(id: Int, user: LoginUserInfo)

    /**
     * 拒绝加入群聊
     */
    fun rejectJoinRequest(id: Int, user: LoginUserInfo): Boolean

    /**
     * 获取群聊邀请申请通知
     */
    fun getChatroomMemberNotifycation(
        pageNo: Int, pageSize: Int, name: String?, user: LoginUserInfo
    ): PageResult<ChatroomJoinNotificationResp?>

    /**
     * 查询群成员
     */
    fun getChatroomMembers(
        roomId: Int,
        pageNo: Int,
        pageSize: Int,
        name: String?,
        status: GroupMemberStatus?,
        memberRole: GroupMemberRole?,
        memberType: AuthorType?
    ): PageResult<ChatroomMember?>

    fun adminDeleteMembers(roomId: Int, memberIds: List<String>, user: LoginUserInfo): Boolean

    fun updateGroupMemberInfo(authorSyncBO: AuthorSyncBO?): Boolean

    /**
     * 添加群聊机器人
     */
    fun addBotMember(roomId: Int, botId: Long, user: LoginUserInfo): Boolean

    /**
     * 移除群聊机器人
     */
    fun deleteBotMember(roomId: Int, botId: Long, user: LoginUserInfo): Boolean

    /**
     * 发送群成员变动消息
     */
    fun sendMemberChangeNotify(member: ChatroomMember, memberChangeType: String, currentUser: LoginUserInfo)


    fun getChatroomMemberNotifycationCount(memberId: Long): Int

    /**
     * 通过邀请链接加入群聊
     */
    fun joinGroupByRoomCode(roomCode: String, user: LoginUserInfo): Int?

    /**
     * 用户删除会话
     */
    fun deleteChatSession(ids: List<Int>, user: LoginUserInfo): Boolean?
}

