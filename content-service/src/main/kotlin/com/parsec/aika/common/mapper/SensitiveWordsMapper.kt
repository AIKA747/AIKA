package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.SensitiveWords
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface SensitiveWordsMapper : BaseMapper<SensitiveWords> {

    @Select("select word from t_sensitive_words where deleted=0 and #{text} like concat('%',word,'%')")
    fun checkSensitiveWords(@Param("text") text: String): List<String>
}