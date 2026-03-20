package com.parsec.aika.bot.service

import com.parsec.aika.common.mapper.GameMapper
import com.parsec.aika.common.mapper.GameThreadMapper

import com.parsec.trantor.exception.core.BusinessException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.MethodOrderer
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestMethodOrder                                                                                                               
import org.junit.jupiter.api.assertThrows


import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
class GameServiceTest {

    @Resource
    private lateinit var gameService: GameService

    @Resource
    private lateinit var gameMapper: GameMapper

    @Resource
    private lateinit var gameThreadMapper: GameThreadMapper



    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_thread_int.sql")
    fun `test get next question when game in progress`() {
        // Given
        val threadId = 2L

        // When
        val result = gameService.getGameNextQuestion(threadId)

        // Then
        assertEquals(2, result.index)
        assertEquals("Q3112", result.question)
        assertFalse(result.bof)
        assertTrue(result.eof)

        gameService.getGameNextQuestion(threadId).let {
            assertEquals(2, it.index)
            assertEquals("Q3112", it.question)
            assertFalse(it.bof)
            assertTrue(it.eof)
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_thread_int.sql")
    fun `test get next question when game not started`() {
        // Given
        val threadId = 1L



        // When
        val result = gameService.getGameNextQuestion(threadId)

        // Then
        assertEquals(0, result.index)
        assertEquals("Q1", result.question)
        assertFalse(result.bof)
        assertFalse(result.eof)
    }



    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_thread_int.sql")
    fun `test get next question when thread not exists`() {
        // Given
        val threadId = 10000L


        // When & Then
        val exception = assertThrows<BusinessException> {
            gameService.getGameNextQuestion(threadId)
        }
        assertEquals("The game recorder does not exist.", exception.message)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_thread_int.sql")
    fun `test get next question when game not exists`() {
        // Given
        val threadId = 4L


        // When & Then
        val exception = assertThrows<BusinessException> {
            gameService.getGameNextQuestion(threadId)
        }
        assertEquals("The game does not exist.", exception.message)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_thread_int.sql")
    fun `test get next question when questions is empty`() {
        // Given
        val threadId = 5L



        // When & Then
        val exception = assertThrows<BusinessException> {
            gameService.getGameNextQuestion(threadId)
        }
        assertEquals("The Game questions are empty.", exception.message)
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_thread_int.sql")
    fun testCurrentQuestion() {
        // 第一个，测试当前问题为null，也就是从来没有开始过
        gameService.getCurrentGameQuestion(1).let {
            assertEquals(-1,it.index)
            assertFalse(it.eof)
            assertTrue(it.bof)
        }

        // 第二个，测试当前问题为0

        gameService.getCurrentGameQuestion(2).let {
            assertEquals(1,it.index)
            assertEquals("Q2",it.question)
            assertFalse(it.eof)
            assertFalse(it.bof)
        }

        assertThrows<BusinessException> {
            gameService.getCurrentGameQuestion(5)
        }.let {
            assertEquals("The Game questions are empty.", it.message)
        }

        assertThrows<BusinessException> {
            gameService.getCurrentGameQuestion(4)
        }.let {
            assertEquals("The game does not exist.", it.message)
        }

    }
}
