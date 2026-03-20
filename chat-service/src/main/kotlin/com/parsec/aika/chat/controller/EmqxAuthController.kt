package com.parsec.aika.chat.controller

import com.parsec.aika.chat.model.vo.req.EmqxAuthReq
import com.parsec.aika.chat.model.vo.req.EmqxConnReq
import com.parsec.aika.chat.model.vo.resp.EmqxResp
import com.parsec.aika.chat.service.EmqxAuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class EmqxAuthController {

    @Autowired
    private lateinit var emqxAuthService: EmqxAuthService

    @PostMapping("/emqx/conn/auth")
    fun connectAuth(@RequestBody req: EmqxConnReq): EmqxResp {
        return emqxAuthService.connectAuth(req.username!!, req.token!!)
    }

    @PostMapping("/emqx/topic/auth")
    fun topicAuth(@RequestBody req: EmqxAuthReq): EmqxResp {
        return emqxAuthService.topicAuth(req.username!!, req.topic!!, req.action!!)
    }


}