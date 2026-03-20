package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.vo.AppUserVO
import com.parsec.aika.user.model.entity.AppUserInfo
import com.parsec.aika.user.model.vo.req.AppUserVectorVo
import com.parsec.aika.user.model.vo.req.ManageUserListReq
import com.parsec.aika.user.model.vo.req.VectorVo
import com.parsec.aika.user.model.vo.resp.ManagerUserListResp
import com.parsec.aika.user.model.vo.resp.VectorDto
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Result
import org.apache.ibatis.annotations.Results
import org.apache.ibatis.annotations.Select

interface AppUserMapper : BaseMapper<AppUserInfo> {


    @Select(
        """
        <script>
        select u.id, u.username, u.phone, u.email, u.gender, u.status, u.createdAt,u.nickname,u.avatar
        from `user` as u
        where u.deleted = 0 and u.status in ('enabled', 'disabled', 'uncompleted')
        <if test = 'req.username != null'>
        and u.username like concat('%', #{req.username}, '%')
        </if>
        <if test = 'req.status != null'>
        and u.status = #{req.status}
        </if>
        <if test = 'req.groupId != null'>
        AND u.`id` IN (SELECT userId FROM user_group_rel WHERE groupId=#{req.groupId})
        </if>
        <if test = 'req.phone != null'>
        and u.phone like concat('%', #{req.phone}, '%')
        </if>
        <if test = 'req.email != null'>
        and u.email like concat('%', #{req.email}, '%')
        </if>
        <if test = 'req.gender != null'>
        and u.gender = #{req.gender}
        </if>
        <if test = 'req.country != null'>
        and u.country like concat('%', #{req.country}, '%')
        </if>
        <if test = 'req.tags != null'>
        and json_contains(u.tags, CONCAT('"',#{req.tags},'"'))
        </if>
        <if test = 'req.minCreatedAt != null'>
            and u.createdAt &gt;= #{req.minCreatedAt}
        </if>
        <if test = 'req.maxCreatedAt != null'>
            and u.createdAt &lt;= #{req.maxCreatedAt}
        </if>
        group by u.id
        order by u.id desc
        </script>
    """
    )
    fun manageUserList(@Param("req") req: ManageUserListReq): List<ManagerUserListResp>

    @Select(
        """
        <script>
        select u.id, u.username, u.phone, u.email, u.gender, u.status, u.createdAt,u.nickname,u.avatar
        from `user` as u
        where u.deleted = 0 and u.status in ('enabled', 'disabled', 'uncompleted')
        <if test = 'req.username != null'>
        and u.username like concat('%', #{req.username}, '%')
        </if>
        <if test = 'req.status != null'>
        and u.status = #{req.status}
        </if>
        <if test = 'req.groupId != null'>
        AND u.`id` IN (SELECT userId FROM user_group_rel WHERE groupId=#{req.groupId})
        </if>
        <if test = 'req.phone != null'>
        and u.phone like concat('%', #{req.phone}, '%')
        </if>
        <if test = 'req.email != null'>
        and u.email like concat('%', #{req.email}, '%')
        </if>
        <if test = 'req.gender != null'>
        and u.gender = #{req.gender}
        </if>
        <if test = 'req.country != null'>
        and u.country like concat('%', #{req.country}, '%')
        </if>
        <if test = 'req.tags != null'>
        and json_contains(u.tags, CONCAT('"',#{req.tags},'"'))
        </if>
        <if test = 'req.minCreatedAt != null'>
            and u.createdAt &gt;= #{req.minCreatedAt}
        </if>
        <if test = 'req.maxCreatedAt != null'>
            and u.createdAt &lt;= #{req.maxCreatedAt}
        </if>
        group by u.id
        order by u.id desc
        </script>
    """
    )
    fun manageUserList(page: Page<ManagerUserListResp>, @Param("req") req: ManageUserListReq): Page<ManagerUserListResp>

    @Select(
        """
        <script>
            select country from user where status in ('enabled', 'disabled', 'uncompleted') group by country
        </script>
    """
    )
    fun endPointUserCountryList(): List<String>


