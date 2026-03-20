package com.parsec.aika.common.model.entity

import cn.hutool.json.JSONObject
import com.baomidou.mybatisplus.annotation.*
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.GroupMemberRole
import com.parsec.aika.common.model.em.GroupMemberStatus
import java.time.LocalDateTime

/**
 *
 * @TableName t_chatroom_member
 */
@TableName(value = "t_chatroom_member", autoResultMap = true)
class ChatroomMember {
    /**
     * 主键id
     */
    @TableId(type = IdType.AUTO)
    var id: Int? = null

    /**
     * 聊天室id
     */
    var roomId: Int? = null

    /**
     * 成员类型：USER、BOT
     */
    var memberType: AuthorType? = null

    /**
     * 成员id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var memberId: Long? = null

    /**
     * 成员头像
     */
    var avatar: String? = null

    /**
     * 显示的名字
     */
    var nickname: String? = null

    /**
     * 成员@的用户名
     */
    var username: String? = null

    /**
     * 性别：MALE, FEMALE, HIDE
     */
    var gender: Gender? = null

    /**
     * 成员角色：OWNER、ADMIN、MEMBER、MODERATOR
     */
    var memberRole: GroupMemberRole? = null

    /**
     * 通知关闭截止时间
     */
    var notifyTurnOffTime: LocalDateTime? = null

    var notifyTurnOff: String? = null

    /**
     * FRIEND_INVITE(朋友邀请加入群聊，待用户审核),USER_JOIN_REQUEST（用户申请加入群里，待管理员审核）,APPROVE（已通过）
     */
    var status: GroupMemberStatus? = null

    /**
     * 主题
     *
     * {"type":"主题类型：gallery、color","color":"颜色","gallery":"图片链接"}
     *
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var theme: JSONObject? = null

    /**
     * 最近一次读取消息时间，消息时间大于该时间的消息都是未读消息
     */
    var lastReadTime: LocalDateTime? = null

    /**
     * 最近一次加载消息时间，若群聊不展示历史消息则仅查询大于该时间的消息
     */
    var lastLoadTime: LocalDateTime? = null

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    /**
     * 创建人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null

    /**
     * 更新人
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var updater: Long? = null

    /**
     * 数据版本，每更新一次+1
     */
    @Version
    @TableField(fill = FieldFill.INSERT)
    var dataVersion: Int? = null

    /**
     * 是否删除：0否，1是
     */
    @TableLogic(delval = "1", value = "0")
    var deleted: Boolean? = null


    var clearTime: LocalDateTime? = null
}
