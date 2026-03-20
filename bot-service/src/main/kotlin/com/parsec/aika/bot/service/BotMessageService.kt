package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.AppChatQueryVo
import com.parsec.aika.bot.model.vo.req.AppChatRecordQueryVo
import com.parsec.aika.bot.model.vo.resp.AppChatListVo
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.entity.MessageRecord
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult
import java.time.LocalDateTime

interface BotMessageService {
    /**
     * 处理会话消息
     */
    fun handlerChatMsg(user: String, baseMessageDTO: BaseMessageDTO)

    /**
     * 消息已读标记
     */
    fun handlerReadMsg(user: String, baseMessageDTO: BaseMessageDTO)

    /**
     * app端会话列表
     */
    fun appChatList(queryVo: AppChatQueryVo, user: LoginUserInfo): PageResult<AppChatListVo>

    /**
     * 删除会话
     */
    fun deleteAppChatBotId(id: Long, user: LoginUserInfo)

    /**
     * app端查询当前用户与某机器人之间的聊天记录
     */
    fun appChatRecords(queryVo: AppChatRecordQueryVo, user: LoginUserInfo): PageResult<AppChatRecordListVo>

    /**
     * 删除消息
     */
    fun deleteChatMsg(msgId: Long, user: LoginUserInfo): List<String>?
    fun handlerRespMsg(user: String?, baseMessageDTO: BaseMessageDTO)

    /**
     * 查询用户指定日期的聊天次数
     */
    fun chatNum(userId: Long, minTime: String?, maxTime: String?, botId: Long?): Int

    /**
     * 重新生成消息
     */
    fun handlerMsgRegenerate(user: String, baseMessageDTO: BaseMessageDTO)

    /**
     *缓存聊天消息
     */
    fun cacheMessageRecord(messageRecord: MessageRecord)

}