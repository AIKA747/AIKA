package com.parsec.aika.bot.consumer

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.config.SyncRelationMqConst
import com.parsec.aika.bot.service.BotSubscriptionService
import com.parsec.aika.common.model.bo.SyncRelationBO
import com.parsec.aika.common.model.em.ActionType
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component
import javax.annotation.Resource

@Component
class FollowerMessageConsumer {

    @Resource
    private lateinit var botSubscriptionService: BotSubscriptionService

    @RabbitListener(queues = [SyncRelationMqConst.BOT_RELATION_QUEUE])
    fun syncBotRelation(msg: String) {
        try {
            StaticLog.info("收到bot的关注消息:{}", msg)
            val relationBO = JSONUtil.toBean(msg, SyncRelationBO::class.java)
            when (relationBO.actionType) {
                ActionType.ADD -> {
                    botSubscriptionService.botSubscribedSyncInfo(
                        relationBO.followingId!!,
                        relationBO.userId!!,
                        relationBO.botImage
                    )
                }

                ActionType.DELETE -> {
                    botSubscriptionService.botUnsubscribedSyncInfo(relationBO.followingId!!, relationBO.userId!!)
                }

                else -> {
                    StaticLog.warn("收到bot的关注消息，暂不处理: {}", msg)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            StaticLog.error("处理bot的关注消息失败，异常信息：{}", e.message)
        }
    }


}