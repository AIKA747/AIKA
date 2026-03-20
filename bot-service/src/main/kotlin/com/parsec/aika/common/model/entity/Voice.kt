package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.parsec.aika.common.model.em.Gender

@TableName("tts_voice")
class Voice {

    var locale: String? = null

    /**
     * 语言
     */
    var language: String? = null

    var sounds: String? = null

    /**
     * 说话人物
     */
    var voiceName: String? = null

    /**
     * 性别
     */
    var gender: Gender? = null

}