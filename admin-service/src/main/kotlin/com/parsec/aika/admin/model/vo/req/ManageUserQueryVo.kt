package com.parsec.aika.admin.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

class ManageUserQueryVo: PageVo() {

    /**
     * 创建时间段查询，结束时间
     */
    var maxCreatedTime: String? = null

    /**
     * 创建时间段查询，开始时间
     */
    var minCreatedTime: String? = null

    /**
     * 用户昵称
     */
    var nickname: String? = null

    /**
     * 角色id
     */
    var roleId: Long? = null

    /**
     * 用户账户
     */
    var username: String? = null

}