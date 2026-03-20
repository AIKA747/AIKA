package com.parsec.aika.bot.service

import com.baomidou.mybatisplus.extension.service.IService
import com.parsec.aika.bot.model.vo.req.ChatroomMsgLastTimeReq
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.entity.GroupChatRecords
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult
import java.time.LocalDateTime

/**
 * @author 77923
 * @description 针对表【t_group_chat_records】的数据库操作Service
 * @createDate 2025-02-24 11:54:11
 */
interface GroupChatRecordsService : IService<GroupChatRecords?> {
    /**
     * 保存群聊消息
     */
    fun saveChatRecord(roid: Int, records: GroupChatRecords): Long

    /**
     * 查询聊天记录
     */
    fun queryChatRecords(pageNo: Long, pageSize: Long, roomId: Int, user: LoginUserInfo): PageResult<ChatMessageBO>

    /**
     * 消息对象装换
     */
    fun convertChatMessage(record: GroupChatRecords): ChatMessageBO

    /**
     * 标记群聊消息已读
     */
    fun chatroomMsgLastTime(req: ChatroomMsgLastTimeReq, user: LoginUserInfo): Boolean

    /**
     * 聊天室未读消息数量
     */
    fun chatroomUnreadNum(time: LocalDateTime, roomId: Int): Int

    /**
     *获取最后一条消息内容
     */
    fun lastMessage(roomId: Int): ChatMessageBO?

    /**
     * 获取聊天室文件
     */
    fun getChatroomFiles(
        pageNo: Int, pageSize: Int, roomId: Int, fileName: String?, user: LoginUserInfo
    ): PageResult<GroupChatRecords?>

    /**
     * 查询聊天室消息
     */
    fun queryChatroomRecords(roomId: Int, limit: Int): List<ChatMessageBO>

    /**
     * 获取消息记录
     */
    fun getMessageRecord(messageId: String): GroupChatRecords?

    /**
     * 撤回消息
     */
    fun recallMessage(messageRecord: GroupChatRecords)

}
