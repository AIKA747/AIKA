package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.user.model.entity.AppFriendInfo
import com.parsec.aika.user.model.entity.Follower
import com.parsec.aika.user.model.vo.req.UserAppFollowerReq
import com.parsec.aika.user.model.vo.req.UserAppFollowingReq
import com.parsec.aika.user.model.vo.resp.UserAppFollowerResp
import com.parsec.aika.user.model.vo.resp.UserAppFollowingResp
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Result
import org.apache.ibatis.annotations.Results
import org.apache.ibatis.annotations.Select

interface FollowerMapper : BaseMapper<Follower> {
    @Select(
        """
        <script>
        select
        if(f.followingId=#{req.userId}, f.userId, f.followingId) as userId,
        if(f.followingId=#{req.userId}, uf.username, fu.username) as username,
        if(f.followingId=#{req.userId}, uf.nickname, fu.nickname) as nickname,
        if(f.followingId=#{req.userId}, uf.gender, fu.gender) as gender,
        if(f.followingId=#{req.userId}, uf.avatar, fu.avatar) as avatar,
        f.lastReadTime,f.uf and f.fu as friend
        from follower as f
        left join user as uf on f.userId = uf.id
        left join user as fu on f.followingId = fu.id
        where f.deleted = 0 and uf.deleted = 0 and fu.deleted = 0
        and ((f.followingId = #{req.userId} and f.uf = 1) or (f.userId=#{req.userId} and f.fu = 1))
        <if test = 'req.username != null'>
            and if(f.followingId=#{req.userId},uf.username,fu.username) like concat('%', #{req.username}, '%')
        </if>
        order by f.id desc
        </script>
    """
    )
    fun appFollower(@Param("req") req: UserAppFollowerReq): List<UserAppFollowerResp>

    @Select(
        """
        <script>
        select
        if(f.followingId=#{req.userId}, f.userId, f.followingId) as userId,
        if(f.followingId=#{req.userId}, uf.username, fu.username) as username,
        if(f.followingId=#{req.userId}, uf.nickname, fu.nickname) as nickname,
        if(f.followingId=#{req.userId}, uf.gender, fu.gender) as gender,
        if(f.followingId=#{req.userId}, uf.avatar, fu.avatar) as avatar,
        f.lastReadTime,f.uf and f.fu as friend
        from follower as f
        left join user as uf on f.userId = uf.id
        left join user as fu on f.followingId = fu.id
        where f.deleted = 0 and uf.deleted = 0 and fu.deleted = 0
        and ((f.followingId = #{req.userId} and f.uf = 1) or (f.userId=#{req.userId} and f.fu = 1))
        <if test = 'req.username != null'>
            and if(f.followingId=#{req.userId},uf.username,fu.username) like concat('%', #{req.username}, '%')
        </if>
        order by f.id desc
        </script>
    """
    )
    fun appFollower(page: Page<UserAppFollowerResp>, @Param("req") req: UserAppFollowerReq): Page<UserAppFollowerResp>

    @Select(
        """
        <script>
        select
        if(f.userId=#{req.userId},f.followingId, f.userId) as userId,
        if(f.userId=#{req.userId},uf.username, fu.username) as username,
        if(f.userId=#{req.userId},uf.gender, fu.gender) as gender,
        if(f.userId=#{req.userId},uf.avatar, fu.avatar) as avatar,
        if(f.userId=#{req.userId},uf.followerTotal, fu.followerTotal) as followerTotal,
        if(f.userId=#{req.userId},uf.storyTotal, fu.storyTotal) as storyTotal,
        if(f.userId=#{req.userId},uf.botTotal, fu.botTotal) as botTotal,
        if(f.userId=#{req.userId},uf.lastReleaseBotAt, fu.lastReleaseBotAt) as lastReleaseBotAt,
        if(f.userId=#{req.userId},uf.lastShareStoryAt, fu.lastShareStoryAt) as lastShareStoryAt,
        if(f.userId=#{req.userId},uf.bots, fu.bots) as bots,
        if(f.userId=#{req.userId},uf.nickname, fu.nickname) as nickname,
        f.lastReadTime, f.uf and f.fu as friend
        from follower as f
        left join user as uf on f.followingId = uf.id
        left join user as fu on f.userId = fu.id
        where f.deleted = 0 and uf.deleted = 0 and fu.deleted = 0
        and ((f.userId = #{req.userId} and f.uf=1) or (f.followingId = #{req.userId} and f.fu=1))
        <if test = 'req.username != null'>
            and if(f.userId=#{req.userId},uf.username,fu.username) like concat('%', #{req.username}, '%')
        </if>
        order by f.id desc
        </script>
    """
    )
    @Results(
        Result(property = "bots", column = "bots", typeHandler = JacksonTypeHandler::class)
    )
    fun appFollowing(@Param("req") req: UserAppFollowingReq): List<UserAppFollowingResp>

