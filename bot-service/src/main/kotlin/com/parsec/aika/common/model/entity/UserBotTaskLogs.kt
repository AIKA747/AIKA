package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import java.io.Serializable
import java.time.LocalDateTime

@TableName("user_bot_task_logs")
class UserBotTaskLogs : Serializable {

    @TableId(type = IdType.AUTO)
    var id: Int? = null

    var taskId: Int? = null

    var taskCron: String? = null

    var excutedAt: LocalDateTime? = null

    var excutedEndAt: LocalDateTime? = null

    var executeTime: Long? = null

    var success: Boolean? = null

    var failMsg: String? = null
}