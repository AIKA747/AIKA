package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.ContentType
import java.time.LocalDateTime

/** 精选消息响应对象 */
data class AppFeatureMessageResp(
    /** 主键id */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null,

    /** 消息用户id */
    @JsonSerialize(using = ToStringSerializer::class)
    var uid: Long? = null,

    /** 来源类型：user，bot */
    var st: String? = null,

    /** 头像 */
    var avatar: String? = null,

    /** 用户昵称或机器人昵称 */
    var nn: String? = null,

    /** 文本内容 */
    var txt: String? = null,

    /** 多媒体（oss文件链接） */
    var med: String? = null,

    /** 时长，单位：秒 */
    @JsonSerialize(using = ToStringSerializer::class)
    var flength: Long? = null,

    /** 文件名称 */
    var fn: String? = null,

    /** 消息时间 */
    var time: LocalDateTime? = null,

    /**
     * 精选消息id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var mid: Long? = null,
    /**
     * 回复的消息内容
     */
    var rmessage: String? = null,

    var ct: ContentType? = null
)
