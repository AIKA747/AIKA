package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.model.vo.req.PostAppUserCollectStoryReq
import com.parsec.aika.common.model.em.GameStatus
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource
import kotlin.test.assertEquals

@SpringBootTest
internal class AppCollectStoryControllerTest {

    @Resource
    private lateinit var appCollectStoryController: AppCollectStoryController

    val loginUserInfo = LoginUserInfo().apply {
        this.userId = 10
    }
    @Test
    @Rollback
    @Transactional
    @Sql("/sql/init.sql")
    fun testCollectFun() {
        // 收藏
        appCollectStoryController.postAppUserCollectStory(
            com.parsec.aika.common.model.vo.req.PostAppUserCollectStoryReq().apply { this.storyId = 1 }, loginUserInfo)

        // 收藏列表
        val last = appCollectStoryController.getAppUserCollectStory(PageVo(), loginUserInfo).data.list.last()
        assertEquals(100, last.rewardsScore)
        assertEquals(false, last.locked)
        assertEquals(Gender.FEMALE, last.gender)
        assertEquals("http://www.photo.com", last.image)
//        assertEquals("第二章", last.introduction)
//        assertEquals("http://www.photo.com", last.listCover)
//        assertEquals(0.3, last.storyProcess)
//        assertEquals(GameStatus.PLAYING, last.status)

        // 取消收藏
        appCollectStoryController.deleteAppUserCollectStoryId(1, loginUserInfo)
        assertEquals(0, appCollectStoryController.getAppUserCollectStory(PageVo(), loginUserInfo).data.total)
    }
}
