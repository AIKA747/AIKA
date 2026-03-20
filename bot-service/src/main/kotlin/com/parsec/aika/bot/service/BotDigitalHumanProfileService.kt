package com.parsec.aika.bot.service

import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.ProfileType
import com.parsec.aika.common.model.entity.DigitalHumanProfile

interface BotDigitalHumanProfileService {

    /**
     * 数字人配置详情
     */
    fun manageDigitalHumanProfileDetail(profileType: ProfileType, objectId: Long, gender: Gender?): DigitalHumanProfile

    /**
     * 修改数字人配置
     */
    fun manageDigitalHumanProfileUpdate(profile: DigitalHumanProfile)

}