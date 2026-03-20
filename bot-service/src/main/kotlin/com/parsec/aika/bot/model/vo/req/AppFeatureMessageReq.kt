package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.em.ContentType
import org.jetbrains.annotations.NotNull
import java.time.LocalDateTime

/** 标记精选消息请求对象 */
class AppFeatureMessageReq {
    /** 消息用户id */
    @NotNull
    var uid: Long? = null

    /** 来源类型：user，bot */
    @NotNull
    var st: String? = null

    /** 头像 */
    var avatar: String? = null

    /** 用户昵称或机器人昵称 */
    @NotNull
    var nn: String? = null

    /** 文本内容 */
    var txt: String? = null

    /** 多媒体（oss文件链接） */
    var med: String? = null

    /** 时长，单位：秒 */
    var flength: String? = null

    /** 文件名称 */
    var fn: String? = null

    /** 消息时间 */
    var time: LocalDateTime? = null

    /** 聊天室id */
    var roomId: String? = null

    /** 回复id */
    var rid: Long? = null

    /**
     * 回复的消息内容
     */
    var rmessage: String? = null

    /** 消息id */
    @NotNull
    var mid: Long? = null

    @NotNull
    var ct: ContentType? = null
}
