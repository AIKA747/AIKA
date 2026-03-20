package com.parsec.aika.user.controller

import com.parsec.aika.user.model.vo.req.AppEmailVerifyReq
import com.parsec.aika.user.model.vo.req.VerifyNewEmailReq
import com.parsec.aika.user.service.GoogleDelService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class GoogleDelController {
    @Autowired
    private lateinit var googleDelService: GoogleDelService

    @PostMapping("/public/delete/user/data/submit")
    fun googleDelUser(@RequestBody @Validated req: VerifyNewEmailReq): BaseResult<Void> {
        googleDelService.googleDelUser(req.email!!)
        return BaseResult.success()
    }

    @DeleteMapping("/public/delete/user/data")
    fun googleDelUserData(@RequestBody @Validated req: AppEmailVerifyReq): BaseResult<Void> {
        googleDelService.googleDelUserData(req.clientCode!!, req.verifyCode!!)
        return BaseResult.success()
    }


}