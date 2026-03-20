package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.resp.MyGameVO
import com.parsec.aika.common.model.entity.GameThread
import org.apache.ibatis.annotations.Delete
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface GameThreadMapper : BaseMapper<GameThread> {

  @Select(
          """
        SELECT * FROM game_thread 
        WHERE gameId = #{gameId} AND creator = #{userId} 
        AND deleted = false
        order by createdAt desc
        LIMIT 1
    """
  )
  fun getLastThread(
          @Param("gameId") gameId: Long,
          @Param("userId") userId: Long
  ): GameThread?

  @Delete(
          """
        UPDATE game_thread SET deleted = true
        WHERE gameId = #{gameId} AND creator = #{userId} AND status = 'UNCOMPLETED' AND deleted = false
    """
  )
  fun deleteOldUncompletedThread(@Param("gameId") gameId: Long, @Param("userId") userId: Long)

  @Select(
          """
        SELECT 
            t.id, t.gameId, t.status, 
            COALESCE(r.cover, g.cover) as cover,
            r.summary as resultSummary,
            g.gameName,
            t.createdAt,
            t.updatedAt,
            COALESCE(r.cover, g.listCoverDark) as listCoverDark,
             g.introduce     
        FROM game_thread t
        LEFT JOIN game g ON t.gameId = g.id
        LEFT JOIN game_result r ON t.result = r.id
        WHERE t.creator = #{userId} 
        AND t.deleted = false
        AND g.enable = true
        AND g.deleted = false
        ORDER BY t.updatedAt DESC
    """
  )
  fun getMyGameList(@Param("userId") userId: Long): List<MyGameVO>
}
