package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.parsec.aika.common.model.em.ContentType
import java.time.LocalDateTime

/**
 *
 * @TableName t_message_feature
 */
@TableName(value = "t_message_feature")
class MessageFeature {
    /**
     * 主键id
     */
    @TableId(type = IdType.AUTO)
    var id: Long? = null

    /**
     * 消息用户id
     */
    var uid: Long? = null

    /**
     * 来源类型：user，bot
     */
    var st: String? = null

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
     * 回复消息id
     */
    var rid: Long? = null

    /**
     * 回复的消息内容
     */
    var rmessage: String? = null

    /**
     * 时长，单位：秒
     */
    var flength: Long? = null

    /**
     * 文件名称
     */
    var fn: String? = null

    /**
     * 创建时间
     */
    var time: LocalDateTime? = null

    /**
     * 聊天室id
     */
    var roomId: String? = null

    /**
     * 精选用户id
     */
    var creator: Long? = null

    /**
     * 精选消息id
     */
    var mid: Long? = null

    /**
     *
     */
    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    /**
     *
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null


    var ct: ContentType? = null
}
