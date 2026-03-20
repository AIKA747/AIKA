package com.parsec.aika.content.service

import cn.hutool.log.StaticLog
import com.parsec.aika.content.ContentServiceApplicationTests
import org.junit.jupiter.api.Test
import jakarta.annotation.Resource

class StoryMessageServiceTest : ContentServiceApplicationTests() {

    @Resource
    private lateinit var storyMessageService: StoryMessageService

    @Test
    fun getUserChatMinutes() {
        val chatMinutes = storyMessageService.getUserChatMinutes(1761958285342195713, 1767726322883821570)
        StaticLog.info("chatMinutes:{}", chatMinutes)
    }
}