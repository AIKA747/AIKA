package com.parsec.aika.common.mapper

import cn.hutool.json.JSONObject
import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.StoryRecorder
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface StoryRecorderMapper : BaseMapper<StoryRecorder> {

    @Select("""SELECT SUM(reward) FROM `t_story_recorder` WHERE creator=#{userId} AND `status`='success'""")
    fun calcUserReward(@Param("userId") userId: Long): Int?

    @Select(
        """
           SELECT t1.storyName,
                   sum(IF(t2.status = 'PLAYING', 1, 0)) as progressCount,
                   sum(IF(t2.status = 'SUCCESS', 1, 0)) as finishCount
            FROM t_story t1
                     LEFT JOIN t_story_recorder t2 on t1.id = t2.storyId and t2.deleted = 0
            WHERE t1.deleted = 0
            GROUP BY t1.id, t1.storyName
            ORDER BY t1.createdAt DESC
        """
    )
    fun storyUserCount(): List<JSONObject>
}