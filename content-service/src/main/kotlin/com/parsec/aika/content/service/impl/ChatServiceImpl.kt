package com.parsec.aika.content.service.impl

import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.dto.MessageDTO
import com.parsec.aika.content.config.RabbitmqConst.CHAT_MSG_DIRECT_EXCHANGE
import com.parsec.aika.content.config.RabbitmqConst.CHAT_MSG_DOWN_ROUTE_KEY
import com.parsec.aika.content.service.ChatService
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ChatServiceImpl : ChatService {

    @Autowired
    private lateinit var rabbitTemplate: RabbitTemplate

    override fun respChatMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        rabbitTemplate.convertAndSend(
            CHAT_MSG_DIRECT_EXCHANGE, CHAT_MSG_DOWN_ROUTE_KEY, MessageDTO.createMessage(user, baseMessageDTO)
        )
    }
}