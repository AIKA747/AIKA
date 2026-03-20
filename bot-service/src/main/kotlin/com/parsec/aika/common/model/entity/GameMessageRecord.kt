package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.GameStatus
import com.parsec.aika.common.model.em.MsgStatus
import com.parsec.aika.common.model.em.SourceTypeEnum
import com.parsec.trantor.mybatisplus.base.BaseDomain
import java.time.LocalDateTime

@TableName("game_message_record", autoResultMap = true)
class GameMessageRecord : BaseDomain() {

    /**
     * 游戏线程id
     */
    var threadId: Long? = null

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * 回复消息id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var replyMessageId: Long? = null

    /**
     * 来源类型：user，game
     */
    var sourceType: SourceTypeEnum? = null

    /**
     * TEXT，VOICE，IMAGE，VIDEO,md
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
     * json格式
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

    var gameQuestion: Boolean? = null

    var gameStatus: GameStatus? = null

}