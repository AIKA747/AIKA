package com.parsec.aika.bot.controller.manage

import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.model.vo.req.ManageEditGameReq
import com.parsec.aika.bot.model.vo.req.ManageGameEnableReq
import com.parsec.aika.bot.model.vo.req.ManageSaveGameReq
import com.parsec.aika.common.mapper.GameMapper
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.Game
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.exception.core.BusinessException
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

@SpringBootTest
@AutoConfigureMockMvc
class ManageGameControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var gameMapper: GameMapper

    private lateinit var loginUserInfo: LoginUserInfo

    @Resource
    private lateinit var manageGameController: ManageGameController

    @BeforeEach
    fun setUp() {
        loginUserInfo = LoginUserInfo().apply {
            userId = 1L
            username = "testUser"
            userType = UserTypeEnum.ADMINUSER
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_game_test.sql")
    fun saveGame() {
        val req = ManageSaveGameReq().apply {
            this.gameName = "test1"
            this.instructions = "test1"
            this.assistantName = "assistantName"
            this.tools = "tools"
            this.model = "gpt-4o-mini"
            this.assistantId = "111111"
            this.introduce = "introduce"
            this.description = "description"
            this.questions = listOf("question1", "question2")
            this.cover = "https://www.baidu.com/1.png"
            this.listCover = "https://www.baidu.com/2.png"
            this.avatar = "https://www.baidu.com/3.png"
            this.knowledge = listOf("https://www.baidu.com/1.doc", "https://www.baidu.com/2.doc")
            this.listDesc = "list description"
            this.listCoverDark = "https://www/list-cover-dark.png"
            this.coverDark = "https://www/cover-dark.png"
            this.free = true
        }
        //名称重复检查
        mockMvc.perform(
            post("/manage/game").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.msg").value("The game name already exists."))
        //保存成功
        req.gameName = "test3"
        mockMvc.perform(
            post("/manage/game").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0"))
        //保存参数检查
        val game = gameMapper.selectOne(KtQueryWrapper(Game::class.java).eq(Game::gameName, req.gameName))
        assertNotNull(game)
        assertEquals(req.gameName, game.gameName)
        assertEquals(game.enable, false)
        assertEquals(req.questions?.size, game.questions?.size)
        assertEquals(req.knowledge?.size, game.knowledge?.size)
        assertEquals(req.listCoverDark, game.listCoverDark)
        assertEquals(req.coverDark, game.coverDark)
        assertEquals(req.free, game.free)

    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_game_test.sql")
    fun editGame() {
        val req = ManageEditGameReq().apply {
            this.id = 1L
            this.gameName = "test2"
            this.instructions = "test2"
            this.orderNum = 1
            this.listCoverDark = "https://www/list-cover-dark.png"
            this.coverDark = "https://www/cover-dark.png"
            this.free = false
        }
        //名称重复检查
        mockMvc.perform(
            put("/manage/game").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.msg").value("The game name already exists."))
        //编辑成功
        req.gameName = "test3"
        mockMvc.perform(
            put("/manage/game").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0"))
        //保存参数检查
        val game = gameMapper.selectOne(KtQueryWrapper(Game::class.java).eq(Game::gameName, req.gameName))
        assertNotNull(game)
        assertEquals(req.gameName, game.gameName)
        assertEquals(req.instructions, game.instructions)
        assertEquals(req.orderNum, game.orderNum)
        assertEquals(req.listCoverDark, game.listCoverDark)
        assertEquals(req.coverDark, game.coverDark)
        assertEquals(req.free, game.free)
        //校验未修改的参数,原本值校验
        assertEquals(game.assistantName, "assistantName")
        assertEquals(game.enable, false)
        assertEquals(game.questions?.size, 2)
        assertEquals(game.knowledge?.size, 2)
    }


    @Test
    @Rollback
    @Transactional
    @Sql(scripts = ["classpath:sql/manage_game_test.sql"])
    fun deleteGame() {
        val id = 1L
        mockMvc.perform(
            delete("/manage/game/$id").header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0"))
        //是否成删除
        val game = gameMapper.selectById(id)
        assertNull(game)
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_game_test.sql")
    fun gameList() {
        mockMvc.perform(
            get("/manage/game").header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk)
            //状态校验
            .andExpect(jsonPath("$.code").value("0"))
            //总数校验，校验被软删除的数据不被查询出来
            .andExpect(jsonPath("$.data.total").value("2"))
            //数据校验，按orderNum倒序排序，第一条数据是  test2
            .andExpect(jsonPath("$.data.list[0].gameName").value("test2"))
            .andExpect(jsonPath("$.data.list[0].enable").value(true))
            .andExpect(jsonPath("$.data.list[0].free").value("false"))


    }


    @Test
    @Rollback
    @Transactional
    @Sql(scripts = ["classpath:sql/manage_game_test.sql"])
    fun gameDetail() {
        val id = 1L
        mockMvc.perform(
            get("/manage/game/$id").header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk)
            //状态校验
            .andExpect(jsonPath("$.code").value("0"))
            //校验游戏名称
            .andExpect(jsonPath("$.data.gameName").value("test1"))
            //list字段数据校验
            .andExpect(jsonPath("$.data.questions[0]").value("question1"))
            .andExpect(jsonPath("$.data.questions[1]").value("question2"))
            .andExpect(jsonPath("$.data.listCoverDark").value("lcd"))
            .andExpect(jsonPath("$.data.coverDark").value("coverDark"))
            .andExpect(jsonPath("$.data.free").value("true"))
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_game_test.sql")
    fun gameEnable() {
        val req = ManageGameEnableReq().apply {
            this.id = 1
            this.enable = true
        }
        //上线
        mockMvc.perform(
            put("/manage/game/enable").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0"))
        val game = gameMapper.selectById(req.id)
        assertNotNull(game)
        assertEquals(req.enable, game.enable)
        req.enable = false


        //Game未训练时不允许上线
        ManageGameEnableReq().apply {
            this.id = 2  // id=2的游戏assistantId为空
            this.enable = true
        }.let {
            mockMvc.perform(
                put("/manage/game/enable").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(it))
                    .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
            ).andExpect(status().isOk)
                .andExpect(jsonPath("$.msg").value("You must train this Game before release it to live."))
        }

        ManageGameEnableReq().apply {
            this.id = 2  // id=2的游戏assistantId为空
            this.enable = true
        }.let {
            Assertions.assertThrows(BusinessException::class.java) {
                manageGameController.gameEnable(it, loginUserInfo)
            }
        }


        //下线
        mockMvc.perform(
            put("/manage/game/enable").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0"))
        val game1 = gameMapper.selectById(req.id)
        assertNotNull(game1)
        assertEquals(req.enable, game1.enable)
    }

//    @Test
//    @Rollback
//    @Transactional
//    @Sql(scripts = ["classpath:sql/manage_game_test.sql"])
    fun gameTrain() {
        mockMvc.perform(
            put("/manage/game/train").param("gameId", "2")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0"))
        val game = gameMapper.selectById(2)
        assertNotNull(game.assistantId)
    }


}

   
