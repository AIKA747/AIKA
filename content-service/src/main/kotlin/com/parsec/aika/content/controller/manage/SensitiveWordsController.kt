package com.parsec.aika.content.controller.manage

import cn.hutool.core.lang.Assert
import com.parsec.aika.common.model.entity.SensitiveWords
import com.parsec.aika.common.model.vo.req.ManageSensitiveWordsReq
import com.parsec.aika.content.service.SensitiveWordsService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class SensitiveWordsController {

    @Autowired
    private lateinit var sensitiveWordsService: SensitiveWordsService

    @GetMapping("/manage/sensitive-words")
    fun getSensitiveWordsPage(
        pageNo: Int?, pageSize: Int?, word: String?
    ): BaseResult<PageResult<SensitiveWords>> {
        return BaseResult.success(sensitiveWordsService.page(pageNo ?: 1, pageSize ?: 10, word))
    }

    @PostMapping("/manage/sensitive-word")
    fun insertWord(@RequestBody word: ManageSensitiveWordsReq): BaseResult<Int> {
        Assert.notBlank(word.word, "Word cannot be empty")
        return BaseResult.success(sensitiveWordsService.save(word))
    }

    @PutMapping("/manage/sensitive-word")
    fun editWord(@RequestBody word: ManageSensitiveWordsReq): BaseResult<Int> {
        Assert.notNull(word.id, "ID cannot be empty")
        Assert.notBlank(word.word, "Word cannot be empty")
        return BaseResult.success(sensitiveWordsService.edit(word))
    }

    @DeleteMapping("/manage/sensitive-word")
    fun deleteWord(@RequestBody word: ManageSensitiveWordsReq): BaseResult<Int> {
        Assert.notNull(word.id, "ID cannot be empty")
        return BaseResult.success(sensitiveWordsService.delete(word.id))
    }

    @PostMapping("/manage/sensitive-words")
    fun batchSavaWords(@RequestBody words: List<String?>): BaseResult<*> {
        Assert.notEmpty(words, "Words cannot be empty")
        sensitiveWordsService.batchSavaWords(words)
        return BaseResult.success()
    }

}