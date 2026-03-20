package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.UserImageListReq
import com.parsec.aika.user.model.vo.req.UserImageReq
import com.parsec.aika.user.model.vo.resp.UserImageResp
import com.parsec.aika.user.service.UserImageService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
@RequestMapping("/app/user-image")
class UserImageController {

    @Resource
    private lateinit var userImageService: UserImageService

    @PostMapping
    fun saveUserImage(@RequestBody @Validated req: UserImageReq, loginUser: LoginUserInfo): BaseResult<Boolean> {
        return BaseResult.success(userImageService.saveUserImage(req, loginUser.userId!!))
    }

    @GetMapping
    fun getUserImages(req: UserImageListReq, loginUser: LoginUserInfo): BaseResult<PageResult<UserImageResp>> {
        return BaseResult.success(userImageService.getUserImages(req, loginUser.userId!!))
    }

    @DeleteMapping("/{id}")
    fun deleteUserImage(@PathVariable id: Long, loginUser: LoginUserInfo): BaseResult<Void> {
        userImageService.deleteUserImage(id, loginUser.userId!!)
        return BaseResult.success()
    }

    @PutMapping("/active")
    fun setActiveAvatar(@RequestBody @Validated req: Map<String, Long>, loginUser: LoginUserInfo): BaseResult<Void> {
        userImageService.setActiveAvatar(req["id"]!!, loginUser.userId!!)
        return BaseResult.success()
    }
} 