    @Select(
        """
        <script>
        select
        if(f.userId=#{req.userId},f.followingId, f.userId) as userId,
        if(f.userId=#{req.userId},uf.username, fu.username) as username,
        if(f.userId=#{req.userId},uf.gender, fu.gender) as gender,
        if(f.userId=#{req.userId},uf.avatar, fu.avatar) as avatar,
        if(f.userId=#{req.userId},uf.followerTotal, fu.followerTotal) as followerTotal,
        if(f.userId=#{req.userId},uf.storyTotal, fu.storyTotal) as storyTotal,
        if(f.userId=#{req.userId},uf.botTotal, fu.botTotal) as botTotal,
        if(f.userId=#{req.userId},uf.lastReleaseBotAt, fu.lastReleaseBotAt) as lastReleaseBotAt,
        if(f.userId=#{req.userId},uf.lastShareStoryAt, fu.lastShareStoryAt) as lastShareStoryAt,
        if(f.userId=#{req.userId},uf.bots, fu.bots) as bots,
        if(f.userId=#{req.userId},uf.nickname, fu.nickname) as nickname,
        f.lastReadTime, f.uf and f.fu as friend
        from follower as f
        left join user as uf on f.followingId = uf.id
        left join user as fu on f.userId = fu.id
        where f.deleted = 0 and uf.deleted = 0 and fu.deleted = 0
        and ((f.userId = #{req.userId} and f.uf=1) or (f.followingId = #{req.userId} and f.fu=1))
        <if test = 'req.username != null'>
            and if(f.userId=#{req.userId},uf.username,fu.username) like concat('%', #{req.username}, '%')
        </if>
        order by f.id desc
        </script>
    """
    )
    @Results(
        Result(property = "bots", column = "bots", typeHandler = JacksonTypeHandler::class)
    )
    fun appFollowing(
        page: Page<UserAppFollowingResp>, @Param("req") req: UserAppFollowingReq
    ): Page<UserAppFollowingResp>

    // 通过 userId 和 followingId 查询记录
    @Select(
        """
        <script>
         SELECT *
            FROM follower
            WHERE deleted = 0 and ((userId = #{userId} AND followingId = #{followingId}) OR (userId = #{followingId} AND followingId = #{userId}))
        </script>
        """
    )
    fun selectByUidAndFollowingId(@Param("userId") userId: Long, @Param("followingId") followingId: Long?): Follower?

    @Select(
        """
        <script>
            select 
                a.*, u.username, u.nickname, u.bio, u.avatar
            from 
            (
                select 
                    IF(userId = #{userId}, followingId, userId) id, IF(fu + uf = 2, 'MUTUAL', 'FOLLOWED_BY') followStatus, IF(fu + uf = 2, 1, 0) as friend
                from 
                    follower f
                where 
                f.deleted=0
                    and ((userId = #{userId} and fu = 1) or (followingId = #{userId} and uf = 1))
            ) a
            left join user u on u.id = a.id
            where 
                u.deleted=0
            <if test = 'username != null'>
                and u.username like concat('%',#{username}, '%')
            </if>
            <if test = 'nickname != null'>
                and u.nickname like concat('%',#{nickname}, '%')
            </if>
        </script>
    """
    )
    fun appFollowerWhoFollowMe(
        page: Page<AppFriendInfo>,
        @Param("userId") userId: Long,
        @Param("username") username: String?,
        @Param("nickname") nickname: String?
    ): Page<AppFriendInfo>

    @Select(
        """
        <script>
            select 
                a.*, u.username, u.nickname, u.bio, u.avatar
            from 
            (
                select 
                    IF(userId=#{userId}, followingId, userId) id, IF(uf + fu = 2, 'MUTUAL', 'FOLLOWING') followStatus,  IF(fu + uf = 2, 1, 0) as friend
                from 
                    follower f
                where 
                    f.deleted=0 and ( (userId = #{userId} and uf = 1) or (followingId = #{userId} and fu = 1) )
            ) a
            left join 
                user u on u.id=a.id
            where 
                u.deleted=0
            <if test = 'username != null'>
                and u.username like concat('%',#{username}, '%')
            </if>
            <if test = 'nickname != null'>
                and u.nickname like concat('%',#{nickname}, '%')
            </if>
        </script>
    """
    )
    fun appFollowerMyFollowing(
        page: Page<AppFriendInfo>,
        @Param("userId") userId: Long,
        @Param("username") username: String?,
        @Param("nickname") nickname: String?
    ): Page<AppFriendInfo>

    @Select(
        """
    <script> 
        select 
            a.*, u.username, u.nickname, u.bio, u.avatar
        from
        (
            select 
                IF(userId = #{userId}, followingId, userId) id, 'MUTUAL' as followStatus 
            from 
                follower f
            where 
                (userId=#{userId} or followingId=#{userId}) and uf=1 and fu=1
        ) a
        left join user u on u.id = a.id
        where u.deleted=0
        <if test = 'username != null'>
            and u.username like concat('%',#{username}, '%')
        </if>
        <if test = 'nickname != null'>
            and u.nickname like concat('%',#{nickname}, '%')
        </if>
    </script>
    """
    )
    fun appFollowerFriendsMutual(
       page:Page<AppFriendInfo>, @Param("userId") userId: Long, @Param("username") username: String?, @Param("nickname") nickname: String?
    ): Page<AppFriendInfo>

    @Select(
        """
        select distinct if(userId=#{id}, followingId, userId)
        from follower
        where deleted = 0
        and ((userId=#{id} and uf=1) || (followingId=#{id} and fu=1))
    """
    )
    fun getFollowingIdList(@Param("id") id: Long): List<String>


}
