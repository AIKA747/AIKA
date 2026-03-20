package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.handler.ThreadContentTypeHandler
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.vo.req.GetAppContentPostFeedReq
import com.parsec.aika.common.model.vo.resp.GetAppContentPostResp
import com.parsec.aika.common.model.vo.resp.GetAppShortcutResp
import com.parsec.aika.common.model.vo.resp.ManagePostListResp
import org.apache.ibatis.annotations.*

@Mapper
interface PostMapper : BaseMapper<Post> {

    @Select(
        """
        <script>
        select p.* 
        ,a.avatar
        ,a.nickname,
        if(t.id is null,0,1) as thumbed,
        c.reportId
        from t_post p
        left join t_author a on p.author = a.userId and p.type = a.type
        left join t_thumb t on t.postId=p.id and t.creator=#{userId}
        left join t_post_blocked d on d.postId = p.id and d.creator = #{userId}
        left join t_post_report_author c on c.postId=p.id and c.author=#{userId}
        where d.id is null and p.blocked = false and a.deleted=0
        <if test='blockedUserIds != null and blockedUserIds.size() > 0'>
            and p.author not in
            <foreach collection="blockedUserIds" item="blockedUserId" open="(" separator="," close=")">
                #{blockedUserId}
            </foreach>
        </if>
        <if test='req.userId != null'>
            and p.author = #{req.userId}
        </if> 
        <if test='req.topicTag != null'>
            and topicTags like concat('%',#{req.topicTag},'%') 
        </if> 
        <if test='req.keywords != null '>
            and (p.title like concat('%',#{req.keywords},'%') 
                or p.summary like concat('%',#{req.keywords},'%'))
        </if> 
        <if test='req.type!=null'>
            and p.type=#{req.type}
        </if>
        order by 
          (DATEDIFF(p.createdAt, 
             DATE_SUB(now(), INTERVAL 7 DAY)     
          ) + Round(exp(1-  (1/ (p.visits+1) ) ), 6 ) + (p.author=#{userId})*1.5 ) 
          desc,p.createdAt desc
        </script>
    """
    )
    @Results(
        id = "PostResultMap1",
        value = [Result(property = "thread", column = "thread", typeHandler = ThreadContentTypeHandler::class)]
    )
    fun getPostFeed(
        page: Page<GetAppContentPostResp>,
        @Param("req") req: GetAppContentPostFeedReq,
        @Param("userId") userId: Long,
        @Param("blockedUserIds") blockedUserIds: List<Long>?
    ): Page<GetAppContentPostResp>


    @Select(
        """
        <script>
        select
            p.id postId,
            p.author,
            a.nickname,
            a.username,
            a.avatar,
            pi.threadIndex,
            pi.createdAt,
            p.type,
            JSON_UNQUOTE(JSON_EXTRACT(p.thread, CONCAT('${'$'}[', pi.threadIndex, '].title')) )AS title,
            JSON_EXTRACT(p.thread, CONCAT('${'$'}[', pi.threadIndex, '].images')) AS images,
            JSON_UNQUOTE(JSON_EXTRACT(p.thread, CONCAT('${'$'}[', pi.threadIndex, '].content'))) AS content,
            JSON_UNQUOTE(JSON_EXTRACT(p.thread, CONCAT('${'$'}[', pi.threadIndex, ']'))) AS threadNode
        FROM
            t_post_index pi
            left JOIN t_post p ON p.id = pi.postId
            left join t_author a on p.author = a.userId and p.type = a.type and a.deleted=0
            left join t_post_blocked d on d.postId = p.id and d.creator = #{userId}
        where p.blocked = false and d.id is null
        <if test='blockedUserIds != null and blockedUserIds.size() > 0'>
            and p.author not in
            <foreach collection="blockedUserIds" item="blockedUserId" open="(" separator="," close=")">
                #{blockedUserId}
            </foreach>
        </if>
        <if test='req.keywords != null '>
            and (pi.summary like concat('%',#{req.keywords},'%') 
                or pi.keywords like concat('%',#{req.keywords},'%'))
        </if>
        order by 
          (DATEDIFF(p.createdAt, 
             DATE_SUB(now(), INTERVAL 7 DAY)     
          ) + Round(exp(1-  (1/ (p.visits+1) ) ), 6 ))
          desc,p.createdAt desc
        </script>
    """
    )
    @Results(
        id = "PostThreadMap",
        value = [Result(property = "images", column = "images", typeHandler = JacksonTypeHandler::class)]
    )
    fun listPostThread(
        page: Page<com.parsec.aika.common.model.vo.resp.GetAppContentPostThreadResp>,
        @Param("req") req: GetAppContentPostFeedReq,
        @Param("userId") userId: Long,
        @Param("blockedUserIds") blockedUserIds: List<Long>?
    ): Page<com.parsec.aika.common.model.vo.resp.GetAppContentPostThreadResp>


