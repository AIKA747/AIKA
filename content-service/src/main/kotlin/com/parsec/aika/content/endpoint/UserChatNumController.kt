package com.parsec.aika.content.endpoint

import com.parsec.aika.content.service.StoryMessageService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
class UserChatNumController {

    @Autowired
    private lateinit var storyMessageService: StoryMessageService

    @GetMapping("/feign/chat/num")
    fun chatNum(userId: Long, minTime: LocalDateTime?, maxTime:  LocalDateTime?, storyId: Long?): BaseResult<Long> {
        return BaseResult.success(storyMessageService.chatNum(userId, minTime, maxTime, storyId))
    }
}