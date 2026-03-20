package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotNull


open class PostPushListReq {
    @NotNull
    var title: String? = null

    @NotNull
    var content: String? = null

    /**
     * 多个分组使用逗号分隔（groupId），全部：all
     */
    @NotNull
    var pushTo: String? = null

    /**
     * 是否声音提醒：0否，1是
     */
    @NotNull
    var soundAlert: Boolean? = null

    var jobId: Long? = null
}