    //    我关注的用户发表的文章列表
    @Select(
        """
        <script>
        select p.id,p.title,p.cover,p.topicTags,p.createdAt,p.updatedAt,p.author,p.type,p.likes,p.reposts,
        p.visits,p.summary,p.keywords,a.nickname,a.avatar,if(t.id is null,0,1) as thumbed,c.reportId
        from t_post p
        inner join t_author a on p.author = a.userId and p.type = a.type and a.deleted = 0
        left join t_thumb t on t.postId=p.id and t.creator=#{userId}
        left join t_follow_relation f on f.followingId = p.author and f.creator = #{userId}
        left join t_post_blocked d on d.postId = p.id and d.creator = #{userId}
        left join t_post_report_author c on c.postId=p.id and c.author=#{userId}
        where f.agreed = true and p.blocked = false and d.id is null
        <if test='blockedUserIds != null and blockedUserIds.size() > 0'>
            and p.author not in
            <foreach collection="blockedUserIds" item="blockedUserId" open="(" separator="," close=")">
                #{blockedUserId}
            </foreach>
        </if>
        <if test='req.type!=null'>
            and p.type=#{req.type}
        </if>
        order by p.createdAt desc
        </script>
    """
    )
    @Results(
        id = "PostResultMap2",
        value = [Result(property = "thread", column = "thread", typeHandler = ThreadContentTypeHandler::class)]
    )
    fun getPostsFollow(
        page: Page<GetAppContentPostResp>,
        @Param("req") req: GetAppContentPostFeedReq,
        @Param("userId") userId: Long,
        @Param("blockedUserIds") blockedUserIds: List<Long>?
    ): Page<GetAppContentPostResp>

    // 查询当前登录用户发表的文章列表
    @Select(
        """
    <script>
    select p.id,p.title,p.cover,p.topicTags,p.createdAt,p.updatedAt,p.author,p.type,p.likes,p.reposts,
    p.visits,p.summary,p.keywords,a.nickname,a.avatar,if(t.id is null,0,1) as thumbed
    from t_post p 
    left join t_author a on p.author = a.userId and p.type = a.type and a.deleted=0
    left join t_thumb t on t.postId=p.id and t.creator=#{userId}
    where p.author=#{userId} and p.type='USER'
    <if test='req.keywords!=null and req.keywords!=""'>
        and (p.title like concat('%',#{req.keywords},'%') or p.summary like concat('%',#{req.keywords},'%'))
    </if>
    order by p.createdAt desc
    </script>
    """
    )
    @Results(
        id = "PostResultMap3",
        value = [Result(property = "thread", column = "thread", typeHandler = ThreadContentTypeHandler::class)]
    )
    fun getPostsPrivate(
        page: Page<GetAppContentPostResp>,
        @Param("req") req: GetAppContentPostFeedReq, @Param("userId") userId: Long
    ): Page<GetAppContentPostResp>

