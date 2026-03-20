package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.service.BotDigitalHumanProfileService
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.ProfileType
import com.parsec.aika.common.model.entity.DigitalHumanProfile
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageBotDigitalController {

    @Resource
    private lateinit var digitalHumanProfileService: BotDigitalHumanProfileService

    /**
     * 数字人配置查询
     */
    @GetMapping("/manage/digita-human-profile")
    fun digitalHumanProfileDetail(
        profileType: ProfileType, objectId: Long, gender: Gender?, loginUser: LoginUserInfo
    ): BaseResult<DigitalHumanProfile> {
        return BaseResult.success(digitalHumanProfileService.manageDigitalHumanProfileDetail(profileType, objectId,gender))
    }

    /**
     * 修改数字人配置
     */
    @PostMapping("/manage/digita-human-profile")
    fun updateDigitalHumanProfile(
        @RequestBody profile: DigitalHumanProfile, loginUser: LoginUserInfo
    ): BaseResult<Void> {
        digitalHumanProfileService.manageDigitalHumanProfileUpdate(profile)
        return BaseResult.success()
    }


}