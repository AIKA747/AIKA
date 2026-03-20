package com.parsec.aika.common.model.dto

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog

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
            val jsonStr = JSONUtil.toJsonStr(MessageDTO(user, baseMessageDTO))
            StaticLog.info("MessageDTO.createMessage: $jsonStr")
            return jsonStr
        }
    }

}