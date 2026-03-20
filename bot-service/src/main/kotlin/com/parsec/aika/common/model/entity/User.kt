package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.FieldFill
import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import java.time.LocalDateTime

/**
 *
 * @TableName t_user
 */
@TableName(value = "t_user")
class User {
    /**
     * 用户id
     */
    @TableId
    var id: Long? = null

    /**
     * 用户头像
     */
    var avatar: String? = null

    /**
     * 用户名
     */
    var username: String? = null

    /**
     * 用户昵称
     */
    var nickname: String? = null

    /**
     * 用户简介
     */
    var bio: String? = null

    /**
     * 性别：MALE, HIDE, FEMALE
     */
    var gender: String? = null


    var status: String? = null

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
}