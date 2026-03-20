package com.parsec.aika.bot.service

import com.parsec.aika.common.model.entity.Dictionary

interface DictionaryService {

    /**
     * 查询对应字典类型的字典值
     */
    fun appDictionaryList(dicType: String?): List<Dictionary>
}