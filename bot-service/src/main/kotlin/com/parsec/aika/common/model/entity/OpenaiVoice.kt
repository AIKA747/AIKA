package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.parsec.aika.common.model.em.Gender

@TableName("tts_openai_voice")
class OpenaiVoice {

    /**
     * 说话人物
     */
    var voiceName: String? = null

    /**
     * 性别
     */
    var gender: Gender? = null

    /**
     * 排序
     */
    var sortNo: Int? = null

}