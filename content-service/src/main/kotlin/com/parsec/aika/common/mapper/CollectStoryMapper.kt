package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.CollectStory

import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface CollectStoryMapper : BaseMapper<CollectStory> {
    @Select("""
        <script>
        SELECT s.id, s.storyName, s.rewardsScore, IF(r.reward &lt; s.cutoffScore, TRUE ,FALSE) AS LOCKED, 
        s.gender, s.defaultImage AS image,  s.introduction AS introduction, 
        s.listCover AS listCover, sr.storyProcess, sr.`status`
        FROM t_collect_story AS cs 
        LEFT JOIN t_story AS s ON cs.storyId = s.id AND s.deleted = 0
        LEFT JOIN t_rewards AS r ON s.creator =#{userId}
        LEFT JOIN t_story_recorder AS sr ON s.id = sr.storyId AND sr.creator =#{userId} AND sr.deleted = 0
        WHERE cs.deleted = 0 AND cs.creator = #{userId}
        ORDER BY s.id DESC
        </script>
    """)
    fun getAppUserCollectStory(@Param("userId") userId: Long): List<com.parsec.aika.common.model.vo.resp.GetAppUserCollectStoryResp>
}
