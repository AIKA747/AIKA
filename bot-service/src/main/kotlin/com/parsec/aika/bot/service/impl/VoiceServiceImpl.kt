package com.parsec.aika.bot.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.ManageLanguageVoiceQueryVo
import com.parsec.aika.bot.model.vo.resp.ManageLanguageVo
import com.parsec.aika.bot.model.vo.resp.ManageLanguageVoiceVo
import com.parsec.aika.bot.service.VoiceService
import com.parsec.aika.common.mapper.OpenaiVoiceMapper
import com.parsec.aika.common.mapper.VoiceMapper
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.entity.OpenaiVoice
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class VoiceServiceImpl : VoiceService {

    @Resource
    private lateinit var voiceMapper: VoiceMapper

    @Resource
    private lateinit var openaiVoiceMapper: OpenaiVoiceMapper

    override fun manageLanguageList(pageVo: PageVo): PageResult<ManageLanguageVo> {
        PageHelper.startPage<ManageLanguageVo>(pageVo.pageNo!!, pageVo.pageSize!!)
        return PageUtil<ManageLanguageVo>().page(voiceMapper.languageList())
    }

    override fun manageLanguageVoiceList(queryVo: ManageLanguageVoiceQueryVo): PageResult<ManageLanguageVoiceVo> {
        PageHelper.startPage<ManageLanguageVoiceVo>(queryVo.pageNo!!, queryVo.pageSize!!)
        return PageUtil<ManageLanguageVoiceVo>().page(voiceMapper.languageVoiceList(queryVo))
    }

    override fun manageOpenaiVoiceList(gender: Gender?): List<ManageLanguageVoiceVo> {
        return openaiVoiceMapper.selectList(
            KtQueryWrapper(OpenaiVoice::class.java)
                .eq(null != gender, OpenaiVoice::gender, gender)
                .orderByAsc(OpenaiVoice::sortNo)
        ).map {
            ManageLanguageVoiceVo().apply {
                this.gender = it.gender
                this.voiceName = it.voiceName
            }
        }
    }

}