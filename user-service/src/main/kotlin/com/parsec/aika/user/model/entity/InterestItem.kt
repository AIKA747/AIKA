package com.parsec.aika.user.model.entity

import com.alibaba.fastjson.JSONArray
import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.aspect.Translate
import com.parsec.aika.common.hander.JsonArrayTypeHandler
import com.parsec.aika.user.model.em.InterestItemType
import java.time.LocalDateTime

@Translate(fields = ["itemNameLab", "itemTypeLab"])
@TableName("interest_item", autoResultMap = true)
open class InterestItem {

    /**
     * id
     */
    @TableId(value = "id", type = IdType.AUTO)
    var id: Int? = null

    /**
     * 兴趣类型
     */
    var itemType: InterestItemType? = null

    /**
     * 兴趣名称
     */
    var itemName: String? = null

    /**
     *  备注
     */
    var remark: String? = null

    /**
     * 用来保证向量的准确性，默认填id号，在任何时候取升序排列
     */
    var orderNum: Int? = null

    /**
     * 是否支持多个选项
     */
    var multiple: Boolean? = null

    /**
     * 向量值，如果兴趣是单一选项，则为空
     */
    @TableField(value = "valueArray", typeHandler = JsonArrayTypeHandler::class)
    var valueArray: JSONArray? = null

    /**
     * 创建人
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 更新人
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var updater: Long? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null

    /**
     * 更新时间
     */
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


    /**
     * 兴趣名称
     */
    @TableField(exist = false)
    var itemNameLab: String? = null

    /**
     * 兴趣类型
     */
    @TableField(exist = false)
    var itemTypeLab: String? = null

}
