package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.AdminResource
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface ResourceMapper : BaseMapper<AdminResource> {

    @Select(
        """
        SELECT r.* FROM `resource` r 
        LEFT JOIN role_resource_rel rrr ON r.`id`=rrr.`resourceId`
        WHERE r.`deleted`=0 AND (r.`defaultResource`=1 OR rrr.`roleId`=#{roleId} )
        ORDER BY sortNo ASC
        """
    )
    fun queryRoleResources(@Param("roleId") roleId: Long?): List<AdminResource>

}