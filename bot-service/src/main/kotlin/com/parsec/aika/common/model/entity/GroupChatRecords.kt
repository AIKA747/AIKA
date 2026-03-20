package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.MsgStatus
import com.parsec.aika.common.model.em.SourceTypeEnum
import java.io.Serializable
import java.time.LocalDateTime

/**
 *
 * @TableName t_group_chat_records
 */
@TableName(value = "t_group_chat_records")
class GroupChatRecords : Serializable {
    /**
     * 主键id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    @TableId(type = IdType.ASSIGN_ID)
    var id: Long? = null

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var uid: Long? = null

    /**
     * 来源类型：user，bot
     */
    var st: SourceTypeEnum? = null

    /**
     * 消息类型：'TEXT','VOICE','IMAGE','VIDEO'
     */
    var ct: ContentType? = null

    /**
     * 头像
     */
    var avatar: String? = null

    /**
     * 用户昵称或机器人昵称
     */
    var nn: String? = null

    /**
     * 文本内容
     */
    var txt: String? = null

    /**
     * 多媒体（oss文件链接）
     */
    var med: String? = null

    /**
     * 引用的消息id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var rid: Long? = null

    /**
     * 引用的消息内容
     */
    var rmessage: String? = null

    /**
     * 时长，单位：秒
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var flength: Double? = null

    /**
     * 文件名称
     */
    var fn: String? = null

    /**
     * 创建时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    @TableField(fill = FieldFill.INSERT)
    var time: LocalDateTime? = null

    /**
     * 聊天室id
     */
    var roid: Int? = null

    @TableField(exist = false)
    var json: String? = null

    @TableField(exist = false)
    var roomName: String? = null

    @TableField(exist = false)
    var roomAvatar: String? = null

    @TableField(exist = false)
    var memberIds: String? = null

    @TableField(exist = false)
    var forwardInfo: String? = null

    @TableField(exist = false)
    var username: String? = null

    @TableField(exist = false)
    var status: MsgStatus? = MsgStatus.success

    @TableField(exist = false)
    var gender: Gender? = null

    var fileProp: String? = null

}