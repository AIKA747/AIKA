package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.ResourceType
import com.parsec.trantor.mybatisplus.base.BaseDomain

@TableName("`resource`")
class AdminResource: BaseDomain() {

    /**
     * 菜单名称
     */
    var name: String? = null

    /**
     * 资源类型
     */
    var type: ResourceType? = null

    /**
     * 图标
     */
    var icon: String? = null

    /**
     * 前端功能页面路由
     */
    var route: String? = null

    /**
     * 功能点请求路径，多个路径使用逗号分隔
     */
    var paths: String? = null

    /**
     * 上级菜单ID
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var parentId: Long? = null

    /**
     * 排序号
     */
    var sortNo: Int? = null

    /**
     * 是否默认权限，默认权限无需分配所有账号默认拥有
     */
    var defaultResource: Boolean? = null

    /**
     * 创建人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 创建人名称
     */
    var creatorName: String? = null

    /**
     * 更新人
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var updater: Long? = null

}