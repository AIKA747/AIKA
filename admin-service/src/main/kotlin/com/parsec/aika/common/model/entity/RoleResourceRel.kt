package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.trantor.mybatisplus.base.BaseDomain

@TableName("`role_resource_rel`")
class RoleResourceRel {

    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 角色id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var roleId: Long? = null

    /**
     * 资源id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var resourceId: Long? = null

}