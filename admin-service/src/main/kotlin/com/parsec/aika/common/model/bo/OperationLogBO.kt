package com.parsec.aika.common.model.bo

import java.time.LocalDateTime

class OperationLogBO {

    /**
     * 管理员id
     */
    var adminId: Long? = null

    /**
     * 管理员名称
     */
    var adminName: String? = null

    /**
     * 模块名称
     */
    var module: String? = null

    /**
     * 记录标识
     */
    var record: String? = null

    /**
     * 原始值
     */
    var initialValue: String? = null

    /**
     * 最终值
     */
    var finalValue: String? = null

    /**
     * 操作时间
     */
    var operatedTime: LocalDateTime? = null

    /**
     * 操作类型：add,signIn,edit,delete
     */
    var action: String? = null

    var ip: String? = null

    var path: String? = null


}