package com.parsec.aika.bot.controller.manage

import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.model.vo.req.ManageAuditionInfoVo
import com.parsec.aika.bot.model.vo.req.ManageLanguageVoiceQueryVo
import com.parsec.aika.bot.service.TtsService
import com.parsec.aika.bot.service.UploadType
import com.parsec.aika.common.mapper.VoiceMapper
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.Voice
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class ManageVoiceControllerTest {

    @Resource
    private lateinit var voiceController: ManageVoiceController

    @Resource
    private lateinit var voiceMapper: VoiceMapper

    @Resource
    private lateinit var ttsService: TtsService

    private var userInfo: LoginUserInfo = LoginUserInfo()

    @Test
    fun openaiTts() {
        val file = ttsService.tts("我会说中文，I can speak English", "alloy", UploadType.did)
        StaticLog.info("file:{}", file)
    }

    @BeforeEach
    fun setBefore() {
        userInfo = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
    }

    @Test
    @Rollback
    @Transactional
    fun getLanguageListTest() {
        var result = voiceController.getLanguageList(PageVo(), userInfo)
        // 由于语言配置有初始数据，则直接查询出来有数据
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        // 调用该接口查询数据需要去重，则查询出来的列表数据应是不重复的
        assertEquals(result.data.list.size, result.data.list.toSet().size)
        // 查询更多数据，也是去重了的
        result = voiceController.getLanguageList(PageVo().apply {
            this.pageNo = 1
            this.pageSize = 200
        }, userInfo)
        // 由于语言配置有初始数据，则直接查询出来有数据
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        // 调用该接口查询数据需要去重，则查询出来的列表数据应是不重复的
        assertEquals(result.data.list.size, result.data.list.toSet().size)
    }

    @Test
    @Rollback
    @Transactional
    fun getVoicesTest() {
        val queryVo = ManageLanguageVoiceQueryVo()
        // 未传入语言时，查询所有的音色列表
        var result = voiceController.getVoices(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        queryVo.language = "Afrikaans"
        // 查询传入语言对应的音色列表
        result = voiceController.getVoices(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        val list = voiceMapper.selectList(KtQueryWrapper(Voice::class.java).eq(Voice::language, queryVo.language))
        assertEquals(result.data.list.size, list.size)
    }

    @Test
    @Rollback
    @Transactional
    fun auditionTest() {
        val mockitoUrl = "https://baidu.com"

        Mockito.doReturn(mockitoUrl).`when`(ttsService).tts(Mockito.anyString(), Mockito.anyString())

        val result = voiceController.audition(ManageAuditionInfoVo().apply {
            this.voiceName = "af-ZA-AdriNeural2"
            this.text = "ces"
        }, userInfo)
        assertEquals(result.code, 0)
        assertEquals(result.data, mockitoUrl)
    }
}