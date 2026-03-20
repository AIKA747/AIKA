package com.parsec.aika.user.consumer

import cn.hutool.core.collection.CollUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.ChatroomNotifyBO
import com.parsec.aika.user.config.NotificationMqConst
import com.parsec.aika.user.service.PushListService
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component
import javax.annotation.Resource

@Component
class ChatroomNotificationConsumer {

    @Resource
    private lateinit var pushListService: PushListService

    @RabbitHandler
    @RabbitListener(queues = [NotificationMqConst.CHATROOM_NOTIFY_QUEUE])
    fun notifyReceiver(msg: String) {
        try {
            StaticLog.info("ChatroomNotifyReceiver: {}", JSONUtil.toJsonStr(msg))
            val notifyBO = JSONUtil.toBean(msg, ChatroomNotifyBO::class.java)
            if (CollUtil.isNotEmpty(notifyBO.userIds)) {
                pushListService.pushChatroomNotify(
                    notifyBO.userIds!!, notifyBO.title ?: "Received a message", notifyBO.content, notifyBO.body
                )
            }
        } catch (e: Exception) {
            StaticLog.error("ChatroomNotifyReceiver error: {}", e.message)
        }
    }
}