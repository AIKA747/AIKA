package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

@TableName("`push_list`")
class PushList {

    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 标题
     */
    var title: String? = null

    /**
     * 内容
     */
    var content: String? = null

    /**
     * 多个分组使用逗号分隔（groupId），全部：all
     */
    var pushTo: String? = null

    /**
     * 是否声音提醒：0否，1是
     */
    var soundAlert: Boolean? = null

    /**
     * 操作者
     */
    var operator: String? = null

    /**
     * 接收到送达消息数
     */
    var received: Int? = null

    /**
     * 推送用户数
     */
    var pushTotal: Int? = null

    /**
     * 推送时间
     */
    var pushTime: LocalDateTime? = null

    /**
     * 推送任务id
     */
    var jobId: Long? = null

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

}