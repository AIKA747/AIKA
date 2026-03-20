package com.parsec.aika.content.service.impl

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.SensitiveWordsMapper
import com.parsec.aika.common.model.entity.SensitiveWords
import com.parsec.aika.common.model.vo.req.ManageSensitiveWordsReq
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.service.SensitiveWordsService
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import jakarta.annotation.Resource

@Service
class SensitiveWordsServiceImpl : SensitiveWordsService {

    @Resource
    private lateinit var sensitiveWordsMapper: SensitiveWordsMapper
    override fun page(pageNo: Int, pageSize: Int, word: String?): PageResult<SensitiveWords>? {
        val page = Page<SensitiveWords>(pageNo.toLong(), pageSize.toLong())
        val result = sensitiveWordsMapper.selectPage(
            page,
            KtQueryWrapper(SensitiveWords::class.java).like(StrUtil.isNotBlank(word), SensitiveWords::word, word)
                .orderByDesc(SensitiveWords::id)
        )
        return PageUtil<SensitiveWords>().page(result)
    }

    override fun save(req: ManageSensitiveWordsReq): Int? {
        val count = sensitiveWordsMapper.selectCount(
            KtQueryWrapper(SensitiveWords::class.java).eq(SensitiveWords::word, req.word)
        )
        Assert.state(count == 0L, "Sensitive words already exist")
        val sensitiveWords = SensitiveWords().apply {
            this.word = req.word
        }
        sensitiveWordsMapper.insert(sensitiveWords)
        return sensitiveWords.id
    }

    override fun edit(req: ManageSensitiveWordsReq): Int? {
        val sensitiveWords = sensitiveWordsMapper.selectById(req.id) ?: throw Exception("Sensitive words not exist")
        val count = sensitiveWordsMapper.selectCount(
            KtQueryWrapper(SensitiveWords::class.java).eq(SensitiveWords::word, req.word)
                .ne(SensitiveWords::id, sensitiveWords.id)
        )
        Assert.state(count == 0L, "Sensitive words already exist")
        sensitiveWords.word = req.word
        return sensitiveWordsMapper.updateById(sensitiveWords)
    }

    override fun delete(id: Int?): Int? {
        return sensitiveWordsMapper.deleteById(id)
    }

    override fun batchSavaWords(words: List<String?>) {
        words.distinct().filterNotNull().filter(StrUtil::isNotBlank).filter {
            sensitiveWordsMapper.selectCount(
                KtQueryWrapper(SensitiveWords::class.java).eq(SensitiveWords::word, it)
            ) == 0L
        }.forEach {
            sensitiveWordsMapper.insert(SensitiveWords().apply {
                this.word = it
            })
        }
    }

    override fun check(text: String): Pair<Boolean?, List<String>?>? {
        val sensitiveWords = sensitiveWordsMapper.checkSensitiveWords(text)
        if (CollUtil.isEmpty(sensitiveWords)) {
            return null
        }
        return Pair(true, sensitiveWords)
    }


}