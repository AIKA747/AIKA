package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import com.parsec.aika.bot.config.NotificationMqConst.CHATROOM_NOTIFY_ROUTE_KEY
import com.parsec.aika.bot.config.NotificationMqConst.NOTIFY_EXCHANGE
import com.parsec.aika.bot.service.NotificationService
import com.parsec.aika.common.model.bo.ChatroomNotifyBO
import com.parsec.aika.common.model.dto.BaseNotifyContent
import com.parsec.aika.common.model.dto.ChatNotifyContent
import com.parsec.aika.common.model.em.ChatroomNotifyType
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class NotificationServiceImpl : NotificationService {

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    /**
     * 申请加入群里通知
     */
    override fun chatroomMemberNotify(userIds: List<Long>, content: String, roomId: Int, roomAvatar: String?) {
        val chatroomNotifyBO = ChatroomNotifyBO().apply {
            this.userIds = userIds
            this.content = content
            this.body = ChatNotifyContent().apply {
                this.id = roomId.toString()
                this.avatar = roomAvatar
                this.roomId = roomId
                this.type = ChatroomNotifyType.CHATROOM_JOIN
            }
        }
        this.notifyUser(chatroomNotifyBO)
    }

    override fun chatroomMessageNotify(userIds: List<Long>, content: String, avatar: String, roomId: Int) {
        val chatroomNotifyBO = ChatroomNotifyBO().apply {
            this.userIds = userIds
            this.content = content
            this.body = ChatNotifyContent().apply {
                this.id = roomId.toString()
                this.avatar = avatar
                this.roomId = roomId
                this.type = ChatroomNotifyType.CHATROOM
            }
        }
        this.notifyUser(chatroomNotifyBO)
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