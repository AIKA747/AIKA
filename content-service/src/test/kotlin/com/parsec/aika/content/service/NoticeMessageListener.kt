package com.parsec.aika.content.service

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.PostMessageBO
import com.parsec.aika.common.model.bo.SyncRelationBO
import com.parsec.aika.content.config.NoticeMessageMqConst
import com.parsec.aika.content.config.SyncRelationMqConst
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component

@Component
class NoticeMessageListener {

    val receivedUserMessages = mutableListOf<PostMessageBO>()
    val receivedBotMessages = mutableListOf<PostMessageBO>()
    val receivedUserRelationMessages = mutableListOf<SyncRelationBO>()
    val receivedBotRelationMessages = mutableListOf<SyncRelationBO>()

    @RabbitListener(queues = [NoticeMessageMqConst.USER_NOTICE_MESSAGE_QUEUE])
    fun listenUser(message: String) {
        StaticLog.info("收到用户通知消息：{}", message)
        val postMessageBO = JSONUtil.toBean(message, PostMessageBO::class.java)
        receivedUserMessages.add(postMessageBO)
    }

    @RabbitListener(queues = [NoticeMessageMqConst.BOT_NOTICE_MESSAGE_QUEUE])
    fun listenBot(message: String) {
        StaticLog.info("收到机器人通知消息：{}", message)
        val postMessageBO = JSONUtil.toBean(message, PostMessageBO::class.java)
        receivedBotMessages.add(postMessageBO)
    }

    @RabbitListener(queues = [SyncRelationMqConst.USER_RELATION_QUEUE])
    fun listenUserRelation(message: String) {
        StaticLog.info("收到关注用户同步消息：{}", message)
        val messageBO = JSONUtil.toBean(message, SyncRelationBO::class.java)
        receivedUserRelationMessages.add(messageBO)
    }

    @RabbitListener(queues = [SyncRelationMqConst.BOT_RELATION_QUEUE])
    fun listenBotRelation(message: String) {
        StaticLog.info("收到关注机器人同步消息：{}", message)
        val messageBO = JSONUtil.toBean(message, SyncRelationBO::class.java)
        receivedBotRelationMessages.add(messageBO)
    }

    fun clearReceivedMessages() {
        receivedUserMessages.clear()
        receivedBotMessages.clear()
        receivedUserRelationMessages.clear()
        receivedBotRelationMessages.clear()
    }
}