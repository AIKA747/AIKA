package com.parsec.aika.bot.service

import com.parsec.aika.common.model.dto.BaseNotifyContent

interface NotificationService {

    /**
     * 加入群聊通知
     * type:
     *  JOIN_REQUEST：加入群聊申请，通知群主
     *  JOIN_INVITE：邀请加入群聊，通知被邀请者
     */
    fun chatroomMemberNotify(userIds: List<Long>, content: String, roomId: Int, roomAvatar: String?)

    /**
     * 群聊通知
     */
    fun chatroomMessageNotify(userIds: List<Long>, content: String, avatar: String, roomId: Int)


    fun chatMessageNotify(userIds: List<Long>, title: String, content: String, notifyContent: BaseNotifyContent)

}