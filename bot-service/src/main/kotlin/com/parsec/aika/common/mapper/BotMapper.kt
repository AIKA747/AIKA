package com.parsec.aika.common.mapper

import cn.hutool.json.JSONObject
import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.model.vo.resp.*
import com.parsec.aika.common.model.bo.BotRecommendBO
import com.parsec.aika.common.model.em.RecommendStrategy
import com.parsec.aika.common.model.entity.Bot
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select
import org.apache.ibatis.annotations.Update

@Mapper
interface BotMapper : BaseMapper<Bot> {
    @Select(
        """
        <script>
        select b.avatar as botAvatar, b.id, b.botName, b.botStatus, b.chatTotal, b.creator, b.creatorName, 
        b.gender, b.rating, b.subscriberTotal, b.updatedAt,b.dialogues
        from bot as b 
        where b.creator = #{req.creator} and b.botSource='userCreated' and b.deleted=0
        <if test = 'req.botName != null'>
             and b.botName like concat('%', #{req.botName}, '%')
        </if>
        order by b.sortNo asc, b.id desc
        </script>
    """
    )
    fun getAppMyBots(@Param("req") req: GetAppMyBotsReq): List<GetAppMyBotsResp>

    @Select(
        """
        <script>
        select b.id, b.botName, b.avatar as botAvatar, b.creator, b.creatorName, b.rating, b.subscriberTotal, b.gender, 
        b.updatedAt, bs.lastReadAt, b.botStatus, b.chatTotal,ifnull(b.recommendImage,b.avatar) as recommendImage,
        b.recommendWords,b.botIntroduce,b.album,b.botSource,bs.botImage
        from bot as b 
        left join bot_subscription as bs on b.creator = #{req.creator} and b.id = bs.botId 
        where b.deleted=0 and b.botStatus='online' and b.recommend and b.visibled
        <if test = 'req.botName != null'>
             and b.botName like concat('%', #{req.botName}, '%')
        </if>
        order by b.sortNo asc, b.id desc
        </script>
    """
    )
    fun getAppRecommendBots(@Param("req") req: GetAppRecommendBotsReq): List<GetAppRecommendBotsResp>

    @Select("select id,avatar from bot where botStatus='online' order by updatedAt desc limit 4")
    fun selectReleaseBots(userId: Long?): List<Map<String, Any>>


    @Select(
        """
        <script>
        select b.avatar as botAvatar, b.id, b.botName, b.botStatus, b.chatTotal, b.creator, b.creatorName, 
        b.gender, bs.lastReadAt, b.rating, b.subscriberTotal, b.updatedAt,b.categoryName,b.tags,bs.botImage,b.botIntroduce
        from bot as b 
        left join bot_subscription as bs on bs.userId = #{userId} and b.id = bs.botId
        where b.botStatus='online' and b.deleted=0 and b.visibled
        <if test = 'req.type == 1 and req.keyword != null and req.keyword != ""'>
             and b.categoryName like concat('%', #{req.keyword}, '%')
        </if>
        <if test = 'req.type == 2 and req.keyword != null and req.keyword != ""'>
             and b.botName like concat('%', #{req.keyword}, '%')
        </if>
        <if test = 'req.type == 0 and req.keyword != null and req.keyword != ""'>
             and (b.categoryName like concat('%', #{req.keyword}, '%') or b.botName like concat('%', #{req.keyword}, '%'))
        </if>
        <if test = 'req.categoryId != null'>
             and b.categoryId = #{req.categoryId}
        </if>
        <if test = 'req.tag != null and req.tag != ""'>
             and FIND_IN_SET(#{req.tag},tags)
        </if>
        order by b.sortNo asc, b.id asc
        </script>
    """
    )
    fun getAppExploreBots(
        @Param("req") req: GetAppExploreBotsReq, @Param("userId") userId: Long?
    ): List<GetAppExploreBotsResp>

