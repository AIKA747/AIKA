package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

@TableName("`third_platform`")
class ThirdPlatform {

    /**
     * id bigint unsigned NOT NULL主键id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * platform varchar(255) NOT NULLgoogle,wx,alipay
     */
    var platform: PlatformType? = null

    /**
     * platformId varchar(255) NOT NULL第三方平台唯一标识
     */
    var platformId: String? = null

    /**
     * userId bigint NOT NULL用户id
     */
    var userId: Long? = null

    /**
     * createdAt datetime NOT NULL
     */
    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    /**
     * updatedAt datetime NOT NULL
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null

}

enum class PlatformType {
    aika, google, apple, facebook
}