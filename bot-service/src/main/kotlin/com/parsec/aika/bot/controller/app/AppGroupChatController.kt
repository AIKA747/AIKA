package com.parsec.aika.bot.controller.app

import cn.hutool.core.lang.Assert
import com.parsec.aika.bot.model.vo.req.ChatroomMsgLastTimeReq
import com.parsec.aika.bot.model.vo.resp.ChatroomJoinNotificationResp
import com.parsec.aika.bot.service.ChatroomMemberService
import com.parsec.aika.bot.service.GroupChatRecordsService
import com.parsec.aika.bot.service.MessageFeatureService
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.entity.GroupChatRecords
import com.parsec.aika.common.model.entity.MessageFeature
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class AppGroupChatController {

    @Resource
    private lateinit var groupChatRecordsService: GroupChatRecordsService

    @Resource
    private lateinit var chatroomMemberService: ChatroomMemberService

    @Resource
    private lateinit var messageFeatureService: MessageFeatureService

    /**
     * 获取群聊记录
     */
    @GetMapping("/app/chatroom/group-chat-records")
    fun getChatRecords(
        pageNo: Long?, pageSize: Long?, @RequestParam(required = true) roomId: Int, user: LoginUserInfo
    ): BaseResult<PageResult<ChatMessageBO>> {
        val pageResult = groupChatRecordsService.queryChatRecords(pageNo ?: 1, pageSize ?: 10, roomId, user)
        return BaseResult.success(pageResult)
    }

    /**
     * 群聊信息读取完毕接口
     */
    @PutMapping("/app/chatroom/member/last-time")
    fun chatroomMsgLastTime(@RequestBody req: ChatroomMsgLastTimeReq, user: LoginUserInfo): BaseResult<*> {
        return BaseResult.success(groupChatRecordsService.chatroomMsgLastTime(req, user))
    }


    /**
     * 获取群聊文件
     */
    @GetMapping("/app/chatroom/group-chat-files")
    fun getChatroomFiles(
        @RequestParam(required = false, defaultValue = "1") pageNo: Int?,
        @RequestParam(required = false, defaultValue = "10") pageSize: Int?,
        @RequestParam(required = true) roomId: Int,
        fn: String?,
        user: LoginUserInfo
    ): BaseResult<PageResult<GroupChatRecords?>> {
        val pageResult = groupChatRecordsService.getChatroomFiles(pageNo ?: 1, pageSize ?: 10, roomId, fn, user)
        return BaseResult.success(pageResult)
    }

    /**
     * 查看入群邀请列表
     */
    @GetMapping("/app/chatroom/member/notification")
    fun getChatroomMemberNotifycation(
        @RequestParam(required = false, defaultValue = "1") pageNo: Int?,
        @RequestParam(required = false, defaultValue = "10") pageSize: Int?,
        name: String?,
        user: LoginUserInfo
    ): BaseResult<PageResult<ChatroomJoinNotificationResp?>> {
        val pageResult = chatroomMemberService.getChatroomMemberNotifycation(pageNo ?: 1, pageSize ?: 10,name, user)
        return BaseResult.success(pageResult)
    }

    /**
     * 批量移除精选消息
     */
    @DeleteMapping("/app/chatroom/group-chat-record/featured")
    fun batchRmFeaturedMsg(@RequestBody ids: List<Long>, user: LoginUserInfo): BaseResult<*> {
        Assert.notEmpty(ids, "ids can not empty")
        return BaseResult.success(
            messageFeatureService.ktUpdate().eq(MessageFeature::creator, user.userId).`in`(MessageFeature::id, ids)
                .remove()
        )
    }

}