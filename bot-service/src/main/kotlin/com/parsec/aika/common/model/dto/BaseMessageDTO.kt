package com.parsec.aika.common.model.dto

import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.bo.ImageMessageBO
import com.parsec.aika.common.model.bo.ResposeMessageBO
import com.parsec.aika.common.model.em.ChatModule
import com.parsec.aika.common.model.em.MsgType
import java.io.Serializable

class BaseMessageDTO : Serializable {
    /**
     * 模块：'assistant','bot','story',game
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
     * 会话唯一标识，组装字段，拼接规则：userId-chatModule-objectId
     */
    var sessionId: String? = null

    /**
     * 是否为测试调试消息
     */
    var test: Boolean = false

    var username: String? = null

    var avatar: String? = null

    /**
     * 用户昵称
     */
    var nickname: String? = null

    var locale: String? = null

    /**
     * 聊天风格
     */
    var communicationStyle: String? = null

    fun imageResp(data: ImageMessageBO): BaseMessageDTO {
        this.msgType = MsgType.IMAGE_RESP
        this.msgData = data
        return this
    }

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

    fun failResp(msg: String?, msgId: String?): BaseMessageDTO {
        this.msgType = MsgType.RESP_MSG
        this.msgData = ResposeMessageBO().apply {
            this.msgId = msgId ?: clientMsgId
            this.code = -1
            this.msg = msg
        }
        return this
    }

    fun deepCopy(): BaseMessageDTO {
        return BaseMessageDTO().apply {
            this.chatModule = this@BaseMessageDTO.chatModule
            this.msgType = this@BaseMessageDTO.msgType
            this.msgData = this@BaseMessageDTO.msgData
            this.clientMsgId = this@BaseMessageDTO.clientMsgId
            this.sessionId = this@BaseMessageDTO.sessionId
            this.test = this@BaseMessageDTO.test
            this.username = this@BaseMessageDTO.username
            this.locale = this@BaseMessageDTO.locale
        }
    }

}