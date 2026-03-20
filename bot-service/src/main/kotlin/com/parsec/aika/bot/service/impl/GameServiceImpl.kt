package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.log.StaticLog
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.GameQuestion
import com.parsec.aika.bot.model.vo.resp.GameListVO
import com.parsec.aika.bot.model.vo.resp.MyGameVO
import com.parsec.aika.bot.service.GameMessageService
import com.parsec.aika.bot.service.GameService
import com.parsec.aika.common.mapper.GameMapper
import com.parsec.aika.common.mapper.GameThreadMapper
import com.parsec.aika.common.model.em.GameStatus
import com.parsec.aika.common.model.entity.Game
import com.parsec.aika.common.model.entity.GameThread
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@Service
class GameServiceImpl : GameService {

    @Resource
    private lateinit var gameMapper: GameMapper

    @Resource
    private lateinit var gameThreadMapper: GameThreadMapper

    @Resource
    private lateinit var gameMessageService: GameMessageService

    override fun getGameList(pageVo: PageVo): PageResult<GameListVO> {
        PageHelper.startPage<GameListVO>(pageVo.pageNo!!, pageVo.pageSize!!)
        return PageUtil<GameListVO>().page(gameMapper.getGameList())
    }

    @Transactional
    override fun createGameThread(gameId: Long, restart: Boolean?, loginUser: LoginUserInfo): Long {
        StaticLog.info("createGameThread gameId:{}  restart:{}", gameId, restart)
        if (restart != true) {
            //获取最后一次游戏记录
            val lastThread = gameThreadMapper.getLastThread(gameId, loginUser.userId!!.toLong())
            StaticLog.info(
                "createGameThread gameId:{} get uncompleted thread: {}", gameId, lastThread?.id
            )
            if (lastThread != null) {
                return lastThread.id!!
            }
        }
        StaticLog.info("createGameThread gameId:{}  开启新游戏记录", gameId)
        gameThreadMapper.deleteOldUncompletedThread(gameId, loginUser.userId!!.toLong())
        // 创建新的游戏记录
        val gameThread = GameThread().apply {
            this.gameId = gameId
            this.status = GameStatus.UNCOMPLETED
            this.creator = loginUser.userId!!.toLong()
            this.result = 0
        }
        gameThreadMapper.insert(gameThread)
        //主动发送一条游戏介绍消息给用户
        gameMessageService.sendGameMessageToUser(gameThread,loginUser)
        return gameThread.id!!
    }

    override fun getMyGameList(pageVo: PageVo, loginUser: LoginUserInfo): PageResult<MyGameVO> {
        PageHelper.startPage<MyGameVO>(pageVo.pageNo!!, pageVo.pageSize!!)
        return PageUtil<MyGameVO>().page(gameThreadMapper.getMyGameList(loginUser.userId!!.toLong()))
    }

    override fun getGameDetail(id: Long): Game {
        val game = gameMapper.selectById(id) ?: throw BusinessException("The game does not exist.")
        assert(game.enable != null)
        if (!game.enable!!) throw BusinessException("The game has been disabled.")
        return game
    }

    @Transactional
    override fun getGameNextQuestion(threadId: Long): GameQuestion {
        // 获取游戏线程
        val gameThread =
            gameThreadMapper.selectById(threadId) ?: throw BusinessException("The game recorder does not exist.")

        // 获取游戏
        val game = gameMapper.selectById(gameThread.gameId) ?: throw BusinessException("The game does not exist.")

        // 获取问题列表
        val questions = game.questions ?: throw BusinessException("The Game questions are empty.")

        // 获取当前问题索引
        val curQuestion = gameThread.curQuestion ?: -1

        // 计算下一个问题索引
        val nextIndex = curQuestion + 1

        // 检查是否结束
        if (nextIndex >= questions.size) {

            return GameQuestion(
                index = curQuestion, question = questions[curQuestion], eof = true, bof = false
            )
        }

        // 更新当前问题索引
        gameThread.curQuestion = nextIndex
        gameThreadMapper.updateById(gameThread)

        return GameQuestion(
            index = nextIndex, question = questions[nextIndex], eof = nextIndex == questions.size - 1, bof = false
        )
    }

    override fun getCurrentGameQuestion(threadId: Long): GameQuestion {
        // 获取游戏线程
        val gameThread =
            gameThreadMapper.selectById(threadId) ?: throw BusinessException("The game recorder does not exist.")

        // 获取游戏
        val game = gameMapper.selectById(gameThread.gameId) ?: throw BusinessException("The game does not exist.")

        // 获取问题列表
        val questions = game.questions ?: throw BusinessException("The Game questions are empty.")

        // 获取当前问题索引
        var curQuestion = gameThread.curQuestion ?: -1

        val gq = GameQuestion(
            index = curQuestion, question = null, eof = curQuestion == questions.size - 1, bof = curQuestion == -1
        )


        // 检查索引是否有效
        if (curQuestion >= 0) {
            curQuestion = if (curQuestion >= questions.size - 1) {
                questions.size - 1
            } else {
                curQuestion
            }

            gq.question = questions[curQuestion]
        }



        return gq
    }

    override fun getGameThread(threadId: Long): GameThread {
        return gameThreadMapper.selectById(threadId) ?: throw BusinessException("The game recorder does not exist.")
    }

    override fun updateGameThread(gameThread: GameThread) {
        Assert.notNull(gameThread.id, "The game recorder id does not exist.")
        gameThreadMapper.updateById(gameThread)
    }
}
