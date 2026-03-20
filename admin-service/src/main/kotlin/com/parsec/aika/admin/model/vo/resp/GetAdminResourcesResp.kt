package com.parsec.aika.admin.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.ResourceType

class GetAdminResourcesResp {
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null
    var name: String? = null
    @JsonSerialize(using = ToStringSerializer::class)
    var parentId: Long? = null
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
     * 排序号
     */
    var sortNo: Int? = null

    /**
     * 是否默认权限，默认权限无需分配所有账号默认拥有
     */
    var defaultResource: Boolean? = null

    var childrens: List<GetAdminResourcesResp>? = null
}