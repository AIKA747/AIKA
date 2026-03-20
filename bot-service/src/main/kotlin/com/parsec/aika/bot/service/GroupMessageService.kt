package com.parsec.aika.bot.service

import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.entity.GroupChatRecords

interface GroupMessageService {
    /**
     * 处理聊天消息
     */
    fun handlerChatMsg(user: String, baseMessageDTO: BaseMessageDTO)

    /**
     * 给群成员发送消息
     */
    fun sendChatMsgToGroupMember(roomId: Int, record: GroupChatRecords)

    /**
     * 处理@机器人消息
     */
    fun handlerAbotMsg(roomId: Int, memberIds: String, chatRecord: GroupChatRecords)

    /**
     * 处理撤回消息
     */
    fun handlerRecallMsg(user: String, baseMessageDTO: BaseMessageDTO)
}