package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.*
import java.time.LocalDateTime

@TableName("sensitive_file")
class SensitiveFile {

    @TableId(value = "id", type = IdType.AUTO)
    var id: Int? = null

    /**
     * 文件链接
     */
    var fileUrl: String? = null

    /**
     * 检测分数
     */
    var score: Double? = null

    /**
     * 上传者
     */
    var creator: Long? = null

    /**
     * 上传地址
     */
    var ip: String? = null

    /**
     * 铭感标签信息
     */
    var labels: String? = null

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null
}