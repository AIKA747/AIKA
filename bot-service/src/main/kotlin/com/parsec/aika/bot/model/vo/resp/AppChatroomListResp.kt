package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.em.CollectionType
import java.time.LocalDateTime

/** 聊天列表响应对象 */
data class AppChatroomListResp(
    /** 主键id */
    var id: Int? = null,

    /** 创建时间 */
    var createdAt: LocalDateTime? = null,

    /** 创建人id */
    @JsonSerialize(using = ToStringSerializer::class) var creator: Long? = null,

    /** 更新时间 */
    var updatedAt: LocalDateTime? = null,

    /** 更新人 */
    @JsonSerialize(using = ToStringSerializer::class) var updater: Long? = null,

    /** 聊天室名称 */
    var roomName: String? = null,

    /** 枚举CollectionType：TALES,EXPERT,GAME,GROUP_CHAT */
    var roomType: CollectionType? = null,

    /** 群聊类型：PUBLIC、PRIVATE */
    var groupType: String? = null,

    /** 群聊头像 */
    var roomAvatar: String? = null,

    /** 用户成员上限 */
    var memberLimit: Int? = null,

    /** 详情 */
    var description: String? = null,

    /** 群聊标识，用于生成invitelink中的标识 */
    var roomCode: String? = null,

    /** 未读消息数 */
    var unreadNum: Int? = 0,

    /** 最近一次读取消息时间 */
    var lastReadTime: LocalDateTime? = null,

//    /** 最后一条消息内容 */
//    var lastMessageContent: String? = null,
//
//    /** 最后一条消息时间 */
//    var lastMessageTime: LocalDateTime? = null,

    /**
     * 最近一次加载消息时间，若群聊不展示历史消息则仅查询大于该时间的消息
     */
    var lastLoadTime: LocalDateTime? = null,

    var lastMessage: ChatMessageBO? = null,

    var lastMessageTime: LocalDateTime? = null,

    var clearTime: LocalDateTime? = null

)
