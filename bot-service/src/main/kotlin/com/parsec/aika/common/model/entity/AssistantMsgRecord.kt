package com.parsec.aika.common.model.entity

import cn.hutool.json.JSONObject
import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.*
import com.parsec.trantor.mybatisplus.base.BaseDomain
import java.time.LocalDateTime

@TableName("assistant_msg_record", autoResultMap = true)
class AssistantMsgRecord : BaseDomain() {

    /**
     * user、assistant
     */
    var sourceType: SourceTypeEnum? = null

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * 助手id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var assistantId: Long? = null

    /**
     * 助手性别
     */
    var assistantGender: Gender? = null

    /**
     * 记录类型：'TEXT','VOICE','IMAGE','VIDEO','botRecommend','storyRecommend'
     */
    var contentType: ContentType? = null

    /**
     *
     */
    var json: String? = null

    var media: String? = null

    /**
     * 推荐内容，type=text则为回复的消息，若为推荐则为对于的json对象
     */
    var textContent: String? = null

    /**
     * 消息状态：created, processing, success, fail
     */
    var msgStatus: MsgStatus? = null

    /**
     * 已读标记：0未读，1已读
     */
    var readFlag: Boolean? = null

    /**
     * 读取消息时间
     */
    var readTime: LocalDateTime? = null

    /**
     * 回复消息id
     */
    var replyMessageId: Long? = null

    /**
     * 创建人id
     */
    var creator: Long? = null

    /**
     * 创建人名称
     */
    var creatorName: String? = null

    var fileProperty: String? = null

    var digitHuman: Boolean? = null

    var videoUrl: String? = null

    var videoStatus: VideoStatus? = null

    var badAnswer: Boolean? = null

    var regenerateNum: Int? = null

    @TableField(exist = false)
    var formatAssistantMsg: JSONObject? = null
}