package com.parsec.aika.bot.model.vo.resp

import com.parsec.aika.common.model.em.Gender

/**
 * 数字人配置 —— 指定语言的音色列表返回vo
 */
class ManageLanguageVoiceVo {

    /**
     * 说话人物
     */
    var voiceName: String? = null

    /**
     * 性别
     */
    var gender: Gender? = null

}