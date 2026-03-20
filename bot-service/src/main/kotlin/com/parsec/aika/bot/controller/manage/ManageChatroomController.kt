package com.parsec.aika.bot.controller.manage

import cn.hutool.core.lang.Assert
import com.parsec.aika.bot.model.vo.req.AddMembersRequest
import com.parsec.aika.bot.model.vo.req.DeleteMembersRequest
import com.parsec.aika.bot.model.vo.req.ManageChatroomEditReq
import com.parsec.aika.bot.model.vo.req.SetMemberRoleRequest
import com.parsec.aika.bot.service.ChatroomMemberService
import com.parsec.aika.bot.service.ChatroomService
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.GroupMemberRole
import com.parsec.aika.common.model.em.GroupMemberStatus
import com.parsec.aika.common.model.entity.Chatroom
import com.parsec.aika.common.model.entity.ChatroomMember
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageChatroomController {

    @Resource
    private lateinit var chatroomService: ChatroomService

    @Resource
    private lateinit var chatroomMemberService: ChatroomMemberService

    @GetMapping("/manage/group-chatroom-list")
    fun groupChatList(
        pageNo: Int?, pageSize: Int?, searchContent: String?
    ): BaseResult<PageResult<Chatroom?>> {
        return BaseResult.success(chatroomService.groupChatList(pageNo ?: 1, pageSize ?: 10, searchContent))
    }

    @PostMapping("/manage/group-chatroom")
    fun createChatroom(
        @Validated @RequestBody req: ManageChatroomEditReq, userInfo: LoginUserInfo
    ): BaseResult<Int> {
        Assert.notNull(req.ownerId, "ownerId is required")
        return BaseResult.success(chatroomService.createChatroom(req, userInfo))
    }

    @PutMapping("/manage/group-chatroom")
    fun updateChatroom(
        @Validated @RequestBody req: ManageChatroomEditReq, userInfo: LoginUserInfo
    ): BaseResult<Boolean?> {
        Assert.notNull(req.id, "id is required")
        return BaseResult.success(chatroomService.updateChatroom(req, userInfo))
    }

    @DeleteMapping("/manage/group-chatroom/{id}")
    fun deleteChatroom(@PathVariable id: Int): BaseResult<Boolean> {
        return BaseResult.success(chatroomService.deleteChatroom(id))
    }

    /**
     * 设置成员角色
     */
    @PutMapping("/manage/chatroom/role")
    fun setMemberRole(@Validated @RequestBody request: SetMemberRoleRequest, user: LoginUserInfo): BaseResult<Void> {
        chatroomMemberService.setMemberRole(request.roomId.toInt(), request.role, request.memberIds, user)
        return BaseResult.success()
    }

    /**
     * 删除群成员
     */
    @DeleteMapping("/manage/chatroom/members")
    fun deleteMembers(@Validated @RequestBody request: DeleteMembersRequest, user: LoginUserInfo): BaseResult<Boolean> {
        return BaseResult.success(
            chatroomMemberService.adminDeleteMembers(
                request.roomId.toInt(), request.memberIds, user
            )
        )
    }

    /**
     * 添加群成员
     */
    @PostMapping("/manage/chatroom/members")
    fun addMembers(@Validated @RequestBody request: AddMembersRequest, user: LoginUserInfo): BaseResult<Void> {
        chatroomMemberService.addMembers(request.roomId.toInt(), request.members, user)
        return BaseResult.success()
    }

    @GetMapping("/manage/group-chatroom")
    fun chatroomDetail(id: Int): BaseResult<Chatroom?> {
        return BaseResult.success(chatroomService.getById(id))
    }

    @GetMapping("/manage/chatroom/members")
    fun getChatroomMembers(
        roomId: Int,
        pageNo: Int?,
        pageSize: Int?,
        name: String?,
        status: GroupMemberStatus?,
        memberRole: GroupMemberRole?,
        memberType: AuthorType?
    ): BaseResult<PageResult<ChatroomMember?>> {
        return BaseResult.success(
            chatroomMemberService.getChatroomMembers(
                roomId, pageNo ?: 1, pageSize ?: 10, name, status, memberRole, memberType
            )
        )
    }

}