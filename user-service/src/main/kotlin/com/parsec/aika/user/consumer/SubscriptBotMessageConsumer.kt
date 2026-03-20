package com.parsec.aika.user.consumer

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import com.parsec.aika.user.config.RabbitmqConst.USER_SUBSCRIPT_BOT_COUNT_QUEUE
import com.parsec.aika.user.mapper.AppUserMapper
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

/**
 * 用户订阅机器人数量更新
 */
@Component
class SubscriptBotMessageConsumer {

    @Autowired
    private lateinit var appUserMapper: AppUserMapper

    @RabbitHandler
    @RabbitListener(queues = [USER_SUBSCRIPT_BOT_COUNT_QUEUE])
    fun userSubscriptBotCountReceiver(msg: String) {
        try {
            val param = JSONUtil.parseObj(msg)
            val user = appUserMapper.selectById(param.getLong("userId"))
            Assert.notNull(user, "用户【{}】数据为null", param.getLong("userId"))
            if (param.containsKey("count")) {
                user.subBotTotal = param.getInt("count")
                appUserMapper.updateById(user)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

}