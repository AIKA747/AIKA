package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.ManageEditGameReq
import com.parsec.aika.bot.model.vo.req.ManageSaveGameReq
import com.parsec.aika.bot.model.vo.resp.ManageGameDetailResp
import com.parsec.aika.bot.model.vo.resp.ManageGameListResp
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

interface ManageGameService {
    /**
     * 保存游戏
     */
    fun saveGame(game: ManageSaveGameReq): Long

    /**
     * 编辑游戏
     */
    fun editGame(game: ManageEditGameReq): Int

    /**
     * 游戏列表
     */
    fun gameList(pageNo: Int, pageSize: Int): PageResult<ManageGameListResp>?

    /**
     * 游戏详情
     */
    fun gameDetail(id: Long): ManageGameDetailResp?

    /**
     * 删除游戏
     */
    fun deleteGame(id: Long): Int

    /**
     * 游戏上线/下线
     */
    fun gameEnable(id: Long, enable: Boolean, loginUserInfo: LoginUserInfo): Int

    /**
     * 游戏模型训练
     */
    fun gameTrain(gameId: Long, loginUserInfo: LoginUserInfo)
}
