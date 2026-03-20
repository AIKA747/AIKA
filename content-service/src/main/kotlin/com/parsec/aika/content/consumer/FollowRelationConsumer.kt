package com.parsec.aika.content.consumer

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.FollowRelationBO
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.content.config.FollowRelationMqConst
import com.parsec.aika.content.service.FollowRelationService
import jakarta.annotation.Resource
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component

@Component
class FollowRelationConsumer {

    @Resource
    private lateinit var followRelationService: FollowRelationService

    @RabbitHandler
    @RabbitListener(queues = [FollowRelationMqConst.FOLLOW_USER_RELATION_QUEUE])
    fun followRelationMsgReceiver(msg: String) {
        try {
            StaticLog.info("收到关注消息:{}", msg)
            val relationBO = JSONUtil.toBean(msg, FollowRelationBO::class.java)
            relationBO.type = AuthorType.USER
            followRelationService.followRelation(relationBO)
        } catch (e: Exception) {
            StaticLog.error("处理关注消息失败:{}", e.message)
            e.printStackTrace()
        }
    }

    @RabbitHandler
    @RabbitListener(queues = [FollowRelationMqConst.UNFOLLOW_USER_RELATION_QUEUE])
    fun unfollowRelationMsgReceiver(msg: String) {
        try {
            StaticLog.info("收到取消关注消息:{}", msg)
            val relationBO = JSONUtil.toBean(msg, FollowRelationBO::class.java)
            relationBO.type = AuthorType.USER
            followRelationService.unfollowRelation(relationBO)
        } catch (e: Exception) {
            StaticLog.error("处理取消关注消息失败:{}", e.message)
            e.printStackTrace()
        }
    }

    @RabbitHandler
    @RabbitListener(queues = [FollowRelationMqConst.FOLLOW_BOT_RELATION_QUEUE])
    fun followBotRelationMsgReceiver(msg: String) {
        try {
            StaticLog.info("收到关注机器人消息:{}", msg)
            val relationBO = JSONUtil.toBean(msg, FollowRelationBO::class.java)
            relationBO.type = AuthorType.BOT
            followRelationService.followRelation(relationBO)
        } catch (e: Exception) {
            StaticLog.error("处理关注机器人消息失败:{}", e.message)
            e.printStackTrace()
        }
    }

    @RabbitHandler
    @RabbitListener(queues = [FollowRelationMqConst.UNFOLLOW_BOT_RELATION_QUEUE])
    fun unfollowBotRelationMsgReceiver(msg: String) {
        try {
            StaticLog.info("收到取消关注机器人消息:{}", msg)
            val relationBO = JSONUtil.toBean(msg, FollowRelationBO::class.java)
            relationBO.type = AuthorType.BOT
            followRelationService.unfollowRelation(relationBO)
        } catch (e: Exception) {
            StaticLog.error("处理取消关注机器人消息失败:{}", e.message)
            e.printStackTrace()
        }
    }

}