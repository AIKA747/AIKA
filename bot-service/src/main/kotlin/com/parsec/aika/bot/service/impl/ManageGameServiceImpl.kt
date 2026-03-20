package com.parsec.aika.bot.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.core.collection.CollUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.gpt.GptAssistantClient
import com.parsec.aika.bot.model.vo.req.ManageEditGameReq
import com.parsec.aika.bot.model.vo.req.ManageSaveGameReq
import com.parsec.aika.bot.model.vo.resp.ManageGameDetailResp
import com.parsec.aika.bot.model.vo.resp.ManageGameListResp
import com.parsec.aika.bot.service.ManageGameService
import com.parsec.aika.common.mapper.GameMapper
import com.parsec.aika.common.mapper.GameResultMapper
import com.parsec.aika.common.model.entity.Game
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ManageGameServiceImpl : ManageGameService {

    @Autowired
    private lateinit var gameMapper: GameMapper

    @Autowired
    private lateinit var gameResultMapper: GameResultMapper

    @Autowired
    private lateinit var gptAssistantClient: GptAssistantClient

    override fun saveGame(game: ManageSaveGameReq): Long {
        checkGameName(game.gameName, null)
        val saveGame = BeanUtil.copyProperties(game, Game::class.java)
        saveGame.enable = false
        saveGame.listCover = saveGame.listCover ?: saveGame.listCoverDark
        saveGame.listCoverDark = saveGame.listCoverDark ?: saveGame.listCover
        saveGame.cover = saveGame.cover ?: saveGame.coverDark
        saveGame.coverDark = saveGame.coverDark ?: saveGame.cover
        gameMapper.insert(saveGame)
        return saveGame.id!!
    }

    override fun editGame(game: ManageEditGameReq): Int {
        if (StrUtil.isNotBlank(game.gameName)) {
            checkGameName(game.gameName, game.id)
        }
        val editGame = BeanUtil.copyProperties(game, Game::class.java)

        editGame.listCover = editGame.listCover ?: editGame.listCoverDark
        editGame.listCoverDark = editGame.listCoverDark ?: editGame.listCover
        editGame.cover = editGame.cover ?: editGame.coverDark
        editGame.coverDark = editGame.coverDark ?: editGame.cover

        return gameMapper.update(editGame, KtQueryWrapper(Game::class.java).eq(Game::id, game.id))
    }

    /**
     * 校验游戏名称是否重复
     */
    private fun checkGameName(gameName: String?, id: Long?) {
        val count = gameMapper.selectCount(
            KtQueryWrapper(Game::class.java).eq(Game::gameName, gameName).ne(null != id, Game::id, id)
        )
        Assert.state(count == 0, "The game name already exists.")
    }

    override fun gameList(pageNo: Int, pageSize: Int): PageResult<ManageGameListResp>? {
        PageHelper.startPage<ManageGameListResp>(pageNo, pageSize)
        return PageUtil<ManageGameListResp>().page(gameMapper.getManageGameList())
    }

    override fun gameDetail(id: Long): ManageGameDetailResp? {
        val game = gameMapper.selectById(id) ?: throw Exception("The game does not exist.")
        return BeanUtil.copyProperties(game, ManageGameDetailResp::class.java)

    }

    override fun deleteGame(id: Long): Int {
        return gameMapper.deleteById(id)
    }

    override fun gameEnable(id: Long, enable: Boolean, loginUserInfo: LoginUserInfo): Int {

        if (enable) {
            val game = gameMapper.selectById(id) ?: throw BusinessException("The game does not exist.")
            if (game.assistantId.isNullOrEmpty()) {
                throw BusinessException("You must train this Game before release it to live.")
            }
            if (CollUtil.isEmpty(game.questions)) {
                throw BusinessException("You must add questions before release it to live.")
            }
            //校验游戏上线时是否已设置好了游戏结果
            val gameResults = gameResultMapper.getGameResults(id)
            if (CollUtil.isEmpty(gameResults)) {
                throw BusinessException("You must add results before release it to live.")
            }
        }

        return gameMapper.update(Game().apply {
            this.enable = enable
            this.updater = loginUserInfo.userId
        }, KtQueryWrapper(Game::class.java).eq(Game::id, id))
    }

    override fun gameTrain(gameId: Long, loginUserInfo: LoginUserInfo) {
        val game = gameMapper.selectById(gameId) ?: throw BusinessException("The game does not exist.")
        if (game.assistantId.isNullOrEmpty()) {
            val assistantId = gptAssistantClient.createAssistant(game.assistantName!!, game.instructions!!, game.model)
            game.assistantId = assistantId
            game.updater = loginUserInfo.userId
            gameMapper.updateById(game)
        } else {
            //直接更新助手信息
            gptAssistantClient.editAssistant(game.assistantId!!, game.assistantName!!, game.instructions!!, game.model)
        }
    }


}
