package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.user.model.entity.FeedbackStatus
import java.time.LocalDateTime

class UserFeedbackManageListResp {

    /**
     * 反馈id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * userId bigint NOT NULL用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * username varchar(255) NULL用户昵称
     */
    var username: String? = null

    /**
     * email varchar(255) NULL用户邮箱
     */
    var email: String? = null

    /**
     * device varchar(255) NULL设备
     */
    var device: String? = null

    /**
     *systemVersion varchar(255) NULL系统版本
     */
    var systemVersion: String? = null

    /**
     * category varchar(255) NOT NULL反馈类型
     */
    var category: String? = null

    /**
     * title varchar(255) NOT NULL反馈标题
     */
    var title: String? = null

    var titleValue: String? = null

    /**
     * status varchar(20) NOT NULL反馈消息状态：waiting,replied,readReplied
     */
    var status: FeedbackStatus? = null

    /**
     * submissionAt datetime NOT
     */
    var submissionAt: LocalDateTime? = null
}