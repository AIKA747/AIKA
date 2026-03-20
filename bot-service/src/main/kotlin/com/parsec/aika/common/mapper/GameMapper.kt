package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.resp.GameListVO
import com.parsec.aika.bot.model.vo.resp.ManageGameListResp
import com.parsec.aika.common.model.entity.Game
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Select

@Mapper
interface GameMapper : BaseMapper<Game> {

  @Select(
          """
        SELECT id, gameName, introduce, description, cover, listCover, avatar, listDesc, enable ,listCoverDark
        FROM game 
        WHERE enable = true AND deleted = false
        ORDER BY orderNum DESC, createdAt DESC
    """
  )
  fun getGameList(): List<GameListVO>

    @Select("select id,gameName,listCover,avatar,listDesc,orderNum,enable,free from game where deleted=0 order by orderNum desc")
    fun getManageGameList(): List<ManageGameListResp>
}
