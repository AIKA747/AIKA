package com.parsec.aika.content.controller.manage

import com.parsec.aika.common.model.vo.req.ManageSensitiveWordsReq
import com.parsec.aika.content.ContentServiceApplicationTests
import org.junit.jupiter.api.Test
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource
import kotlin.test.assertEquals

class SensitiveWordsControllerTest : ContentServiceApplicationTests() {

    @Resource
    private lateinit var sensitiveWordsController: SensitiveWordsController

    @Test
    @Transactional
    @Rollback
    @Sql("/sql/sensitive_words.sql")
    fun page() {
        val baseResult = sensitiveWordsController.getSensitiveWordsPage(1, 10, null)
        assertEquals(baseResult.data?.total, 3)
        val baseResult1 = sensitiveWordsController.getSensitiveWordsPage(1, 10, "1")
        assertEquals(baseResult1.data?.total, 1)
    }

    @Test
    @Transactional
    @Rollback
    @Sql("/sql/sensitive_words.sql")
    fun save() {
        try {
            sensitiveWordsController.insertWord(ManageSensitiveWordsReq().apply {
                this.word = "test1"
            })
        } catch (e: IllegalStateException) {
            assertEquals(e.message, "Sensitive words already exist")
        }
        val baseResult1 = sensitiveWordsController.insertWord(ManageSensitiveWordsReq().apply {
            this.word = "test4"
        })
        assertEquals(baseResult1.code, 0)
    }

    @Test
    @Transactional
    @Rollback
    @Sql("/sql/sensitive_words.sql")
    fun edit() {
        try {
            sensitiveWordsController.editWord(ManageSensitiveWordsReq().apply {
                this.id = 1
                this.word = "test2"
            })
        } catch (e: IllegalStateException) {
            assertEquals(e.message, "Sensitive words already exist")
        }
        val baseResult1 = sensitiveWordsController.editWord(ManageSensitiveWordsReq().apply {
            this.id = 1
            this.word = "test4"
        })
        assertEquals(baseResult1.code, 0)
    }


    @Test
    @Transactional
    @Rollback
    @Sql("/sql/sensitive_words.sql")
    fun delete() {
        val baseResult = sensitiveWordsController.deleteWord(ManageSensitiveWordsReq().apply {
            this.id = 1
        })
        assertEquals(baseResult.code, 0)
    }

}