    @Select(
        """
        <script>
        SELECT a.id, a.nickname, a.userId, a.type, a.avatar, t1.id as postId 
        FROM t_author a
        INNER JOIN t_follow_relation f ON (a.userId = f.followingId and a.type = f.type) 
        INNER JOIN (
            SELECT max(p.id) as id, p.author,p.type 
            FROM t_post p
            left join t_post_blocked d on d.postId = p.id and d.creator = #{userId}
            WHERE p.createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR) and d.id is null
            <if test='blockedUserIds != null and blockedUserIds.size() > 0'>
                and p.author not in
                <foreach collection="blockedUserIds" item="blockedUserId" open="(" separator="," close=")">
                    #{blockedUserId}
                </foreach>
            </if>
            GROUP BY p.author,p.type
        ) t1 ON (a.userId = t1.author and a.type = t1.type)
        WHERE f.creator = #{userId} AND f.agreed = true
        </script>
    """
    )
    fun getShortcuts(
        @Param("userId") userId: Long,
        @Param("blockedUserIds") blockedUserIds: List<Long>?
    ): List<GetAppShortcutResp>

    @Select(
        """
    <script>
    select Round(DATEDIFF(createdAt, DATE_SUB(now(), INTERVAL 30 DAY)) * 0.4 +  0.6 * 13 * exp(1-(1/(visits+1))), 6)
    from t_post
    where id = #{postId}
    </script>
    """
    )
    fun calPostPopDegree(@Param("postId") postId: Int): Double

    @Select(
        """
         <script>
            select
                t1.id,t1.cover,t1.title,t1.summary,t1.author,t2.nickname as authorName,t2.avatar as authorAvatar,
                t1.type,t1.keywords,t1.recommendTags,t1.createdAt,t1.blocked,t1.flagged,t1.categories
            from t_post t1
            left join t_author t2 on t1.author = t2.userId and t1.type = t2.type and t2.deleted=0
            where 1=1
            <if test="null!=searchWord and searchWord!=''">
                and (
                    t1.title like concat('%',#{searchWord},'%') 
                    or t1.summary like concat('%',#{searchWord},'%') 
                    or t1.keywords like concat('%',#{searchWord},'%') 
                    or t1.categories like concat('%',#{searchWord},'%') 
                    or t2.nickname like concat('%',#{searchWord},'%') 
                )
            </if>
            <if test="null != flagged">
                and t1.flagged = #{flagged}
            </if>
            order by t1.createdAt desc
         </script>
        """
    )
    @Results(
        id = "getPostList",
        value = [Result(property = "categories", column = "categories", typeHandler = JacksonTypeHandler::class)]
    )
    fun getPostList(page: Page<ManagePostListResp>, @Param("searchWord") searchWord: String?,@Param("flagged") flagged: Boolean?): Page<ManagePostListResp>

    /**
     * 敏感贴子数量
     */
    @Select(
        """
        SELECT COUNT(*)
        FROM t_post p
                 LEFT JOIN t_author a ON p.author = a.userId and a.deleted=0
        WHERE p.author=#{userId} AND flagged AND p.createdAt>a.caseCleanAt
        """
    )
    fun sensitivePostsNum(@Param("userId") userId: Long?): Int

    // 查询指定用户发表的文章列表
    @Select(
        """
    <script>
    select p.id,p.title,p.cover,p.topicTags,p.createdAt,p.updatedAt,p.author,p.type,p.likes,p.reposts,
    p.visits,p.summary,p.keywords,a.nickname,a.avatar,if(t.id is null,0,1) as thumbed
    from t_post p 
    inner join t_author a on p.author = a.userId and p.type = a.type and a.deleted=0
    left join t_thumb t on t.postId=p.id and t.creator=#{userId}
    left join t_post_blocked d on d.postId = p.id and d.creator = #{userId}
    where p.author=#{req.userId} and p.type='USER' and d.id is null
    <if test='req.keywords!=null and req.keywords!=""'>
        and (p.title like concat('%',#{req.keywords},'%') or p.summary like concat('%',#{req.keywords},'%'))
    </if>
    order by p.createdAt desc
    </script>
    """
    )
    @Results(
        id = "PostResultMap4",
        value = [Result(property = "thread", column = "thread", typeHandler = ThreadContentTypeHandler::class)]
    )
    fun getPostsByUserId(page: Page<GetAppContentPostResp>, @Param("req") req: GetAppContentPostFeedReq,@Param("userId") userId: Long): Page<GetAppContentPostResp>
}
