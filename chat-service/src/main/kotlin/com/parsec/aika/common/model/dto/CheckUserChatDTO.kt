package com.parsec.aika.common.model.dto

import java.time.LocalDateTime

class CheckUserChatDTO {

    /**
     * 过期时间
     */
    var expiredDate: LocalDateTime? = null

    /**
     * 总的聊天次数
     */
    var totalChatNum: Int? = null

    /**
     * 机器人聊天次数
     */
    var botChatNum: Int? = null

    /**
     * 故事聊天次数
     */
    var storyChatNum: Int? = null

    /**
     * 可用聊天次数
     */
    var enableChatNum: Int? = null


}