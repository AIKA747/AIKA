package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.model.vo.resp.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

/** 聊天室应用服务接口 */
interface AppChatroomService {
    /** 标记精选消息 */
    fun featureMessage(req: AppFeatureMessageReq, user: LoginUserInfo): Boolean

    /** 关闭消息提醒 */
    fun turnOffNotification(req: AppChatroomNotificationOffReq, user: LoginUserInfo)

    /** 查询群聊详情 */
    fun getChatroomDetail(id: Int, userInfo: LoginUserInfo): AppChatroomDetailResp

    fun getChatroomDetailByCode(code: String, userInfo: LoginUserInfo): AppChatroomDetailResp?

    /** 查询群成员列表 */
    fun getChatroomMembers(
        req: ChatroomMembersPageReq,
    ): PageResult<AppChatroomMemberResp>

    /** 获取聊天列表 */
    fun getChatroomList(
        req: ChatroomListPageReq,
        user: LoginUserInfo
    ): PageResult<AppChatroomListResp>

    /** 获取用户精选消息 */
    fun getFeatureMessages(
        req: FeatureMessagesPageReq,
        user: LoginUserInfo
    ): PageResult<AppFeatureMessageResp>

    /** 加入聊天室 */
    fun joinChatroom(
        roomId: Int,
        user: LoginUserInfo
    ): Boolean

    /** 创建群聊 */
    fun createChatroom(req: AppChatroomCreatReq, user: LoginUserInfo): Int

    fun updateChatroom(req: AppChatroomUpdateReq, user: LoginUserInfo): Int?

    fun updatePermission(req: AppChatroomUpdateReq, user: LoginUserInfo): Int?

    fun updateGroupType(req: AppChatroomUpdateReq, user: LoginUserInfo): Int?

    fun updatehistoryVisible(req: AppChatroomUpdateReq, user: LoginUserInfo): Int?

    fun updateTheme(req: AppChatroomThemeReq, user: LoginUserInfo): Int?

    fun deleteChatroom(roomId: Int, user: LoginUserInfo): Int?

    /** 查询入群申请列表 */
    fun getChatroomJoinRequests(
        req: ChatroomJoinRequestPageReq,
        user: LoginUserInfo
    ): PageResult<AppChatroomJoinRequestResp>

    /**
     * 查询一对一用户聊天室信息
     */
    fun getUserChatroom(oneUserId: Long, twoUserId: Long, user: LoginUserInfo): Int?

    /**
     * 搜索聊天室
     */
    fun searchChatroomList(
        pageNo: Int?,
        pageSize: Int?,
        searchContent: String?,
        user: LoginUserInfo
    ): PageResult<ChatroomResp>?

}
