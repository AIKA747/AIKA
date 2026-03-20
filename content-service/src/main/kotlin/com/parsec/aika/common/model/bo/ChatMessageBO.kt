package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.dto.ChapterProcess
import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.MsgStatus
import com.parsec.aika.common.model.em.SourceTypeEnum
import com.parsec.aika.common.model.em.UserTypeEnum
import java.io.Serializable
import java.time.LocalDateTime

class ChatMessageBO : Serializable {
    /**
     * 对象id
     */
    var objectId: String? = null

    /**
     * 用户id
     */
    var userId: String? = null

    /**
     * 用户类型
     */
    var userType: UserTypeEnum? = null

    /**
     * 内容类型
     */
    var contentType: ContentType? = null

    /**
     * 内容，若为文件类型，此处就是文件链接
     */
    var json: String? = null

    /**
     * 多媒体（oss文件链接）
     */
    var media: String? = null

    /**
     * 文本内容
     */
    var textContent: String? = null

    /**
     * 消息id
     */
    var msgId: String? = null

    /**
     * 当前chatModule=story时，服务端发送给客户端的消息中，该字段不为空）章节状态：Fail\Playing\Success ，表示 ：章节失败、章节进行中、章节通关
     */
    var chapterStatus: String? = null

    /**
     * 是否为数字人
     */
    var digitHuman: Boolean = false

    var fileProperty: String? = null

    var chapterProcess: ChapterProcess? = null

    var msgStatus: MsgStatus? = null

    var replyMessageId: String? = null

    var createdAt: LocalDateTime? = null

    var sourceType: SourceTypeEnum? = null
}