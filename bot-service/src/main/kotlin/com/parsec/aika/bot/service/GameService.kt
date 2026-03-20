package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.GameQuestion
import com.parsec.aika.bot.model.vo.resp.GameListVO
import com.parsec.aika.bot.model.vo.resp.MyGameVO
import com.parsec.aika.common.model.entity.Game
import com.parsec.aika.common.model.entity.GameThread
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.PageResult

interface GameService {

    /** 获取游戏列表 */
    fun getGameList(pageVo: PageVo): PageResult<GameListVO>

    /** 创建游戏线程 */
    fun createGameThread(gameId: Long, restart: Boolean?, loginUser: LoginUserInfo): Long

    /** 获取我的游戏列表 */
    fun getMyGameList(pageVo: PageVo, loginUser: LoginUserInfo): PageResult<MyGameVO>

    /** 获取游戏详情 */
    fun getGameDetail(id: Long): Game

    /** 获取下一个问题 */
    fun getGameNextQuestion(threadId: Long): GameQuestion

    /** 获取当前问题 */
    fun getCurrentGameQuestion(threadId: Long): GameQuestion

    /**
     * 查询游戏线程信息
     */
    fun getGameThread(threadId: Long): GameThread

    /**
     * 更新游戏thread信息
     */
    fun updateGameThread(gameThread: GameThread)

}
