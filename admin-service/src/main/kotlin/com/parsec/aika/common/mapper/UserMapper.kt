package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.admin.model.vo.req.ManageUserQueryVo
import com.parsec.aika.admin.model.vo.resp.ManageUserListVo
import com.parsec.aika.admin.model.vo.resp.AdminUserResp
import com.parsec.aika.common.model.entity.User
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface UserMapper: BaseMapper<User> {

    @Select("""
        <script>
            select 
                u.id as userId, u.username, u.nickname, u.avatar, u.roleId, r.roleName 
            from user u left join role r on u.roleId = r.id 
            where u.deleted = 0 and u.id = #{userId}
        </script>
    """)
    fun userInfo(@Param("userId") userId: Long): AdminUserResp

    @Select("""
        <script>
            select 
                u.id, u.username, u.nickname, u.avatar, u.roleId, r.roleName, u.createdAt, u.userStatus
            from user u left join role r on u.roleId = r.id 
            where u.deleted = 0 
            <if test='req.nickname != null'>
                and u.nickname like concat('%', #{req.nickname}, '%')
            </if>
            <if test='req.username != null'>
                and u.username like concat('%', #{req.username}, '%')
            </if>
            <if test='req.roleId != null'>
                and u.roleId = #{req.roleId}
            </if>
            <if test='req.maxCreatedTime != null and req.minCreatedTime != null'>
                and (UNIX_TIMESTAMP(u.createdAt) >= UNIX_TIMESTAMP(#{req.minCreatedTime}) 
                        and UNIX_TIMESTAMP(#{req.maxCreatedTime}) >= UNIX_TIMESTAMP(u.createdAt))
            </if>
        </script>
    """)
    fun users(@Param("req") queryVo: ManageUserQueryVo): List<ManageUserListVo>

}