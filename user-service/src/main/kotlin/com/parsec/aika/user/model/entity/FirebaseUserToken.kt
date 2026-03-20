package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

@TableName("firebase_user_token")
class FirebaseUserToken {

    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null


    /**
     * userid
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * token
     */
    var token: String? = null

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null

    /**
     * 数据版本，每更新一次+1
     */
    @Version
    @TableField(fill = FieldFill.INSERT)
    var dataVersion: Int? = null

    /**
     * 是否删除：0否，1是
     */
    @TableLogic(value = "0", delval = "1")
    var deleted: Boolean? = null

}