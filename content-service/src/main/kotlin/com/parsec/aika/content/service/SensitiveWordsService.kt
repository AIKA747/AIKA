package com.parsec.aika.content.service

import com.parsec.aika.common.model.entity.SensitiveWords
import com.parsec.aika.common.model.vo.req.ManageSensitiveWordsReq
import com.parsec.trantor.common.response.PageResult

interface SensitiveWordsService {
    fun page(pageNo: Int, pageSize: Int, word: String?): PageResult<SensitiveWords>?
    fun save(req: ManageSensitiveWordsReq): Int?
    fun edit(req: ManageSensitiveWordsReq): Int?
    fun delete(id: Int?): Int?
    fun batchSavaWords(words: List<String?>)
    fun check(text: String): Pair<Boolean?, List<String>?>?

}
