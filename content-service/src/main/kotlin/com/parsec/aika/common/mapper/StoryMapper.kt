package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.em.RecommendStrategy
import com.parsec.aika.common.model.entity.*
import com.parsec.aika.common.model.vo.req.ManageStoryQueryVo
import com.parsec.aika.common.model.vo.resp.ManageStoryListVo
import com.parsec.aika.content.model.vo.req.GetAppStoryReq
import com.parsec.aika.common.model.vo.resp.GetAppStoryResp
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface StoryMapper : BaseMapper<Story> {

    @Select(
        """
        <script>
            SELECT 
                s.id, s.storyName, s.rewardsScore, IF(ifnull(r.reward,0) &lt; s.cutoffScore, TRUE, FALSE) AS `locked`, ifnull(r.reward,0) as reward,
                s.cutoffScore,s.gender,IFNULL(sc.image,s.defaultImage) AS image, s.introduction AS introduction, 
                s.listCover AS listCover,s.listCoverDark AS listCoverDark, s.categoryId AS categoryId,s.processCover as processCover,
                IFNULL(sr.storyProcess,0.0) as storyProcess, IFNULL(sr.`status`,'NOT_STARTED') as status,IF(cs.`id` IS NULL,FALSE,TRUE) AS collected
            FROM t_story AS s 
            LEFT JOIN t_rewards AS r ON r.creator = #{req.userId}
            LEFT JOIN t_story_recorder AS sr ON s.id = sr.storyId AND sr.deleted = 0 AND sr.creator = #{req.userId}
            LEFT JOIN t_story_chapter as sc ON sr.chapterId=sc.id AND sc.deleted = 0
            LEFT JOIN `t_collect_story` AS cs ON s.`id`=cs.`storyId` AND cs.deleted = 0 AND cs.`creator`= #{req.userId}
            WHERE s.deleted = 0 AND s.status = 'valid'
            <if test = 'req.storyName != null'>
                and (s.storyName like concat('%', #{req.storyName}, '%') or s.introduction like concat('%', #{req.storyName}, '%'))
            </if>
            <if test = 'req.status != null'>
                AND IFNULL(sr.`status`,'NOT_STARTED')=#{req.status}
            </if>
            <if test = 'req.collected != null'>
                AND IF(cs.`id` IS NULL,FALSE,TRUE) =#{req.collected}
            </if>
            <if test = 'req.categoryId != null'>
                and JSON_CONTAINS(ifnull(s.categoryId,'[]'), #{req.categoryId}, '$')
            </if>
            <if test="req.statusList != null and req.statusList.size() > 0">
                AND IFNULL(sr.`status`,'NOT_STARTED') IN
                <foreach collection="req.statusList" item="statusItem" open="(" close=")" separator=",">
                    #{statusItem}
                </foreach>
            </if>
            order by sr.storyProcess DESC,s.cutoffScore asc,s.id desc
        </script>
        """
    )
    fun getAppStory(page: Page<GetAppStoryResp>, @Param("req") req: GetAppStoryReq): Page<GetAppStoryResp>

    /**
     * 故事管理列表
     */
    @Select(
        """
        <script>
            select 
                s.id, s.storyName, s.rewardsScore, s.cutoffScore, s.cover, 
                s.gender, s.defaultImage as image, s.introduction, s.createdAt, s.`status`
            from t_story as s 
            where s.deleted = 0
                <if test = 'req.storyName != null'>
                    and s.storyName like concat('%', #{req.storyName}, '%')
                </if>
                <if test = 'req.status != null'>
                    and s.status=#{req.status}
                </if>
                <if test = 'req.minCreatedAt != null'>
                    and s.createdAt &gt;= #{req.minCreatedAt}
                </if>
                <if test = 'req.maxCreatedAt != null'>
                    and s.createdAt &lt;= #{req.maxCreatedAt} 
                </if>
            order by s.cutoffScore asc,s.id desc
        </script>
    """
    )
    fun manageStoryList(page: Page<ManageStoryListVo>, @Param("req") req: ManageStoryQueryVo): Page<ManageStoryListVo>

    /**
     * 验证非该id下有没有其他故事名称的数据
     */
    @Select(
        """
        <script>
            select * from t_story 
            where deleted = 0 and storyName=#{storyName} and id != #{notId}
            limit 1
        </script>
    """
    )
    fun checkStoryName(@Param("storyName") name: String, @Param("notId") notId: Long): Story


    @Select(
        """
        <script> 
        SELECT s.*,srr.creator AS recorderUserId,sr.userCount
        FROM t_story AS s 
        LEFT JOIN (SELECT storyId,COUNT(creator) AS userCount FROM t_story_recorder GROUP BY storyId) AS sr ON s.`id`=sr.storyId
        LEFT JOIN t_story_recorder srr ON s.`id`=srr.`storyId` AND srr.creator=#{userId}
        <if test='tags != null'>
            and
            <foreach item='tag' index='index' collection='tags' open='(' separator='or' close=')'>
                s.tags like CONCAT('%',#{tag},'%')
            </foreach>
        </if>
        <if test = 'recommendStrategy.name == "popular"'>
           order by sr.userCount  desc
        </if>
        <if test = 'recommendStrategy.name == "balance"'>
           order by sr.userCount  asc
        </if>
        <if test = 'recommendStrategy.name == "random"'>
           order by RAND()
        </if>
        </script>
    """
    )
    fun storyRecommend(
        @Param("tags") tags: List<String>?,
        @Param("recommendStrategy") recommendStrategy: RecommendStrategy,
        @Param("userId") userId: Long
    ): List<Story>
}
