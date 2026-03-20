package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.model.vo.req.CreateGameResultReq
import com.parsec.aika.bot.model.vo.req.UpdateGameResultReq
import com.parsec.trantor.exception.core.BusinessException
import org.junit.jupiter.api.Assertions
import javax.annotation.Resource
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
class ManageGameResultControllerTest {

  @Resource private lateinit var manageGameResultController: ManageGameResultController

  @Test
  @Rollback
  @Transactional
  @Sql("/sql/game_init.sql")
  fun testGetGameResults() {
    val result = manageGameResultController.getGameResults(1)

    assertEquals(0, result.code)
    assertTrue(result.data.isNotEmpty())
    with(result.data[0]) {
      assertNotNull(id)
      assertEquals(1L, gameId)
      assertEquals("Test Summary 1",summary)
      assertNotNull(description)
      assertNotNull(cover)
    }
  }

  @Test
  @Rollback
  @Transactional
  @Sql("/sql/game_init.sql")
  fun testCreateGameResult() {
    val req =
            CreateGameResultReq().apply {
              gameId = 1
              summary = "Test Summary"
              description = "Test Description"
              cover = "test.jpg"
            }

    val result = manageGameResultController.createGameResult(req)

    assertEquals(0, result.code)
    assertNotNull(result.data["id"])
    assertTrue { result.data["id"] is String }
  }

  @Test
  @Rollback
  @Transactional
  @Sql("/sql/game_init.sql")
  fun testUpdateGameResult() {
    val req =
            UpdateGameResultReq().apply {
              id = 1
              gameId = 1
              summary = "Updated Summary"
              description = "Updated Description"
              cover = "updated.jpg"
            }

    val result = manageGameResultController.updateGameResult(req)

    assertEquals(0, result.code)
    assertEquals("1", result.data["id"])
  }

  @Test
  @Rollback
  @Transactional
  @Sql("/sql/game_init.sql")
  fun testDeleteGameResult() {
    val result = manageGameResultController.deleteGameResult(1)

    assertEquals(0, result.code)
    assertEquals("删除成功", result.data)
  }

  @Test
  @Rollback
  @Transactional
  @Sql("/sql/game_init.sql")
  fun testGetGameResultsForNonexistentGame() {
    val result = manageGameResultController.getGameResults(999)

    assertEquals(0, result.code)
    assertTrue(result.data.isEmpty()) // 应该返回空列表
  }

  @Test
  @Rollback
  @Transactional
  @Sql("/sql/game_init.sql")
  fun testCreateGameResultWithInvalidGameId() {
    val req = CreateGameResultReq().apply {
      gameId = 999 // 不存在的游戏ID
      summary = "Test Summary"
      description = "Test Description"
      cover = "test.jpg"
    }

    Assertions.assertThrows(BusinessException::class.java) {
      manageGameResultController.createGameResult(req)
    }
  }


}
