package com.parsec.aika.common.model.dto

import cn.hutool.extra.spring.SpringUtil
import com.fasterxml.jackson.databind.ObjectMapper

class MessageDTO(
    /**
     * 用户标识
     */
    var user: String,
    /**
     * 发送给用户的消息
     */
    var baseMessageDTO: BaseMessageDTO
) {

    companion object {

        fun createMessage(user: String, baseMessageDTO: BaseMessageDTO): String {
            val objectMapper = SpringUtil.getBean(ObjectMapper::class.java)
            return objectMapper.writeValueAsString(MessageDTO(user, baseMessageDTO))
        }
    }

}