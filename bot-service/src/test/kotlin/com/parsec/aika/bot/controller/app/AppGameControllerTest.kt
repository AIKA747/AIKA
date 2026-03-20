package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.CreateGameThreadReq
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.exception.core.BusinessException
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

@SpringBootTest
class AppGameControllerTest {

    @Resource
    private lateinit var appGameController: AppGameController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_init.sql")
    fun testGetGameList() {
        val result =
            appGameController.getGameList(
                PageVo().apply {
                    this.pageNo = 1
                    this.pageSize = 10
                }
            )

        assertEquals(0, result.code)
        assertTrue(result.data.total > 0)
        with(result.data.list[0]) {
            assertNotNull(id)
            assertNotNull(gameName)
            assertTrue(enable!!)
            assertEquals("lcd", listCoverDark)

        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_init.sql")
    fun testCreateGameThread() {
        val loginUser = LoginUserInfo().apply { this.userId = 1 }

        // 创建新游戏
        val threadId =
            appGameController.createGameThread(
                CreateGameThreadReq().apply { this.gameId = 1 },
                loginUser
            )
                .data

        assertNotNull(threadId)

        // 再次创建应返回相同ID
        val threadId2 =
            appGameController.createGameThread(
                CreateGameThreadReq().apply { this.gameId = 1 },
                loginUser
            )
                .data

        assertEquals(threadId, threadId2)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_init.sql")
    fun testGetMyGameList() {
        val loginUser = LoginUserInfo().apply { this.userId = 1 }

        val result =
            appGameController.getMyGameList(
                PageVo().apply {
                    this.pageNo = 1
                    this.pageSize = 10
                },
                loginUser
            )

        assertEquals(0, result.code)
        assertTrue(result.data.total > 0)
        with(result.data.list[0]) {
            assertNotNull(id)
            assertNotNull(gameId)
            assertNotNull(gameName)
            assertNotNull(listCoverDark)
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_init.sql")
    fun testGetGameDetail() {
        val result = appGameController.getGameDetail(1)

        assertEquals(0, result.code)
        with(result.data) {
            assertEquals(1, id)
            assertNotNull(gameName)
            assertTrue(enable!!)
            assertNotNull(listCoverDark)
            assertNotNull(coverDark)
            assertTrue { free == false }
        }
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_init.sql")
    fun testGameListOrdering() {
        val result = appGameController.getGameList(PageVo().apply {
            this.pageNo = 1
            this.pageSize = 10
        })

        assertEquals(0, result.code)
        assertTrue(result.data.total > 1)

        val gameList = result.data.list
        Assertions.assertEquals(1, gameList[0].id)
        Assertions.assertEquals(2, gameList[1].id)

    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_init.sql")
    fun testCreateNewGameThreadAfterCompletion() {
        val loginUser = LoginUserInfo().apply { this.userId = 1 }

        // 先获取已完成的游戏 ID
        val gameId: Long = 2 // 这个游戏的 `GameThread.status == COMPLETED`

        // 创建新的 `GameThread`
        val threadId = appGameController.createGameThread(
            CreateGameThreadReq().apply { this.gameId = gameId },
            loginUser
        ).data

        assertNotNull(threadId)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_init.sql")
    fun testMyGameListWithGameResultCover() {
        val loginUser = LoginUserInfo().apply { this.userId = 1 }

        val result = appGameController.getMyGameList(PageVo().apply {
            this.pageNo = 1
            this.pageSize = 10
        }, loginUser)

        assertEquals(0, result.code)
        assertTrue(result.data.total > 0)

        with(result.data.list.first { it.gameId?.toInt() == 2 }) {
            assertEquals("result2.jpg", cover) // 确保 `GameResult.cover` 作为封面
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/game_init.sql")
    fun testGetDisabledGameDetail() {

        // 插入一个禁用的游戏


        Assertions.assertThrows(BusinessException::class.java) {
            appGameController.getGameDetail(3)
        }
    }


}
