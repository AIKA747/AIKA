package com.parsec.aika.content.service

import com.parsec.aika.common.model.dto.BaseMessageDTO

interface ChatService {
    fun respChatMsg(user: String, baseMessageDTO: BaseMessageDTO)
}