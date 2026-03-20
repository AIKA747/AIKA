package com.parsec.aika.bot.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.service.DictionaryService
import com.parsec.aika.common.mapper.DictionaryMapper
import com.parsec.aika.common.model.entity.Dictionary
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class DictionaryServiceImpl : DictionaryService {

    @Resource
    private lateinit var dictionaryMapper: DictionaryMapper

    override fun appDictionaryList(dicType: String?): List<Dictionary> {
        val list = dictionaryMapper.selectList(
            KtQueryWrapper(Dictionary::class.java).eq(
                dicType != null,
                Dictionary::dicType,
                dicType
            ).orderByAsc(Dictionary::sortNo)
        )
        list.forEach {
            it.dicLab = it.dicValue
        }
        return list
    }
}