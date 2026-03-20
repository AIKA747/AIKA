package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.vo.PageVo

/**
 * 数字人配置 —— 指定语言的音色列表查询vo
 */
class ManageLanguageVoiceQueryVo : PageVo() {

    /**
     * 语言
     */
    var language: String? = null

    /**
     * 性别
     */
    var gender: Gender? = null

}