package com.parsec.aika.bot.service.impl

import cn.hutool.json.JSONUtil
import com.parsec.aika.bot.config.AuthorSyncMqConst
import com.parsec.aika.bot.service.SyncAuthorService
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.em.AuthorType
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class SyncAuthorServiceImpl : SyncAuthorService {
    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    override fun syncAuthor(authorSyncBO: AuthorSyncBO) {
        authorSyncBO.type = AuthorType.BOT
        rabbitTemplate.convertAndSend(
            AuthorSyncMqConst.AUTHOR_SYNC_EXCHANGE,
            AuthorSyncMqConst.AUTHOR_SYNC_BOT_ROUTE_KEY,
            JSONUtil.toJsonStr(authorSyncBO)
        )
    }
}