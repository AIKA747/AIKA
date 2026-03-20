package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.TableName

@TableName("user_group_rel")
class UserGroupRel {

    /**
     * 用户组id
     */
    var groupId: Long? = null

    /**
     * 用户id
     */
    var userId: Long? = null

}