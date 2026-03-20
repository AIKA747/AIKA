package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.service.StoryMessageService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class AppChatLogController {

    @Autowired
    private lateinit var storyMessageService: StoryMessageService

    @GetMapping("/app/story/chat-record")
    fun chatLog(
        @Validated req: com.parsec.aika.common.model.vo.req.AppChatLogReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<com.parsec.aika.common.model.vo.resp.AppChatRecordListVo>> {
        return BaseResult.success(storyMessageService.queryChatLogs(req, loginUserInfo))
    }

}
