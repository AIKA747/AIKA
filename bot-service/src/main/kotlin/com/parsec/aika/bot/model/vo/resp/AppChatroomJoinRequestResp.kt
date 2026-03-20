package com.parsec.aika.bot.model.vo.resp

import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.GroupMemberStatus
import java.time.LocalDateTime

/** 入群申请响应对象 */
data class AppChatroomJoinRequestResp(
        /** 主键id */
        var id: Int? = null,

        /** 创建时间 */
        var createdAt: LocalDateTime? = null,

        /** 聊天室id */
        var roomId: Int? = null,

        /** 成员类型：USER、BOT */
        var memberType: AuthorType? = null,

        /** 成员id */
        var memberId: Long? = null,

        /** 成员头像 */
        var avatar: String? = null,

        /** 显示的名字 */
        var nickname: String? = null,

        /** 成员@的用户名 */
        var username: String? = null,

        /** 状态 */
        var status: GroupMemberStatus? = null
)
