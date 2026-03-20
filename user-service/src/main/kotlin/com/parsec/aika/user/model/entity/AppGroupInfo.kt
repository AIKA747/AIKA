package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.parsec.aika.common.model.entity.BaseDomain

@TableName("`group`")
class AppGroupInfo : BaseDomain() {

    /**
     * 用户组名
     */
    var groupName: String? = null

    /**
     * 用户数
     */
    var userCount: Long? = null

    /**
     * 创建人
     */
    var creator: String? = null

    /**
     * 更新人
     */
    var updater: String? = null

}