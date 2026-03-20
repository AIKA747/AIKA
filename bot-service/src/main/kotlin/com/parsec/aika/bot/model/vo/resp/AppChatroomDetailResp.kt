package com.parsec.aika.bot.model.vo.resp

import cn.hutool.json.JSONObject
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.dto.PermissionVo
import com.parsec.aika.common.model.em.ChatroomGroupTypeEnum
import com.parsec.aika.common.model.em.CollectionType
import com.parsec.aika.common.model.em.GroupMemberRole
import com.parsec.aika.common.model.em.GroupMemberStatus
import java.time.LocalDateTime

/** 群聊详情响应对象 */
data class AppChatroomDetailResp(
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

    /** 聊天室名称 */
    var roomName: String? = null,

    /** 枚举CollectionType：TALES,EXPERT,GAME,GROUP_CHAT */
    var roomType: CollectionType? = null,

    /** 群聊类型：PUBLIC、PRIVATE */
    var groupType: ChatroomGroupTypeEnum? = null,

    /** 群聊头像 */
    var roomAvatar: String? = null,

    /** 用户成员上限 */
    var memberLimit: Int? = null,

    /** 详情 */
    var description: String? = null,

    /** 群聊标识，用于生成invitelink中的标识 */
    var roomCode: String? = null,

    /** 新入群里人员是否可见历史消息 */
    var historyMsgVisibility: Boolean? = null,

    /** 权限 */
    var permissions: List<PermissionVo>? = null,

    /** 主题 */
    var theme: JSONObject? = null,

    var status: GroupMemberStatus? = null,

    var inviteId: Int? = null,

    var memberRole: GroupMemberRole? = null,

    /**
     * 通知关闭截止时间
     */
    var notifyTurnOffTime: LocalDateTime? = null,

    var notifyTurnOff: String? = null
)
