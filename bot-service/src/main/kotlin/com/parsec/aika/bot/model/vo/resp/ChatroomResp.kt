package com.parsec.aika.bot.model.vo.resp

import com.parsec.aika.common.model.em.ChatroomGroupTypeEnum
import com.parsec.aika.common.model.em.CollectionType
import com.parsec.aika.common.model.em.GroupMemberRole
import java.time.LocalDateTime

class ChatroomResp {

    var id: Int? = null

    var roomName: String? = null

    var roomAvatar: String? = null

    var description: String? = null

    var roomCode: String? = null

    var memberLimit: Int? = null

    var joined: Boolean? = null

    var memberRole: GroupMemberRole? = null

    /**
     * 枚举CollectionType：    TALES,EXPERT,GAME,GROUP_CHAT
     */
    var roomType: CollectionType? = null

    /**
     * 群聊类型：PUBLIC、PRIVATE
     */
    var groupType: ChatroomGroupTypeEnum? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null

    /**
     * 创建人id
     */
    var creator: Long? = null

    /**
     * 更新时间
     */
    var updatedAt: LocalDateTime? = null

    /**
     * 更新人
     */
    var updater: Long? = null

    /**
     * 未读数量
     */
    var unreadNum: Int? = null

    /**
     * 最后阅读时间
     */
    var lastReadTime: LocalDateTime? = null
}