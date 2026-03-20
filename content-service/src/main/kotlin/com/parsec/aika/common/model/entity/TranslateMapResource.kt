package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableLogic
import com.baomidou.mybatisplus.annotation.TableName
import java.io.Serializable
import java.time.LocalDateTime

/**
 * @TableName t_translate_map_resource
 */
@TableName(value = "t_translate_map_resource")
class TranslateMapResource : Serializable {
    /**
     *
     */
    @TableId(type = IdType.AUTO)
    var id: Int? = null

    /**
     * 语言对象唯一标识，标识相同表示同一个语义
     */
    var uuid: String? = null

    /**
     * 文本内容
     */
    var content: String? = null

    /**
     * 语言编码
     */
    var language: String? = null

    /**
     * 相同语言的文本值越大优先级越高
     */
    var sortNo: Int? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null

    /**
     * 是否删除：0否，1是
     */
    @TableLogic(delval = "1", value = "0")
    var deleted: Boolean? = null
}