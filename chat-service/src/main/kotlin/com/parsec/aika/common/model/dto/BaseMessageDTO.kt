package com.parsec.aika.common.model.dto

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
     * 是否为测试调试调试消息
     */
    var test: Boolean? = false

    var locale: String? = null
    var country: String? = null

    var username: String? = null

    /**
     * 聊天风格
     */
    var communicationStyle: String? = null

    fun response(msg: String): BaseMessageDTO {
        this.msgType = MsgType.RESP_MSG
        this.msgData = ResposeMessageBO().apply {
            this.msgId = clientMsgId
            this.code = -1
            this.msg = msg
        }
        return this
    }

    fun response(code: Int, msg: String): BaseMessageDTO {
        this.msgType = MsgType.RESP_MSG
        this.msgData = ResposeMessageBO().apply {
            this.msgId = clientMsgId
            this.code = code
            this.msg = msg
        }
        return this
    }

}