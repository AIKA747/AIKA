package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.AppChatRecordQueryVo
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.entity.GameMessageRecord
import com.parsec.aika.common.model.entity.GameThread
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

interface GameMessageService {
    /**
     * 处理聊天消息
     */
    fun handlerChatMsg(user: String, baseMessageDTO: BaseMessageDTO)

    /**
     * 标记消息已读
     */
    fun handlerReadMsg(user: String, baseMessageDTO: BaseMessageDTO)

    /**
     * 处理消息重新生成
     */
    fun handlerMsgRegenerate(user: String, baseMessageDTO: BaseMessageDTO)

    /**
     * 聊天记录查询
     */
    fun appChatRecords(queryVo: AppChatRecordQueryVo, user: LoginUserInfo): PageResult<AppChatRecordListVo>?

    /**
     * 查询游戏聊天记录，是否仅查询游戏问题相关记录
     */
    fun getThreadChatRecords(threadId: Long, userId: Long, onlyQuestion: Boolean): List<GameMessageRecord>

    /**
     * 主动推送游戏消息给用户
     */
    fun sendGameMessageToUser(gameThread: GameThread, loginUser: LoginUserInfo)
}