package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.req.ManageLanguageVoiceQueryVo
import com.parsec.aika.bot.model.vo.resp.ManageLanguageVo
import com.parsec.aika.bot.model.vo.resp.ManageLanguageVoiceVo
import com.parsec.aika.common.model.entity.Voice
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface VoiceMapper: BaseMapper<Voice> {

    /**
     * 语言列表
     */
    @Select("""
        <script>
            select distinct language from tts_voice 
        </script>
    """)
    fun languageList(): List<ManageLanguageVo>

    /**
     * 指定语言的音色列表
     */
    @Select("""
        <script>
            select voiceName, gender from tts_voice 
            <where>
                <if test='req.language != null'>
                    and language = #{req.language}
                </if>
                <if test='req.gender != null'>
                    and gender = #{req.gender}
                </if>
            </where>
        </script>
    """)
    fun languageVoiceList(@Param("req") queryVo: ManageLanguageVoiceQueryVo): List<ManageLanguageVoiceVo>

}