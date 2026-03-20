package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.GroupMemberRole
import com.parsec.aika.common.model.em.GroupMemberStatus
import java.time.LocalDateTime

/** 群聊成员响应对象 */
data class AppChatroomMemberResp(
        /** 主键id */
        var id: Int? = null,

        /** 创建时间 */
        var createdAt: LocalDateTime? = null,

        /** 创建人id */
        @JsonSerialize(using = ToStringSerializer::class)
        var creator: Long? = null,

        /** 更新时间 */
        var updatedAt: LocalDateTime? = null,

        /** 更新人 */
        @JsonSerialize(using = ToStringSerializer::class)
        var updater: Long? = null,

        /** 聊天室id */
        var roomId: Int? = null,

        /** 成员类型：USER、BOT */
        var memberType: AuthorType? = null,

        /** 成员角色：OWNER、ADMIN、MEMBER、MODERATOR */
        var memberRole: GroupMemberRole? = null,

        /** 成员id */
        @JsonSerialize(using = ToStringSerializer::class)
        var memberId: Long? = null,

        /** 成员头像 */
        var avatar: String? = null,

        /** 显示的名字 */
        var nickname: String? = null,

        /** 成员@的用户名 */
        var username: String? = null,

        /** 最近一次读取消息时间 */
        var lastReadTime: LocalDateTime? = null,

        /** 在线状态 */
        var onlineStatus: Boolean? = null,

        /**
         * FRIEND_INVITE(朋友邀请加入群聊，待用户审核),USER_JOIN_REQUEST（用户申请加入群里，待管理员审核）,APPROVE（已通过）
         */
        var status: GroupMemberStatus? = null
)