    @Select(
        """
        <script>
        select b.avatar as botAvatar, b.id, b.botName, b.botStatus, b.chatTotal, b.creator, b.creatorName, 
        b.gender, b.rating, b.subscriberTotal, b.updatedAt,b.botSource
        from bot as b 
        where b.botSource='userCreated' and b.deleted=0 and b.visibled=1 and b.botStatus != 'unrelease'
        <if test='req.botOwnerIdList != null'>
            and b.creator in 
            <foreach collection='req.botOwnerIdList' open='(' close = ')' item='id' separator=','> 
            #{id}
            </foreach>
        </if>
        order by b.sortNo asc, b.id desc
        </script>
    """
    )
    fun getAppOwnerBots(@Param("req") req: GetAppOwnerBotsReq): List<GetAppOwnerBotsResp>

    @Select(
        """
        <script>
        select b.id, b.botSource, b.sortNo, b.recommendImage, b.recommendWords, b.recommendTime, 
        b.recommend, b.botName, b.rating,b.visibled
        from bot as b 
        where b.deleted=0 and b.recommend
        <if test = 'req.botName != null'>
             and b.botName like concat('%', #{req.botName}, '%')
        </if>
        <if test = 'req.categoryId != null'>
             and b.categoryId = #{req.categoryId}
        </if>
        <if test = 'req.botSource != null'>
             and b.botSource = #{req.botSource}
        </if>
        <if test = 'req.minRecommendTime != null'>
             and b.recommendTime &gt;= #{req.minRecommendTime}
        </if>
        <if test = 'req.maxRecommendTime != null'>
             and b.recommendTime &lt;= #{req.maxRecommendTime}
        </if>
        <if test = 'req.from != null and req.to != null'>
             and b.createdAt between #{req.from} and #{req.to}
        </if>
        <if test = 'req.botStatus != null'>
             and b.botStatus = #{req.botStatus}
        </if>
        order by b.sortNo asc, b.id desc
        </script>
    """
    )
    fun getManageBotRecommend(@Param("req") req: GetManageBotRecommendReq): List<GetManageBotRecommendResp>

    @Select(
        """
        <script>
        select b.id, b.botName, b.creator, b.chatTotal, b.botStatus, b.createdAt, b.categoryName, b.recommend, b.creatorName,b.visibled
        from bot as b 
        where b.deleted=0
        <if test = 'req.botName != null'>
             and b.botName like concat('%', #{req.botName}, '%')
        </if>
        <if test = 'req.creatorName != null'>
             and b.creatorName like concat('%', #{req.creatorName}, '%')
        </if>
        <if test = 'req.categoryId != null'>
             and b.categoryId = #{req.categoryId}
        </if>
        <if test = 'req.botSource != null'>
             and b.botSource = #{req.botSource}
        </if>
        <if test = 'req.from != null'>
             and b.createdAt &gt;= #{req.from}
        </if>
        <if test = 'req.to != null'>
             and b.createdAt &lt;= #{req.to}
        </if>
        <if test = 'req.botStatus != null'>
             and b.botStatus = #{req.botStatus}
        </if>
        order by b.sortNo asc, b.id desc
        </script>
    """
    )
    fun getManageBots(@Param("req") req: GetManageBotsReq): List<GetManageBotsResp>

    /**
     * 查询包含再入参id中的机器人信息
     */
    @Select(
        """
        <script>
        select count(*)
        from bot where deleted = 0
        <if test='ids != null'>
            and id in 
            <foreach collection='ids' open='(' close = ')' item='temp' separator=','> 
                #{temp}
            </foreach>
        </if>
        </script>
    """
    )
    fun checkBots(@Param("ids") ids: List<Long>): Int

    /**
     * 修改传入botId集合对应的categoryId为传入的categoryId
     */
    @Update(
        """
        <script>
            update bot set categoryId = #{categoryId} , categoryName = #{categoryName}
            where deleted=0 and id in 
            <foreach collection='ids' open='(' close = ')' item='id' separator=','> 
                #{id}
            </foreach>
        </script>
    """
    )
    fun updateBotCategoryId(
        @Param("ids") ids: List<Long>,
        @Param("categoryId") categoryId: Long,
        @Param("categoryName") categoryName: String?
    )

