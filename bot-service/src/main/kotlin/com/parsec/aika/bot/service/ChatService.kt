package com.parsec.aika.bot.service

import cn.hutool.json.JSONObject
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.entity.*

interface ChatService {


    fun respChatMsg(user: String, baseMessageDTO: BaseMessageDTO)

    fun replyBotMessage(
        messageRecord: MessageRecord,
        user: String,
        baseMessageStr: String,
        messageRecords: List<MessageRecord>,
        regenerateMessageRecord: MessageRecord? = null
    )

    fun videoWeebhook(reqObj: JSONObject)

    fun imageWebhook(jsonObject: JSONObject)

    fun replyAssistantMsg(
        assistant: Assistant,
        prompt: String,
        messageRecord: AssistantMsgRecord,
        user: String,
        userAssistant: UserAssistant,
        baseMessageStr: String?,
        digitHuman: Boolean?,
        messageRecords: List<AssistantMsgRecord>
    )

    fun botSayHello(user: String, msg: MessageRecord)
    fun assistantSayHello(user: String, msg: AssistantMsgRecord)
    fun regenerateAssistantMsg(
        assistant: Assistant,
        prompt: String,
        messageRecord: AssistantMsgRecord,
        user: String,
        userAssistant: UserAssistant,
        baseMessageStr: String?,
        digitHuman: Boolean?,
        messageRecords: List<AssistantMsgRecord>
    )

    /**
     * 回复游戏聊天消息
     */
    fun replyGameMessage(messageRecord: GameMessageRecord, user: String, baseMessageDTO: BaseMessageDTO)

    /**
     * 创建响应消息
     */
    fun createChatMessageBO(messageRecord: GameMessageRecord): ChatMessageBO
}