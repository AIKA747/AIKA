package com.parsec.aika.content.controller.manage

import com.parsec.aika.content.ContentServiceApplicationTests
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import kotlin.test.assertEquals

class ManagePostControllerTest : ContentServiceApplicationTests() {

    @Autowired
    private lateinit var managePostController: ManagePostController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostPage() {
        val baseResult = managePostController.getPostPage(1, 5, null, null)
        assertEquals(baseResult.data?.total, 6)
        assertEquals(baseResult.data?.list?.size, 5)
        assertEquals(baseResult.data?.pages, 2)
        val baseResult1 = managePostController.getPostPage(1, 5, "1", null)
        assertEquals(baseResult1.data.total, 4)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostDetail() {
        val baseResult = managePostController.getPostDetail(1)
        assertEquals(baseResult.data?.id, 1)
        assertEquals(baseResult.data?.thread?.size, 1)
        assertEquals(baseResult.data?.thread?.get(0)?.title, "title1")
        assertEquals(baseResult.data?.thread?.get(0)?.images?.size, 2)
        assertEquals(baseResult.data?.thread?.get(0)?.images?.get(0), "url1")
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun postBlocked() {
        val baseResult = managePostController.postBlocked("1,2", true)
        assertEquals(baseResult.data, 2)
        val baseResult1 = managePostController.getPostDetail(1)
        assertEquals(baseResult1.data?.blocked, true)
        val baseResult2 = managePostController.postBlocked("1,2,3", false)
        assertEquals(baseResult2.data, 3)
        val baseResult3 = managePostController.getPostDetail(2)
        assertEquals(baseResult3.data?.blocked, false)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun deletePost() {
        val baseResult = managePostController.deletePost("1,2")
        assertEquals(baseResult.data, 2)
        val postPage = managePostController.getPostPage(1, 5, null, null)
        assertEquals(postPage.data.total, 4)
    }
}