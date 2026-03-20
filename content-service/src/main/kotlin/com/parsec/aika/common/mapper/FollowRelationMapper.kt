package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.entity.FollowRelation
import com.parsec.aika.common.model.vo.resp.FollowUserResp
import com.parsec.aika.common.model.vo.resp.GetAuthorResp
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface FollowRelationMapper : BaseMapper<FollowRelation> {

    @Select(
        """
        <script>
        select r.id,a.avatar,a.nickname,a.username,a.userId
        from t_follow_relation r
        left join t_author a on a.userId = r.creator and a.deleted = 0
         where  r.followingId = #{userId} and r.agreed = false 
         <if test="nickname!=null and nickname!=''">
            and a.nickname like concat('%',#{nickname},'%')
         </if>
        order by r.id desc 
        </script>
    """
    )
    fun listMyFollowingApply(
        page: Page<GetAuthorResp>, @Param("userId") userId: Long, @Param("nickname") nickname: String?
    ): Page<GetAuthorResp>

    @Select(
        """
        <script>
        select r.*
        from t_follow_relation r
         where  r.followingId = #{userId}
         and r.creator = #{creator}
         limit 1
        </script>
    """
    )
    fun getMyFollowingApplyByUid(@Param("userId") userId: Long, @Param("creator") creator: Long): FollowRelation?

    @Select(
        """
        <script>
        select r.*
        from t_follow_relation r
         where  r.followingId = #{followingId}
         and r.creator = #{userId}
         limit 1
        </script>
    """
    )
    fun getMyFollowingUserRelationByFollowingId(
        @Param("userId") userId: Long, @Param("followingId") creator: Long
    ): FollowRelation?


    @Select(
        """
        <script>
        SELECT COUNT(*) AS mutualCount
        FROM t_follow_relation AS f1
        LEFT JOIN t_follow_relation AS f2 ON f1.creator = f2.followingId AND f1.followingId = f2.creator
        WHERE f1.creator = #{userId} AND f1.deleted = 0 AND f2.deleted = 0 AND f1.agreed = 1 AND f2.agreed = 1 AND f1.creator != f1.followingId;
        </script>
    """
    )
    fun getFriendTotal(@Param("userId") userId: Long): Long

    @Select(
        """
        <script>
            select t1.userId, t1.username, t1.avatar, t1.nickname, t1.bio, t1.gender, if(t3.id is null, 0, 1) as followed
            from t_author t1
            inner join t_follow_relation t2 on t1.userId = t2.followingId and t1.type = 'USER' and t2.agreed = true 
            left join t_follow_relation t3 on t1.userId = t3.followingId and t1.type = 'USER' and t3.creator = #{loginUserId} and t3.deleted = 0
            where t1.deleted = 0 and t2.deleted = 0 and t2.creator = #{userId} 
            <if test="username != null">
                and t1.username like concat('%',#{username},'%')
            </if>
            <if test="nickname != null">
                and t1.nickname like concat('%',#{nickname},'%')
            </if>
            order by t2.id
         </script>
        """
    )
    fun getFollowingList(
        page: Page<FollowUserResp>,
        @Param("userId") userId: Long?,
        @Param("loginUserId") loginUserId: Long?,
        @Param("username") username: String?,
        @Param("nickname") nickname: String?
    ): Page<FollowUserResp>

    @Select(
        """
        <script>
        select 
            t1.userId, t1.username, t1.avatar, t1.nickname, t1.bio, t1.gender, if(t3.id is null, 0, 1) as followed
        from t_author t1
        inner join t_follow_relation t2 on t1.userId = t2.creator and t1.type = 'USER' and t2.agreed = true
        left join t_follow_relation t3 on t1.userId = t3.followingId and t1.type = 'USER' and t3.creator = #{loginUserId} and t3.deleted = 0
        where t1.deleted = 0 and t2.deleted = 0 and t2.followingId = #{userId}  
        <if test="username != null">
            and t1.username like concat('%',#{username},'%')
        </if>
        <if test="nickname != null">
            and t1.nickname like concat('%',#{nickname},'%')
        </if>
        order by t2.id
        </script>
        """
    )
    fun getFollowedList(
        page: Page<FollowUserResp>,
        @Param("userId") userId: Long?,
        @Param("loginUserId") loginUserId: Long?,
        @Param("username") username: String?,
        @Param("nickname") nickname: String?
    ): Page<FollowUserResp>

    @Select(
        """
        <script>
        select t1.userId, t1.username, t1.avatar, t1.nickname, t1.bio, t1.gender, if(t3.id is null, 0, 1) as followed
        from t_author t1
        inner join t_follow_relation t2 on t1.userId = t2.creator and t1.type = 'USER' and t2.deleted = 0 and t2.agreed = true and t2.followingId = #{userId}  
        inner join t_follow_relation t4 on t1.userId = t4.followingId and t1.type = 'USER' and t4.deleted = 0 and t4.agreed = true and t4.creator = t2.followingId
        left join t_follow_relation t3  on t1.userId = t3.followingId and t1.type = 'USER' and t3.creator = #{loginUserId} and t3.deleted = 0
        where t1.deleted = 0
        <if test="username != null">
            and t1.username like concat('%',#{username},'%')
        </if>
        <if test="nickname != null">
            and t1.nickname like concat('%',#{nickname},'%')
        </if>
        order by t2.id
        </script>
        """
    )
    fun getFrendsList(
        page: Page<FollowUserResp>,
        @Param("userId") userId: Long?,
        @Param("loginUserId") loginUserId: Long?,
        @Param("username") username: String?,
        @Param("nickname") nickname: String?
    ): Page<FollowUserResp>
}
