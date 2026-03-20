package com.parsec.aika.bot.service.impl

import com.parsec.aika.bot.model.vo.req.CreateGameResultReq
import com.parsec.aika.bot.model.vo.req.UpdateGameResultReq
import com.parsec.aika.bot.model.vo.resp.GameResultListRespDTO
import com.parsec.aika.bot.service.GameResultService
import com.parsec.aika.common.mapper.GameMapper
import com.parsec.aika.common.mapper.GameResultMapper
import com.parsec.aika.common.model.entity.GameResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@Service
class GameResultServiceImpl : GameResultService {

    @Resource
    private lateinit var gameResultMapper: GameResultMapper

    @Resource
    private lateinit var gameMapper: GameMapper

    override fun getGameResults(gameId: Long): List<GameResultListRespDTO> {
        return gameResultMapper.getGameResults(gameId)
    }

    @Transactional
    override fun createGameResult(req: CreateGameResultReq): Long {

        gameMapper.selectById(req.gameId) ?: throw BusinessException("The game is not exist")


        val gameResult =
            GameResult().apply {
                this.gameId = req.gameId
                this.summary = req.summary
                this.description = req.description
                this.cover = req.cover
            }
        gameResultMapper.insert(gameResult)
        return gameResult.id!!
    }

    @Transactional
    override fun updateGameResult(req: UpdateGameResultReq): Long {
        val gameResult = gameResultMapper.selectById(req.id) ?: throw RuntimeException("游戏结果不存在")

        gameResult.apply {
            this.gameId = req.gameId
            this.summary = req.summary
            this.description = req.description
            this.cover = req.cover
        }

        gameResultMapper.updateById(gameResult)
        return gameResult.id!!
    }

    @Transactional
    override fun deleteGameResult(id: Long) {
//        val gameResult = gameResultMapper.selectById(id) ?: throw RuntimeException("游戏结果不存在")
        gameResultMapper.deleteById(id)
    }

    override fun getGameResult(resultId: Long?): GameResult? {
        return gameResultMapper.selectById(resultId)
    }
}