    /**
     * 修改传入的categoryId对应的bot对应的categoryId为null
     */
    @Select(
        """
        <script>
            select * from bot 
            where deleted=0 and categoryId = #{categoryId} 
            <if test='ids != null'>
                and id in 
                <foreach collection='ids' open='(' close = ')' item='temp' separator=','> 
                    #{temp}
                </foreach>
            </if>
        </script>
    """
    )
    fun selectBotByCategoryIdAndBotIds(@Param("ids") ids: List<Long>, @Param("categoryId") categoryId: Long): List<Bot>

    @Select(
        """
        <script>
            select id as botId, botName, botSource, categoryId, 0 as digitalHuman
            from bot 
            where deleted=0
            <if test = 'req.botName != null'>
                 and botName like concat('%', #{req.botName}, '%')
            </if>
            <if test = 'req.digitalHuman != null and req.digitalHuman == true'>
                 and JSON_CONTAINS(supportedModels, '"DigitaHumanService"')
            </if>
            <if test = 'req.digitalHuman != null and req.digitalHuman == false'>
                 and  ( supportedModels is null or  Not JSON_CONTAINS(supportedModels, '"DigitaHumanService"') )
            </if>
            <if test = 'req.botSource != null'>
                 and botSource = #{req.botSource}
            </if>
            <if test = 'req.categoryId != null'>
                 and categoryId = #{req.categoryId}
            </if>
            order by sortNo, id desc
        </script>
    """
    )
    fun selectBots(@Param("req") queryVo: ManageCategoryBotQueryVo): List<ManageCategoryBotListVo>

    @Select(
        """
        <script>
        select b.id, b.botName, b.avatar, b.gender, b.botIntroduce 
        from bot as b 
        where b.deleted=0 and b.botStatus='online' and b.creator != #{userId}
        <if test='tags != null'>
            and
            <foreach item='tag' index='index' collection='tags' open='(' separator='or' close=')'>
                b.tags like CONCAT('%',#{tag},'%')
            </foreach>
        </if>
        <if test = 'recommendStrategy.name == "popular"'>
           order by b.subscriberTotal  desc
        </if>
        <if test = 'recommendStrategy.name == "balance"'>
           order by b.subscriberTotal  asc
        </if>
        <if test = 'recommendStrategy.name == "random"'>
           order by RAND()
        </if>
        limit 1
        </script>
    """
    )
    fun botRecommend(
        @Param("tags") tags: List<String>?,
        @Param("recommendStrategy") recommendStrategy: RecommendStrategy,
        @Param("userId") userId: Long
    ): BotRecommendBO?


    @Select(
        """
        <script>
            select id as botId, botName, botSource, categoryId, creator,creatorName
            from bot 
            where deleted=0 and (bot.categoryId != #{req.categoryId} OR bot.categoryId IS NULL) 
            <if test = 'req.botName != null'>
                 and botName like concat('%', #{req.botName}, '%')
            </if>
            <if test = 'req.botSource != null'>
                 and botSource = #{req.botSource}
            </if>
            <if test = 'req.creatorName != null'>
                 and creatorName like concat('%', #{req.creatorName}, '%')
            </if>
            order by sortNo, id desc
        </script>
    """
    )
    fun manageCategorySelectBots(@Param("req") queryVo: ManageCategoryBotQueryVo): List<ManageCategoryBotListVo>


    @Select(
        """
            SELECT r.botName, c.categoryName, COUNT(m.userId) AS userCount
            FROM (SELECT DISTINCT botId, userId
                  FROM message_record
                  WHERE deleted = 0) m
                     INNER JOIN bot r ON m.botId = r.id
                     INNER JOIN category c on r.categoryId = c.id
            WHERE r.deleted = 0
            GROUP BY r.botName, c.categoryName
            ORDER BY userCount DESC
        """
    )
    fun botConversationCount(): List<JSONObject>

}
