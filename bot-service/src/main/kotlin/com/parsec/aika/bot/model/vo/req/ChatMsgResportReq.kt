package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.em.ChatModule
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

class ChatMsgResportReq {

    /**
     * assistant, bot, story
     */
    @NotNull
    var chatModule: ChatModule? = null

    /**
     * 内容反馈
     */
    @NotBlank
    var feedback: String? = null

    /**
     * 消息内容
     */
    @NotNull
    var msgContent: String? = null

    /**
     * 消息id
     */
    @NotNull
    var msgId: Long? = null


}