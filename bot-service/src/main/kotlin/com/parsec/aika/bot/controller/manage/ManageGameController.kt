package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.model.vo.req.ManageEditGameReq
import com.parsec.aika.bot.model.vo.req.ManageGameEnableReq
import com.parsec.aika.bot.model.vo.req.ManageSaveGameReq
import com.parsec.aika.bot.model.vo.resp.ManageGameDetailResp
import com.parsec.aika.bot.model.vo.resp.ManageGameListResp
import com.parsec.aika.bot.service.ManageGameService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
class ManageGameController {

    @Autowired
    private lateinit var manageGameService: ManageGameService

    /**
     * 新增游戏
     */
    @PostMapping("/manage/game")
    fun saveGame(
        @Validated @RequestBody game: ManageSaveGameReq, loginUserInfo: LoginUserInfo
    ): BaseResult<*> {
        game.apply {
            creator = loginUserInfo.userId
            updater = loginUserInfo.userId
        }
        return BaseResult.success(manageGameService.saveGame(game).toString())
    }

    /**
     * 编辑游戏
     */
    @PutMapping("/manage/game")
    fun editGame(@Validated @RequestBody game: ManageEditGameReq, loginUserInfo: LoginUserInfo): BaseResult<*> {
        game.updater = loginUserInfo.userId
        return BaseResult.success(manageGameService.editGame(game))
    }

    /**
     * 游戏列表
     */
    @GetMapping("/manage/game")
    fun gameList(pageNo: Int?, pageSize: Int?): BaseResult<PageResult<ManageGameListResp>> {
        return BaseResult.success(manageGameService.gameList(pageNo ?: 1, pageSize ?: 10))
    }

    /**
     * 游戏详情
     */
    @GetMapping("/manage/game/{id}")
    fun gameDetail(@PathVariable("id") id: Long): BaseResult<ManageGameDetailResp> {
        return BaseResult.success(manageGameService.gameDetail(id))
    }

    /**
     * 删除游戏
     */
    @DeleteMapping("/manage/game/{id}")
    fun deleteGame(@PathVariable("id") id: Long): BaseResult<*> {
        return BaseResult.success(manageGameService.deleteGame(id))
    }

    /**
     * 游戏上线/下线
     */
    @PutMapping("/manage/game/enable")
    fun gameEnable(@Validated @RequestBody req: ManageGameEnableReq, loginUserInfo: LoginUserInfo): BaseResult<*> {
        return BaseResult.success(manageGameService.gameEnable(req.id!!, req.enable!!, loginUserInfo))
    }

    /**
     * 游戏训练
     */
    @PutMapping("/manage/game/train")
    fun gameTrain(gameId: Long, loginUserInfo: LoginUserInfo): BaseResult<*> {
        manageGameService.gameTrain(gameId, loginUserInfo)
        return BaseResult.success()
    }

}
