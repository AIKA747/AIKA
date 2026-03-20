package com.parsec.aika.bot.controller.app

import cn.hutool.core.lang.Assert
import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.model.vo.resp.*
import com.parsec.aika.bot.service.AppChatroomService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class AppChatroomController {

    @Resource
    private lateinit var appChatroomService: AppChatroomService

    /** 创建群聊 */
    @PostMapping("/app/chatroom")
    fun createChatroom(
        @RequestBody @Validated req: AppChatroomCreatReq, user: LoginUserInfo
    ): BaseResult<Int> {
        return BaseResult.success(appChatroomService.createChatroom(req, user))
    }

    /** 编辑群聊 */
    @PutMapping("/app/chatroom")
    fun updateChatroom(
        @RequestBody req: AppChatroomUpdateReq, user: LoginUserInfo
    ): BaseResult<Int?>? {
        return BaseResult.success(appChatroomService.updateChatroom(req, user))
    }

    @PutMapping("/app/chatroom/permissions")
    fun updateChatRoomPermission(
        @RequestBody req: AppChatroomUpdateReq, user: LoginUserInfo
    ): BaseResult<Int?>? {
        return BaseResult.success(appChatroomService.updatePermission(req, user))
    }

    @PutMapping("/app/chatroom/group-type")
    fun updateChatRoomGroupType(
        @RequestBody req: AppChatroomUpdateReq, user: LoginUserInfo
    ): BaseResult<Int?>? {
        return BaseResult.success(appChatroomService.updateGroupType(req, user))
    }

    @PutMapping("/app/chatroom/theme")
    fun updateTheme(
        @RequestBody req: AppChatroomThemeReq, user: LoginUserInfo
    ): BaseResult<Int?>? {
        return BaseResult.success(appChatroomService.updateTheme(req, user))
    }

    @DeleteMapping("/app/chatroom/{id}")
    fun updateTheme(
        @PathVariable("id") id: Int, user: LoginUserInfo
    ): BaseResult<Int?>? {
        return BaseResult.success(appChatroomService.deleteChatroom(id, user))
    }


    @PutMapping("/app/chatroom/history-visible")
    fun updatehistoryVisible(
        @RequestBody req: AppChatroomUpdateReq, user: LoginUserInfo
    ): BaseResult<Int?>? {
        return BaseResult.success(appChatroomService.updatehistoryVisible(req, user))
    }

//    @PutMapping("/theme")
//    fun updateTheme(
//        @RequestBody req: AppChatroomUpdateReq,
//        user: LoginUserInfo
//    ): BaseResult<Int?>? {
//        return BaseResult.success(appChatroomService.updateTheme(req, user))
//    }

    /** 标记精选消息 */
    @PostMapping("/app/chatroom/group-chat-record/featured")
    fun featureMessage(
        @Validated @RequestBody req: AppFeatureMessageReq, user: LoginUserInfo
    ): BaseResult<String> {
        appChatroomService.featureMessage(req, user)
        return BaseResult.success("操作成功")
    }

    /** 关闭消息提醒 */
    @PutMapping("/app/chatroom/member/notification-off")
    fun turnOffNotification(
        @RequestBody req: AppChatroomNotificationOffReq, user: LoginUserInfo
    ): BaseResult<String> {
        appChatroomService.turnOffNotification(req, user)
        return BaseResult.success("操作成功")
    }

    /** 查询群聊详情 */
    @GetMapping("/app/chatroom/{id}")
    fun getChatroomDetail(@PathVariable id: Int, userInfo: LoginUserInfo): BaseResult<AppChatroomDetailResp> {
        return BaseResult.success(appChatroomService.getChatroomDetail(id, userInfo))
    }

    /** 查询群聊详情 */
    @GetMapping("/app/chatroom")
    fun getChatroomDetailByCode(code: String, userInfo: LoginUserInfo): BaseResult<AppChatroomDetailResp> {
        return BaseResult.success(appChatroomService.getChatroomDetailByCode(code, userInfo))
    }

    /** 查询群成员列表 */
    @GetMapping("/app/chatroom/members")
    fun getChatroomMembers(
        req: ChatroomMembersPageReq,
    ): BaseResult<PageResult<AppChatroomMemberResp>> {
        return BaseResult.success(appChatroomService.getChatroomMembers(req))
    }

    /** 获取聊天列表 */
    @GetMapping("/app/chatroom/list")
    fun getChatroomList(
        req: ChatroomListPageReq, user: LoginUserInfo
    ): BaseResult<PageResult<AppChatroomListResp>> {
        return BaseResult.success(appChatroomService.getChatroomList(req, user))
    }

    /** 获取用户精选消息 */
    @GetMapping("/app/chatroom/feature-messages")
    fun getFeatureMessages(
        req: FeatureMessagesPageReq, user: LoginUserInfo
    ): BaseResult<PageResult<AppFeatureMessageResp>> {
        return BaseResult.success(appChatroomService.getFeatureMessages(req, user))
    }

    /** 查看所有入群申请 */
    @GetMapping("/app/chatroom/member/join-request")
    fun getChatroomJoinRequests(
        req: ChatroomJoinRequestPageReq, user: LoginUserInfo
    ): BaseResult<PageResult<AppChatroomJoinRequestResp>> {
        return BaseResult.success(appChatroomService.getChatroomJoinRequests(req, user))
    }

    @PostMapping("/app/chatroom/member")
    fun joinChatroom(
        @RequestBody @Validated req: JoinRoomReq, user: LoginUserInfo
    ): BaseResult<String> {
        appChatroomService.joinChatroom(req.roomId!!, user)
        return BaseResult.success("success")
    }

    /**
     * 获取用户一对一聊天室
     * 返回当前用户与聊天对象的聊天室信息
     */
    @GetMapping("/app/chatroom/user/chat")
    fun getUserChatroom(friendId: Long, user: LoginUserInfo): BaseResult<Int> {
        Assert.state(friendId != user.userId, "I can't chat with myself")
        //排个序
        val list = ArrayList<Long>().apply {
            add(user.userId!!)
            add(friendId)
        }
        list.sort()
        return BaseResult.success(appChatroomService.getUserChatroom(list[0], list[1], user))
    }

    @GetMapping("/app/group-chatroom-list")
    fun getChatroom(
        pageNo: Int?, pageSize: Int?, searchContent: String?, user: LoginUserInfo
    ): BaseResult<PageResult<ChatroomResp>> {
        return BaseResult.success(appChatroomService.searchChatroomList(pageNo, pageSize, searchContent, user))
    }

}
