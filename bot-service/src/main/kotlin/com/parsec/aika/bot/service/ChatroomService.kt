package com.parsec.aika.bot.service

import com.baomidou.mybatisplus.extension.service.IService
import com.parsec.aika.bot.model.vo.req.ManageChatroomEditReq
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.entity.Chatroom
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult
import java.time.LocalDateTime

/**
 * @author 77923
 * @description 针对表【t_chatroom】的数据库操作Service
 * @createDate 2025-02-24 11:52:50
 */
interface ChatroomService : IService<Chatroom?> {
    /**
     * 查询用户未读消息数
     * lastReadTime 最后一次读取时间
     * chatroomId 聊天室id
     */
    fun chatroomUnreadNum(lastReadTime: LocalDateTime, chatroomId: Int): Int

    /**
     * 返回某个聊天室最新的一条消息
     */
    fun lastMessage(roomId: Int): ChatMessageBO?

    /**
     * 查询群聊列表
     */
    fun groupChatList(pageNo: Int, pageSize: Int, searchContent: String?): PageResult<Chatroom?>?

    /**
     * 创建群聊
     */
    fun createChatroom(req: ManageChatroomEditReq, userInfo: LoginUserInfo): Int

    /**
     * 更新群聊信息
     */
    fun updateChatroom(req: ManageChatroomEditReq, userInfo: LoginUserInfo): Boolean?

    /**
     * 刪除群聊
     */
    fun deleteChatroom(id: Int): Boolean?

}
