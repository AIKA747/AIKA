package com.parsec.aika.content.controller.manage

import com.parsec.aika.content.ContentServiceApplicationTests
import org.junit.jupiter.api.Test
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource
import kotlin.test.assertEquals

class ManangeBlockedAuthorControllerTest : ContentServiceApplicationTests() {

    @Resource
    private lateinit var manangeBlockedAuthorController: ManangeBlockedAuthorController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostBlockedList.sql")
    fun blockedAuthors() {
        val result = manangeBlockedAuthorController.blockedAuthors(1, 10, null)
        assertEquals(1, result.data?.total)
        assertEquals(1874022463235452932, result.data?.list?.get(0)?.userId)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostBlockedList.sql")
    fun unblockedAuthor() {
        val result = manangeBlockedAuthorController.unblockedAuthor(1874022463235452932)
        assertEquals(1, result.data)
        val result1 = manangeBlockedAuthorController.blockedAuthors(1, 10, null)
        assertEquals(0, result1.data?.total)

    }

}