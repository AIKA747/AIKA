package com.parsec.aika.content.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.ChatroomNotifyBO
import com.parsec.aika.common.model.bo.NotifyBO
import com.parsec.aika.common.model.dto.BaseNotifyContent
import com.parsec.aika.content.config.NotificationMqConst
import com.parsec.aika.content.config.NotificationMqConst.CHATROOM_NOTIFY_ROUTE_KEY
import com.parsec.aika.content.config.NotificationMqConst.NOTIFY_EXCHANGE
import com.parsec.aika.content.service.NotificationService
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Service
import jakarta.annotation.Resource

@Service
class NotificationServiceImpl : NotificationService {
    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate
    override fun sendNotification(notifyBO: NotifyBO) {
        StaticLog.info("发送通知消息:{}", JSONUtil.toJsonStr(notifyBO))
        rabbitTemplate.convertAndSend(
            NOTIFY_EXCHANGE, NotificationMqConst.NOTIFY_ROUTE_KEY, JSONUtil.toJsonStr(notifyBO)
        )
    }

    override fun chatMessageNotify(
        userIds: List<Long>, title: String, content: String, notifyContent: BaseNotifyContent
    ) {
        this.notifyUser(ChatroomNotifyBO().apply {
            this.userIds = userIds
            this.title = title
            this.content = content
            this.body = notifyContent
        })
    }

    private fun notifyUser(chatroomNotifyBO: ChatroomNotifyBO) {
        Assert.notEmpty(chatroomNotifyBO.userIds, "notify user can not be null")
        Assert.notBlank(chatroomNotifyBO.content, "notify body can not be null")
        Assert.notNull(chatroomNotifyBO.body, "notify body can not be null")
        Assert.notNull(chatroomNotifyBO.body!!.type, "notify type can not be null")
        rabbitTemplate.convertAndSend(NOTIFY_EXCHANGE, CHATROOM_NOTIFY_ROUTE_KEY, JSONUtil.toJsonStr(chatroomNotifyBO))
    }
}