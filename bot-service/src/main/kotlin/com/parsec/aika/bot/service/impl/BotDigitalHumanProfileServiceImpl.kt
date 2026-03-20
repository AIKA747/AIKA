package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.service.BotDigitalHumanProfileService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.DigitalHumanProfileMapper
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.ProfileType
import com.parsec.aika.common.model.em.SupportedModelEnum
import com.parsec.aika.common.model.entity.Bot
import com.parsec.aika.common.model.entity.DigitalHumanProfile
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class BotDigitalHumanProfileServiceImpl : BotDigitalHumanProfileService {

    @Resource
    private lateinit var botMapper: BotMapper

    @Resource
    private lateinit var digitalHumanProfileMapper: DigitalHumanProfileMapper

    override fun manageDigitalHumanProfileDetail(
        profileType: ProfileType, objectId: Long, gender: Gender?
    ): DigitalHumanProfile {
        if (profileType == ProfileType.bot) {
            this.botDetail(objectId)
        }

        val detail = digitalHumanProfileMapper.selectOne(
            KtQueryWrapper(DigitalHumanProfile::class.java)
                .eq(DigitalHumanProfile::profileType, profileType)
                .eq(null != gender, DigitalHumanProfile::gender, gender)
                .eq(DigitalHumanProfile::objectId, objectId)
                .last("limit 1")
        )
        Assert.notNull(detail, "The configuration information does not exist")
        return detail
    }

    override fun manageDigitalHumanProfileUpdate(
        profile: DigitalHumanProfile
    ) {
        if (profile.profileType == ProfileType.bot) {
            this.botDetail(profile.objectId!!)
        }
        if (null == profile.id) {
            digitalHumanProfileMapper.insert(profile)
        } else {
            digitalHumanProfileMapper.updateById(profile)
        }
    }

    private fun botDetail(botId: Long): Bot {
        val bot = botMapper.selectById(botId)
        Assert.notNull(bot, "The robot information does not exist")
        Assert.isFalse(
            bot.supportedModels == null || !bot.supportedModels!!.contains(SupportedModelEnum.DigitaHumanService.name),
            "The robot has not enabled digital human configuration information"
        )
        return bot
    }
}