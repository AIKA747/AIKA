package com.parsec.aika.order.controller.app

import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.InitPayMentReq
import com.parsec.aika.order.service.FreedompayService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class FreedompayController {

    @Autowired
    private lateinit var freedompayService: FreedompayService

    @PostMapping("/app/payment/freedompay/init-payment")
    fun initPayment(@RequestBody req: InitPayMentReq, user: LoginUserInfo): BaseResult<Any> {
        return BaseResult.success(freedompayService.initPayment(req.orderNo!!, req.successUrl, req.failureUrl, user))
    }


    @PostMapping("/public/freedompay/result")
    fun payResult(@RequestBody result: String): String {
        StaticLog.info("收到freedompay回调：{}", result)
        freedompayService.webhook(result)
        return "ok"
    }


}