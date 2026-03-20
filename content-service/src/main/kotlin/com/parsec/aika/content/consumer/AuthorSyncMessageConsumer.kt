package com.parsec.aika.content.consumer

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.content.config.AuthorSyncMqConst
import com.parsec.aika.content.service.AuthorService
import jakarta.annotation.Resource
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component

@Component
class AuthorSyncMessageConsumer {

    @Resource
    private lateinit var authorService: AuthorService

    @RabbitHandler
    @RabbitListener(queues = [AuthorSyncMqConst.AUTHOR_SYNC_USER_QUEUE])
    fun authorSyncUserMsgReceiver(msg: String) {
        try {
            StaticLog.info("Received user author information sync message:{}", msg)
            val authorSyncBO = JSONUtil.toBean(msg, AuthorSyncBO::class.java)
            authorService.syncAuthorInfo(authorSyncBO)
        } catch (e: Exception) {
            StaticLog.error("用户作者信息同步消息处理失败:{}", e.message)
            e.printStackTrace()
        }

    }

    @RabbitHandler
    @RabbitListener(queues = [AuthorSyncMqConst.AUTHOR_SYNC_BOT_QUEUE])
    fun authorSyncBotMsgReceiver(msg: String) {
        try {
            StaticLog.info("收到机器人作者信息同步消息:{}", msg)
            val authorSyncBO = JSONUtil.toBean(msg, AuthorSyncBO::class.java)
            authorService.syncAuthorInfo(authorSyncBO)
        } catch (e: Exception) {
            StaticLog.error("机器人作者信息同步消息处理失败:{}", e.message)
            e.printStackTrace()
        }
    }


}
