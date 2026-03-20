package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.resp.GameResultListRespDTO
import com.parsec.aika.common.model.entity.GameResult
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Select

@Mapper
interface GameResultMapper : BaseMapper<GameResult> {

  @Select(
          """
        SELECT * FROM game_result
        WHERE gameId = #{gameId} AND deleted = false
        ORDER BY createdAt DESC
    """
  )
  fun getGameResults(gameId: Long): List<GameResultListRespDTO>
}
