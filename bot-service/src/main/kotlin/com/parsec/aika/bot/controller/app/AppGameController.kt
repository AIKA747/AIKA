package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.AppChatRecordQueryVo
import com.parsec.aika.bot.model.vo.req.CreateGameThreadReq
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.bot.model.vo.resp.GameListVO
import com.parsec.aika.bot.model.vo.resp.MyGameVO
import com.parsec.aika.bot.service.GameMessageService
import com.parsec.aika.bot.service.GameService
import com.parsec.aika.common.aspect.TranslateResult
import com.parsec.aika.common.model.entity.Game
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class AppGameController {


    @Resource
    private lateinit var gameService: GameService

    @Resource
    private lateinit var gameMessageService: GameMessageService

    /** 游戏列表 */
    @TranslateResult
    @GetMapping("/app/game")
    fun getGameList(pageVo: PageVo): BaseResult<PageResult<GameListVO>> {
        return BaseResult.success(gameService.getGameList(pageVo))
    }

    /** 开始游戏 */
    @PostMapping("/app/game-thread")
    fun createGameThread(
        @RequestBody @Validated req: CreateGameThreadReq,
        loginUser: LoginUserInfo
    ): BaseResult<String> {
        return BaseResult.success(gameService.createGameThread(req.gameId!!, req.restart, loginUser).toString())
    }

    /** 我的游戏列表 */
    @GetMapping("/app/my-game")
    fun getMyGameList(pageVo: PageVo, loginUser: LoginUserInfo): BaseResult<PageResult<MyGameVO>> {
        return BaseResult.success(gameService.getMyGameList(pageVo, loginUser))
    }

    /** 游戏详情 */
    @GetMapping("/app/game/{id}")
    fun getGameDetail(@PathVariable id: Long): BaseResult<Game> {
        return BaseResult.success(gameService.getGameDetail(id))
    }

    /**
     * 游戏聊天记录查询接口
     */
    @GetMapping("/app/game/chat/records")
    fun getChatRecord(
        queryVo: AppChatRecordQueryVo, user: LoginUserInfo
    ): BaseResult<PageResult<AppChatRecordListVo>> {
        // 查询当前登录用户与传入的机器人之间的聊天记录
        return BaseResult.success(gameMessageService.appChatRecords(queryVo, user))
    }
}
