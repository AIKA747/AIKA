package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

class ManageTagsListVo {

    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 标签排序，升序排列
     */
    var sortNo: Int? = null

    /**
     * 标签名称
     */
    var tagName: String? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null

}