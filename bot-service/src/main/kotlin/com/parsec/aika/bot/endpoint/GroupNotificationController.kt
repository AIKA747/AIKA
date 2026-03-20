package com.parsec.aika.bot.endpoint

import com.parsec.aika.bot.service.ChatroomMemberService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class GroupNotificationController {

    @Resource
    private lateinit var chatroomMemberService: ChatroomMemberService

    @GetMapping("/feign/group/notify/count")
    fun getChatroomMemberNotifycationCount(memberId: Long): Int {
        return chatroomMemberService.getChatroomMemberNotifycationCount(memberId)
    }

}