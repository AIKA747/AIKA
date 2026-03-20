package com.parsec.aika.bot.service

import com.parsec.aika.common.model.dto.BaseMessageDTO

interface AssistantMessageService {
    fun handlerChatMsg(user: String, baseMessageDTO: BaseMessageDTO)
    fun handlerReadMsg(user: String, baseMessageDTO: BaseMessageDTO)
    fun handlerRespMsg(user: String?, baseMessageDTO: BaseMessageDTO)
    fun handlerMsgRegenerate(user: String, baseMessageDTO: BaseMessageDTO)
}