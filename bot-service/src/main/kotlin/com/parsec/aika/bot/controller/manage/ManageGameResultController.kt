package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.model.vo.req.CreateGameResultReq
import com.parsec.aika.bot.model.vo.req.UpdateGameResultReq
import com.parsec.aika.bot.model.vo.resp.GameResultListRespDTO
import com.parsec.aika.bot.service.GameResultService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
@RequestMapping("/manage/game")
class ManageGameResultController {

  @Resource private lateinit var gameResultService: GameResultService

  /** 获取游戏结果列表 */
  @GetMapping("/{gameId}/game-result")
  fun getGameResults(@PathVariable gameId: Long): BaseResult<List<GameResultListRespDTO>> {
    return BaseResult.success(gameResultService.getGameResults(gameId))
  }

  /** 创建游戏结果 */
  @PostMapping("/game-result")
  fun createGameResult(
          @RequestBody @Validated req: CreateGameResultReq
  ): BaseResult<Map<String, String>> {
    val id = gameResultService.createGameResult(req)
    return BaseResult.success(mapOf("id" to id.toString()))
  }

  /** 更新游戏结果 */
  @PutMapping("/game-result")
  fun updateGameResult(
          @RequestBody @Validated req: UpdateGameResultReq
  ): BaseResult<Map<String, String>> {
    val id = gameResultService.updateGameResult(req)
    return BaseResult.success(mapOf("id" to id.toString()))
  }

  /** 删除游戏结果 */
  @DeleteMapping("/game-result/{id}")
  fun deleteGameResult(@PathVariable id: Long): BaseResult<String> {
    gameResultService.deleteGameResult(id)
    return BaseResult.success("删除成功")
  }
}
