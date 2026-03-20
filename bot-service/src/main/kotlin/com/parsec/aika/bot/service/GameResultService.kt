package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.CreateGameResultReq
import com.parsec.aika.bot.model.vo.req.UpdateGameResultReq
import com.parsec.aika.bot.model.vo.resp.GameResultListRespDTO
import com.parsec.aika.common.model.entity.GameResult

interface GameResultService {

    /** 获取游戏结果列表 */
    fun getGameResults(gameId: Long): List<GameResultListRespDTO>

    /** 创建游戏结果 */
    fun createGameResult(req: CreateGameResultReq): Long

    /** 更新游戏结果 */
    fun updateGameResult(req: UpdateGameResultReq): Long

    /** 删除游戏结果 */
    fun deleteGameResult(id: Long)

    /**
     * 查询游戏结果
     */
    fun getGameResult(resultId: Long?): GameResult?
}
