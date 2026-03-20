package com.parsec.aika.bot.controller.app

import cn.hutool.log.StaticLog
import com.parsec.aika.bot.model.vo.req.AddMembersRequest
import com.parsec.aika.bot.model.vo.req.DeleteMembersRequest
import com.parsec.aika.bot.model.vo.req.GroupJoinRequest
import com.parsec.aika.bot.model.vo.req.SetMemberRoleRequest
import com.parsec.aika.bot.service.ChatroomMemberService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.AddGroupBotReq
import com.parsec.trantor.common.response.BaseResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class AppChatroomMemberController {

    @Resource
    private lateinit var chatroomMemberService: ChatroomMemberService

    /**
     * 设置成员角色
     */
    @PutMapping("/app/chatroom/role")
    fun setMemberRole(@Validated @RequestBody request: SetMemberRoleRequest, user: LoginUserInfo): BaseResult<Void> {
        chatroomMemberService.setMemberRole(request.roomId.toInt(), request.role, request.memberIds, user)
        return BaseResult.success()
    }

    /**
     * 删除群成员
     */
    @DeleteMapping("/app/chatroom/members")
    fun deleteMembers(@Validated @RequestBody request: DeleteMembersRequest, user: LoginUserInfo): BaseResult<Void> {
        chatroomMemberService.deleteMembers(request.roomId.toInt(), request.memberIds, user)
        return BaseResult.success()
    }

    /**
     * 添加群成员
     */
    @PostMapping("/app/chatroom/members")
    fun addMembers(@Validated @RequestBody request: AddMembersRequest, user: LoginUserInfo): BaseResult<Void> {
        chatroomMemberService.addMembers(request.roomId.toInt(), request.members, user)
        return BaseResult.success()
    }

    /**
     * 同意加入群聊
     */
    @PutMapping("/app/chatroom/approve")
    fun approveJoinRequest(@Validated @RequestBody request: GroupJoinRequest, user: LoginUserInfo): BaseResult<Void> {
        chatroomMemberService.approveJoinRequest(request.id, user)
        return BaseResult.success()
    }

    /**
     * 拒绝加入群聊
     */
    @PutMapping("/app/chatroom/reject")
    fun rejectJoinRequest(@Validated @RequestBody request: GroupJoinRequest, user: LoginUserInfo): BaseResult<Boolean> {
        return BaseResult.success(chatroomMemberService.rejectJoinRequest(request.id, user))
    }

    /**
     * 添加机器人到群聊
     */
    @PostMapping("/app/chatroom/bot-memeber")
    fun addBotToGroup(
        @RequestParam("roomId") roomId: Int, @RequestParam("botId") botId: Long, user: LoginUserInfo
    ): BaseResult<Boolean> {
        StaticLog.info("user[${user.nickname}] addBotToGroup: roomId: $roomId, botId: $botId")
        return BaseResult.success(chatroomMemberService.addBotMember(roomId, botId, user))
    }

    /**
     * 添加机器人到群聊
     */
    @PostMapping("/app/chatroom/{roomId}/bot-memeber")
    fun addGroupBot(
        @PathVariable roomId: Int, @Validated @RequestBody req: AddGroupBotReq, user: LoginUserInfo
    ): BaseResult<Boolean> {
        StaticLog.info("user[${user.nickname}] addGroupBot: roomId: $roomId, botId: ${req.botId}")
        return BaseResult.success(chatroomMemberService.addBotMember(roomId, req.botId!!, user))
    }

    /**
     * 添加机器人到群聊
     */
    @DeleteMapping("/app/chatroom/bot-memeber")
    fun deleteBotToGroup(
        @RequestParam("roomId") roomId: Int, @RequestParam("botId") botId: Long, user: LoginUserInfo
    ): BaseResult<Boolean> {
        return BaseResult.success(chatroomMemberService.deleteBotMember(roomId, botId, user))
    }

    /**
     * 通过邀请链接加入群聊
     */
    @PostMapping("/app/chatroom/{roomCode}")
    fun joinGroupByRoomCode(@PathVariable roomCode: String, user: LoginUserInfo): BaseResult<Int> {
        return BaseResult.success(chatroomMemberService.joinGroupByRoomCode(roomCode, user))
    }

    @DeleteMapping("/app/chat-session")
    fun deleteChatSession(@RequestBody ids: List<Int>, user: LoginUserInfo): BaseResult<Boolean?>? {
        return BaseResult.success(chatroomMemberService.deleteChatSession(ids, user))
    }
}
