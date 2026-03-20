package com.parsec.aika.common.model.dto

import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.bo.ResposeMessageBO
import com.parsec.aika.common.model.em.ChatModule
import com.parsec.aika.common.model.em.MsgType
import java.io.Serializable

class BaseMessageDTO : Serializable {
    /**
     * 模块：'assistant','bot','story'
     */
    var chatModule: ChatModule? = null

    /**
     * 消息类型
     */
    var msgType: MsgType? = null

    /**
     * 消息体
     */
    var msgData: Any? = null

    /**
     * 消息唯一标识
     */
    var clientMsgId: String? = null

    /**
     * 会话唯一标识，组装字段，拼接规则：userId-chatModule-botId
     */
    var sessionId: String? = null

    /**
     * 是否为测试调试消息
     */
    var test: Boolean = false

    var username: String? = null

    var locale: String? = "en"

    /**
     * 聊天风格
     */
    var communicationStyle: String? = null

    fun successResp(msgId: String?): BaseMessageDTO {
        this.msgType = MsgType.RESP_MSG
        this.msgData = ResposeMessageBO().apply {
            this.msgId = msgId ?: clientMsgId
            this.code = 0
            this.msg = "接收消息成功"
        }
        return this
    }

    fun chatMsgResp(data: ChatMessageBO): BaseMessageDTO {
        this.msgType = MsgType.CHAT_MSG
        this.msgData = data
        return this
    }

    fun failResp(msg: String?): BaseMessageDTO {
        this.msgType = MsgType.RESP_MSG
        this.msgData = ResposeMessageBO().apply {
            this.msgId = clientMsgId
            this.code = -1
            this.msg = msg
        }
        return this
    }

}