package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.MsgStatus
import com.parsec.aika.common.model.em.SourceTypeEnum
import com.parsec.trantor.mybatisplus.base.BaseDomain
import java.time.LocalDateTime

@TableName("message_record", autoResultMap = true)
class MessageRecord : BaseDomain() {

    /**
     * 会话id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null


    /**
     * 会话id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * 机器人回复消息id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var replyMessageId: Long? = null

    /**
     * 来源类型：user，bot
     */
    var sourceType: SourceTypeEnum? = null

    /**
     * TEXT，VOICE，IMAGE，VIDEO
     */
    var contentType: ContentType? = null

    var fileProperty: String? = null

    /**
     * 多媒体（oss文件链接）
     */
    var media: String? = null

    /**
     * 已读标记：0未读，1已读
     */
    var readFlag: Boolean? = null

    /**
     * 读取消息时间
     */
    var readTime: LocalDateTime? = null

    /**
     * 文本内容
     */
    var textContent: String? = null

    /**
     * 对象信息
     */
    var json: String? = null

    /**
     * 消息状态：created, processing, success, fail
     */
    var msgStatus: MsgStatus? = null

    /**
     * 创建人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 创建人名称
     */
    var creatorName: String? = null

    /**
     * 更新人
     */
    var updater: String? = null

    @TableField(exist = false)
    var formatBotMsg: FormatBotMsg? = null

}

class FormatBotMsg {
    var answer: String? = null

    var generateImage: Boolean? = false

    var imagePrompt: String? = null

    var generateTask: Boolean? = false

    var taskType: BotTaskType? = null

    var taskName: String? = null

    var taskIntroduction: String? = null

    var message: String? = null

    var taskCron: String? = null

    var taskPrompt: String? = null

    var executeLimit: Int? = null

    var closeTask: Boolean? = null

}