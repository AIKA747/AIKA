package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.user.model.entity.AppGroupInfo
import com.parsec.aika.user.model.vo.req.GetManageGroupReq
import com.parsec.aika.user.model.vo.resp.GetManageGroupResp
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

interface AppGroupMapper : BaseMapper<AppGroupInfo> {
    @Select(
        """
        <script>
        select g.groupName, g.id, g.userCount, g.createdAt
        from `group` as g
        where g.deleted = 0
        <if test = 'req.groupName != null'>
        and g.groupName like concat('%', #{req.groupName}, '%')
        </if>
        order by g.id desc
        </script>
    """
    )
    fun getManageGroup(@Param("req") req: GetManageGroupReq): List<GetManageGroupResp>

    @Select(
        """
        <script>
        select g.groupName, g.id, g.userCount, g.createdAt
        from `group` as g
        where g.deleted = 0
        <if test = 'req.groupName != null'>
        and g.groupName like concat('%', #{req.groupName}, '%')
        </if>
        order by g.id desc
        </script>
    """
    )
    fun getManageGroup(page: Page<GetManageGroupResp>, @Param("req") req: GetManageGroupReq): Page<GetManageGroupResp>

    @Select(
        """
        <script>
        select if(count(g.id) > 0, 1, 0)
        from `group` as g 
        where g.deleted = 0 and g.groupName = #{groupName}
        <if test = 'id != null'> 
        and g.id &lt;&gt; #{id}
        </if>
        </script>
    """
    )
    fun checkGroupName(@Param("groupName") groupName: String, @Param("id") id: Long?): Boolean
}