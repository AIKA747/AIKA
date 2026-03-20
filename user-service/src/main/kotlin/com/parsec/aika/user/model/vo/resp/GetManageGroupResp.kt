package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime


class GetManageGroupResp {

    /**
     * name
     */
    var groupName: String? = null

    /**
     * id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 人数
     */
    var userCount: Int? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null
}