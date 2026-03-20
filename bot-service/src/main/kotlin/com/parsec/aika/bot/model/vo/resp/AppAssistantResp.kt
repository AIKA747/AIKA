package com.parsec.aika.bot.model.vo.resp

import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.entity.Assistant

class AppAssistantResp: Assistant() {

    /**
     * 用户设置的性别
     */
    var userSettingGender: Gender? = null

    /**
     * 男性助手打招呼视频
     */
    var maleGreetVideo: String? = null

    /**
     * 女性助手打招呼视频
     */
    var femaleGreetVideo: String? = null

    /**
     * 男性助手空闲视频
     */
    var maleIdleVideo: String? = null

    /**
     * 女性助手空闲视频
     */
    var femaleIdleVideo: String? = null

}