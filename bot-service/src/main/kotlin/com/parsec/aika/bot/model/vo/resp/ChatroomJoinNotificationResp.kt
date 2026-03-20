package com.parsec.aika.bot.model.vo.resp

import com.parsec.aika.common.model.em.GroupMemberStatus
import java.time.LocalDateTime

class ChatroomJoinNotificationResp {

    var id: String? = null

    var createdAt: LocalDateTime? = null

    var roomId: Int? = null

    var memberId: String? = null

    /**
     * FRIEND_INVITE(朋友邀请加入群聊，待用户审核),USER_JOIN_REQUEST（用户申请加入群里，待管理员审核）,APPROVE（已通过）
     */
    var status: GroupMemberStatus? = null

    var chatroomName: String? = null

    var chatroomAvatar: String? = null

    var creatorNickName: String? = null
}