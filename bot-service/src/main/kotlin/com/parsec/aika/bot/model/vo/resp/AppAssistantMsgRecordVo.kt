package com.parsec.aika.bot.model.vo.resp

import java.time.LocalDateTime

class AppAssistantMsgRecordVo {

    /**
     * user、assistant
     */
    var role: String? = null

    /**
     * 助手性别
     */
    var assistantGender: String? = null

    /**
     * 记录类型：text/botRecommend/storyRecommend
     */
    var type: String? = null

    /**
     * 推荐内容，type=text则为回复的消息，若为推荐则为对于的json对象
     */
    var content: String? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null

}