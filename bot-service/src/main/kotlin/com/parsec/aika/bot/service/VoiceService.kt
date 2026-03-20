package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.ManageLanguageVoiceQueryVo
import com.parsec.aika.bot.model.vo.resp.ManageLanguageVo
import com.parsec.aika.bot.model.vo.resp.ManageLanguageVoiceVo
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.PageResult

interface VoiceService {

    /**
     * 语言列表
     */
    fun manageLanguageList(pageVo: PageVo): PageResult<ManageLanguageVo>

    /**
     * 指定语言的音色列表
     */
    fun manageLanguageVoiceList(queryVo: ManageLanguageVoiceQueryVo): PageResult<ManageLanguageVoiceVo>

    fun manageOpenaiVoiceList(gender: Gender?): List<ManageLanguageVoiceVo>

}