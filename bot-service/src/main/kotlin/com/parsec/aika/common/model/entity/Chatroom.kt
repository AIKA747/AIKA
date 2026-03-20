package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.handler.PermissionsTypeHandler
import com.parsec.aika.common.model.dto.PermissionVo
import com.parsec.aika.common.model.em.ChatroomGroupTypeEnum
import com.parsec.aika.common.model.em.CollectionType
import com.parsec.aika.common.model.em.UserTypeEnum
import java.time.LocalDateTime

/**
 *
 * @TableName t_chatroom
 */
@TableName(value = "t_chatroom", autoResultMap = true)
class Chatroom {
    /**
     * 主键id
     */
    @TableId(type = IdType.AUTO)
    var id: Int? = null

    /**
     *聊天室名称
     */
    var roomName: String? = null

    /**
     * 枚举CollectionType：    TALES,EXPERT,GAME,GROUP_CHAT
     */
    var roomType: CollectionType? = null

    /**
     * 群聊类型：PUBLIC、PRIVATE
     */
    var groupType: ChatroomGroupTypeEnum? = null

    /**
     * 群聊头像
     */
    var roomAvatar: String? = null

    /**
     * 用户成员上限
     */
    var memberLimit: Int? = null

    /**
     * 详情
     */
    var description: String? = null

    /**
     * 群聊标识，用于生成invitelink中的标识
     */
    var roomCode: String? = null

    /**
     * 新入群里人员是否可见历史消息
     */
    var historyMsgVisibility: Boolean? = null

    /**
     * 权限
     */
    @TableField(typeHandler = PermissionsTypeHandler::class)
    var permissions: List<PermissionVo>? = null

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
    @TableField(fill = FieldFill.INSERT)
    @Version
    var dataVersion: Int? = null

    /**
     * 是否删除：0否，1是
     */
    @TableLogic(delval = "1", value = "0")
    var deleted: Boolean? = null

    /**
     * 是否可以直接加入
     */
    var joinDirectly: Boolean? = null


    var creatorType: UserTypeEnum? = null

    var lastMessageTime: LocalDateTime? = null
}
