package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.model.vo.req.ManageAuditionInfoVo
import com.parsec.aika.bot.model.vo.req.ManageLanguageVoiceQueryVo
import com.parsec.aika.bot.model.vo.resp.ManageLanguageVo
import com.parsec.aika.bot.model.vo.resp.ManageLanguageVoiceVo
import com.parsec.aika.bot.service.TtsService
import com.parsec.aika.bot.service.VoiceService
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageVoiceController {

    @Resource
    private lateinit var voiceService: VoiceService

    @Resource
    private lateinit var ttsService: TtsService

    /**
     * 数字人配置 —— 语言列表
     */
    @GetMapping("/manage/tts/language")
    fun getLanguageList(pageVo: PageVo, userInfo: LoginUserInfo): BaseResult<PageResult<ManageLanguageVo>> {
        return BaseResult.success(voiceService.manageLanguageList(pageVo))
    }

    /**
     * 数字人配置 —— 指定语言的音色列表
     */
    @GetMapping("/manage/tts/language/voices")
    fun getVoices(
        queryVo: ManageLanguageVoiceQueryVo, userInfo: LoginUserInfo
    ): BaseResult<PageResult<ManageLanguageVoiceVo>> {
        return BaseResult.success(voiceService.manageLanguageVoiceList(queryVo))
    }

    /**
     * 数字人配置 —— 数字人声音试听
     * @param auditionInfo AuditionInfoVO 试听信息
     * @return BaseResult<String> 语言文件链接URL
     */
    @PostMapping("/manage/bot/digita-human/audition")
    fun audition(
        @Validated @RequestBody auditionInfo: ManageAuditionInfoVo, userInfo: LoginUserInfo
    ): BaseResult<String> {
        return BaseResult.success(ttsService.tts(auditionInfo.text!!, auditionInfo.voiceName))
    }


    /**
     * 数字人配置 —— openai的音色列表
     */
    @GetMapping("/manage/tts/voices")
    fun getOpenaiVoices(gender: Gender?, userInfo: LoginUserInfo): BaseResult<List<ManageLanguageVoiceVo>> {
        return BaseResult.success(voiceService.manageOpenaiVoiceList(gender))
    }

}