    @Select(
        """
        <script>
    
             SELECT user_with_distance.id,user_with_distance.username,user_with_distance.nickname,user_with_distance.avatar,user_with_distance.status,
        user_with_distance.phone,user_with_distance.email,user_with_distance.country,user_with_distance.language, (SQRT(
            <foreach item="item" collection="param.sport" open="(" close=")" separator="+">
                pow( #{item.value} - (CASE 
                 WHEN JSON_EXTRACT(sport, concat('\${'$'}.','\"',#{item.key},'\"')) is not null THEN JSON_EXTRACT(sport, concat('\${'$'}.','\"',#{item.key},'\"'))
                ELSE 0
            END) , 2) 
            </foreach> 
        ) * 0.125 / #{param.sportMaxDistance})
        + (SQRT(
            <foreach item="item" collection="param.entertainment" open="(" close=")" separator="+">
                pow( #{item.value} - (CASE 
                 WHEN JSON_EXTRACT(entertainment, concat('\${'$'}.','\"',#{item.key},'\"')) IS NOT NULL THEN JSON_EXTRACT(entertainment, concat('\${'$'}.','\"',#{item.key},'\"'))
                ELSE 0
            END) , 2) 
            </foreach> 
        ) * 0.125 / #{param.entertainmentMaxDistance})
         +(SQRT(
            <foreach item="item" collection="param.news" open="(" close=")" separator="+">
                pow( #{item.value} - (CASE 
                 WHEN JSON_EXTRACT(news, concat('\${'$'}.','\"',#{item.key},'\"')) IS NOT NULL THEN JSON_EXTRACT(news, concat('\${'$'}.','\"',#{item.key},'\"'))
                ELSE 0
            END) , 2) 
            </foreach> 
        ) *0.125 / #{param.newsMaxDistance})
        + (SQRT(
            <foreach item="item" collection="param.gaming" open="(" close=")" separator="+">
                pow( #{item.value} - (CASE 
                 WHEN JSON_EXTRACT(gaming, concat('\${'$'}.','\"',#{item.key},'\"')) IS NOT NULL THEN JSON_EXTRACT(gaming, concat('\${'$'}.','\"',#{item.key},'\"'))
                ELSE 0
            END) , 2) 
            </foreach> 
        ) * 0.125 / #{param.gamingMaxDistance})
        + (SQRT(
            <foreach item="item" collection="param.artistic" open="(" close=")" separator="+">
                pow( #{item.value} - (CASE 
                 WHEN JSON_EXTRACT(artistic, concat('\${'$'}.','\"',#{item.key},'\"')) IS NOT NULL THEN JSON_EXTRACT(artistic, concat('\${'$'}.','\"',#{item.key},'\"'))
                ELSE 0
            END) , 2) 
            </foreach> 
        ) * 0.125 / #{param.artisticMaxDistance})
        + (SQRT(
            <foreach item="item" collection="param.lifestyle" open="(" close=")" separator="+">
                pow( #{item.value} - (CASE 
                 WHEN JSON_EXTRACT(lifestyle, concat('\${'$'}.','\"',#{item.key},'\"')) IS NOT NULL THEN JSON_EXTRACT(lifestyle, concat('\${'$'}.','\"',#{item.key},'\"'))
                ELSE 0
            END) , 2) 
            </foreach> 
        ) * 0.125 / #{param.lifestyleMaxDistance})
        + (SQRT(
            <foreach item="item" collection="param.technology" open="(" close=")" separator="+">
                pow( #{item.value} - (CASE 
                 WHEN JSON_EXTRACT(technology, concat('\${'$'}.','\"',#{item.key},'\"')) IS NOT NULL THEN JSON_EXTRACT(technology, concat('\${'$'}.','\"',#{item.key},'\"'))
                ELSE 0
            END) , 2) 
            </foreach> 
        ) * 0.125 / #{param.technologyMaxDistance})
        + (SQRT(
            <foreach item="item" collection="param.social" open="(" close=")" separator="+">
                pow( #{item.value} - (CASE 
                 WHEN JSON_EXTRACT(social, concat('\${'$'}.','\"',#{item.key},'\"')) IS NOT NULL THEN JSON_EXTRACT(social, concat('\${'$'}.','\"',#{item.key},'\"'))
                ELSE 0
            END) , 2) 
            </foreach> 
        ) * 0.125 / #{param.socialMaxDistance})  as distance 
  FROM user  user_with_distance left join follower f on
           (f.userId = #{param.id} and f.followingId * f.uf = user_with_distance.id) or 
           (f.followingId=#{param.id} and f.userId * f.fu = user_with_distance.id)
            where f.id is null and user_with_distance.id !=#{param.id} and user_with_distance.deleted = 0 and user_with_distance.status ='enabled'   
          order by distance asc  limit 0,100
        </script>
    """
    )
    fun selectUserWithDistance(@Param("param") userVectorVo: AppUserVectorVo): List<AppUserVO>

    @Select(
        """
    <script>    
    SELECT (SQRT(
            <foreach item="item" collection="param.vector" open="(" close=")" separator="+">
                pow( #{item.value} - (CASE 
                 WHEN JSON_EXTRACT(`\${'$'}{param.type}`, concat('${'$'}.','\"',#{item.key},'\"')) IS NOT NULL THEN JSON_EXTRACT(`\${'$'}{param.type}`, concat('${'$'}.','\"',#{item.key},'\"'))
                ELSE 0
            END) , 2) 
            </foreach> 
        ) ) as distance FROM user order by distance desc limit 0,1
    </script>
    """
    )
    fun getTypeMaxDistance(@Param("param") param: VectorVo): Double


    @Results(
        Result(property = "vector", column = "vector", typeHandler = JacksonTypeHandler::class),
    )
    @Select("select count(id) as num,`\${type}` as vector from user where `\${type}` is not null group by `\${type}` order by num desc limit 0,10")
    fun selectTopUserOfInterestType(@Param("type") type: String): List<VectorDto>

}
