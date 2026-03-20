package com.parsec.aika.user.consumer

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.user.config.RabbitmqConst.USER_BOT_INFO_QUEUE
import com.parsec.aika.user.mapper.AppUserMapper
import com.parsec.aika.user.model.entity.Bot
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.time.LocalDateTime

/**
 * 用户创建机器人数量更新
 * 用户最后异常发布机器人数量更新
 */
@Component
class BotMessageConsumer {

    @Autowired
    private lateinit var appUserMapper: AppUserMapper

    @RabbitHandler
    @RabbitListener(queues = [USER_BOT_INFO_QUEUE])
    fun userBotCountReceiver(msg: String) {
        try {
            StaticLog.info("$USER_BOT_INFO_QUEUE receiver msg:{}", msg)
            val param = JSONUtil.parseObj(msg)
            val user = appUserMapper.selectById(param.getLong("userId"))
            Assert.notNull(user, "用户【{}】数据为null", param.getLong("userId"))
            var flag = false
            if (param.containsKey("count")) {
                user.botTotal = param.getInt("count")
                flag = true
            }
            if (param.containsKey("lastReleaseBotAt")) {
                user.lastReleaseBotAt = param.getLocalDateTime("lastReleaseBotAt", LocalDateTime.now())
                flag = true
            }
            if (param.containsKey("bots")) {
                user.bots = param.getBeanList("bots", Bot::class.java)
                flag = true
            }
            if (flag) {
                appUserMapper.updateById(user)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

}