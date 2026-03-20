package com.parsec.aika.bot.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.service.UserBotService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.MessageRecordMapper
import com.parsec.aika.common.model.entity.Bot
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class UserBotServiceImpl : UserBotService {

    @Resource
    private lateinit var botMapper: BotMapper

    @Resource
    private lateinit var messageRecordMapper: MessageRecordMapper

    override fun getUserCreatedBotNum(userId: Long): Int {
        // 根据用户id查询用户创建的机器人数量（直接查询bot表该用户机器人数据）
        return botMapper.selectCount(KtQueryWrapper(Bot::class.java).eq(Bot::creator, userId))
    }

    override fun getBotDialogues(botId: Long): Int {
        // 查询message_record表，根据userId进行去重
        return messageRecordMapper.botDialogues(botId)
    }
}