package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.admin.model.vo.req.GetOperationLogsReq
import com.parsec.aika.admin.model.vo.req.GetRolesReq
import com.parsec.aika.admin.model.vo.resp.GetOperationLogsResp
import com.parsec.aika.admin.model.vo.resp.GetRolesResp
import com.parsec.aika.common.model.entity.Role
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface RoleMapper: BaseMapper<Role> {


    @Select("""
        <script>
        select r.id, r.roleName, r.createdAt 
        from role as r 
        where r.deleted = 0 
        order by r.id desc 
        </script>
    """)
    fun getRoles(@Param("req") req: GetRolesReq): List<GetRolesResp>
}