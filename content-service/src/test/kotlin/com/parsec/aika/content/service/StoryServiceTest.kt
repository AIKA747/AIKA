//package com.parsec.aika.content.service
//
//import cn.hutool.json.JSONUtil
//import cn.hutool.log.StaticLog
//import com.parsec.aika.common.model.em.ContentType
//import com.parsec.aika.common.model.em.GameStatus
//import com.parsec.aika.common.model.em.SourceTypeEnum
//import com.parsec.aika.common.model.entity.StoryChatLog
//import com.parsec.aika.content.ContentServiceApplicationTests
//import org.junit.jupiter.api.Test
//import org.springframework.beans.factory.annotation.Autowired
//import org.springframework.test.annotation.Rollback
//import org.springframework.test.context.jdbc.Sql
//import org.springframework.transaction.annotation.Transactional
//import java.time.LocalDateTime
//import kotlin.test.assertEquals
//
//class StoryServiceTest : ContentServiceApplicationTests() {
//
//    @Autowired
//    private lateinit var storyService: StoryService
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/init.sql")
//    fun updateScoreAndRecorder() {
//        var flag = 0
//        for (i in 0..100) {
//            val scoreAndRecorder = storyService.updateScoreAndRecorder(1, 10, 10, "test")
//            flag++
//            if (scoreAndRecorder.first == GameStatus.SUCCESS) {
//                break
//            }
//        }
//        StaticLog.info("flag:{}", flag)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/init.sql")
//    fun receiveGift() {
//        val receiveGift = storyService.receiveGift(1, 1)
//        StaticLog.info("receiveGift:{}", receiveGift)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/init.sql")
//    fun changeChapter() {
//        StaticLog.info("========================进入下一个章节:start=======================")
//        for (i in 0..100) {
//            val scoreAndRecorder = storyService.updateScoreAndRecorder(1, 5, 10, "test")
//            if (scoreAndRecorder.first == GameStatus.SUCCESS) {
//                break
//            }
//        }
//        val andRecorder = storyService.getStoryAndRecorder(1, 10, false)
//        assertEquals(andRecorder.second!!.status, GameStatus.SUCCESS)
//        StaticLog.info("========================进入上一个章节:start=======================")
//        //进入上一章节
//        for (i in 0..100) {
//            val scoreAndRecorder = storyService.updateScoreAndRecorder(1, 0, -5, "test")
//            if (scoreAndRecorder.first == GameStatus.FAIL) {
//                break
//            }
//        }
//        val andRecorder1 = storyService.getStoryAndRecorder(1, 10, false)
//        assertEquals(andRecorder1.second!!.status, GameStatus.SUCCESS)
//        StaticLog.info("========================故事失败:start=======================")
//        for (i in 0..100) {
//            val scoreAndRecorder = storyService.updateScoreAndRecorder(1, -5, -10, "test")
//            if (scoreAndRecorder.first == GameStatus.FAIL) {
//                break
//            }
//        }
//        val andRecorder2 = storyService.getStoryAndRecorder(1, 10, false)
//        assertEquals(andRecorder2.second!!.status, GameStatus.FAIL)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/init.sql")
//    fun changeChapter1() {
//        StaticLog.info("========================进入下一个章节:start=======================")
//        for (i in 0..100) {
//            val scoreAndRecorder = storyService.updateScoreAndRecorder(1, 10, 10, "test")
//            if (scoreAndRecorder.first == GameStatus.SUCCESS) {
//                break
//            }
//        }
//        val andRecorder = storyService.getStoryAndRecorder(1, 10, false)
//        assertEquals(andRecorder.second!!.status, GameStatus.SUCCESS)
//        StaticLog.info("========================故事通关:start=======================")
//        //进入上一章节
//        for (i in 0..100) {
//            val scoreAndRecorder = storyService.updateScoreAndRecorder(1, 10, 10, "test")
//            if (scoreAndRecorder.first == GameStatus.SUCCESS) {
//                break
//            }
//        }
//        val andRecorder1 = storyService.getStoryAndRecorder(1, 10, false)
//        assertEquals(andRecorder1.second!!.status, GameStatus.SUCCESS)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/story_record_init.sql")
//    fun replyToUser() {
//        try {
//            val andRecorder = storyService.getStoryAndRecorder(1, 1, false)
//            val storyRecorder = andRecorder.second!!
//            val messageDto = storyService.replyToUser(StoryChatLog().apply {
//                this.storyId = storyRecorder.storyId
//                this.chapterId = storyRecorder.chapterId
//                this.storyRecorderId = storyRecorder.id
//                this.sourceType = SourceTypeEnum.user
//                this.contentType = ContentType.TEXT
//                this.textContent = "您要加油哟"
//                this.media = ""
//                this.json = ""
//                this.creator = storyRecorder.creator
//                this.createdAt = LocalDateTime.now()
//                this.fileProperty = null
//            }, andRecorder.second!!)
//            StaticLog.info("messageDto:{}", JSONUtil.toJsonStr(messageDto))
//        } catch (e: Exception) {
//            StaticLog.info("在线上test时会出现调用openai timeout的异常，这里简短处理一下")
//            StaticLog.error(e)
//        }
//    }
//
//}