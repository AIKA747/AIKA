package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.*
import java.time.LocalDateTime

class AppChatRecordListVo {

    /**
     * 消息唯一标识
     */
    @JsonSerialize(using = ToStringSerializer::class)
    val msgId: Long? = null

    /**
     * 聊天机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    val objectId: Long? = null

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    val userId: Long? = null

    /**
     * 机器人回复的消息id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    val replyMessageId: Long? = null

    /**
     * TEXT，VOICE，IMAGE，VIDEO
     */
    val contentType: ContentType? = null

    /**
     * 语音文件属性
     */
    val fileProperty: String? = null

    /**
     * 多媒体（oss文件链接）
     */
    val media: String? = null

    /**
     * 已读标记：0未读，1已读
     */
    var readFlag: Boolean? = null

    /**
     * 读取消息时间
     */
    var readTime: LocalDateTime? = null

    /**
     * 来源类型：user，bot
     */
    val sourceType: SourceTypeEnum? = null

    /**
     * 文本内容
     */
    val textContent: String? = null

    /**
     * 消息状态：created, processing, success, fail
     */
    var msgStatus: MsgStatus? = null

    /**
     * 创建时间
     */
    val createdAt: LocalDateTime? = null

    /**
     * 若contentType='botRecommend'或'storyRecommend'或'gift'，则保存到该json字段
     */
    val json: String? = null

    val videoUrl: String? = null

    val videoStatus: VideoStatus? = null

    val digitHuman: Boolean? = null

    var badAnswer: Boolean? = null

    var regenerateNum: Int? = null

    var gameStatus: GameStatus? = null
}