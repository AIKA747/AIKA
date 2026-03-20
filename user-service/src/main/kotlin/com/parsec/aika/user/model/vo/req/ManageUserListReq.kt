package com.parsec.aika.user.model.vo.req

import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.user.model.em.Gender

/**
 * 用户列表
 */
class ManageUserListReq : PageVo() {

    /**
     * 用户名
     */
    var username: String? = null

    /**
     * 状态
     */
    var status: UserStatus? = null

    /**
     * 用户组id
     */
    var groupId: Long? = null

    /**
     * 手机号
     */
    var phone: String? = null

    /**
     * 邮箱
     */
    var email: String? = null

    /**
     * 性别
     */
    var gender: Gender? = null

    /**
     * 国家
     */
    var country: String? = null

    /**
     * 标签
     */
    var tags: String? = null

    /**
     * 创建时间开始结束
     */
    var minCreatedAt: String? = null
    var maxCreatedAt: String? = null

}