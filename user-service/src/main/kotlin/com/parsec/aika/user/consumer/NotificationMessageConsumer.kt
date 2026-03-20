package com.parsec.aika.user.consumer

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.NotifyBO
import com.parsec.aika.user.config.NotificationMqConst
import com.parsec.aika.user.service.NotificationService
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component
import javax.annotation.Resource

@Component
class NotificationMessageConsumer {

    @Resource
    private lateinit var notificationService: NotificationService

    @RabbitHandler
    @RabbitListener(queues = [NotificationMqConst.NOTIFY_QUEUE])
    fun notifyReceiver(msg: String) {
        try {
            StaticLog.info("notifyReceiver: {}", JSONUtil.toJsonStr(msg))
            val notifyBO = JSONUtil.toBean(msg, NotifyBO::class.java)
            notificationService.saveNotification(notifyBO)
        } catch (e: Exception) {
            StaticLog.error("notifyReceiver error: {}", e.message)
        }
    }


}