package com.parsec.aika.user.model.vo.resp

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.user.model.entity.FeedbackStatus
import com.parsec.aika.user.model.entity.UserFeedbackOperationLogs
import java.time.LocalDateTime

class UserFeedbackDetailResp {

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
     * description text NOT NULL反馈详情
     */
    var description: String? = null

    /**
     * images text NULL图片列表
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var images: List<String>? = null

    /**
     * video text NULL视频
     */
    var video: String? = null

    /**
     * status varchar(20) NOT NULL反馈消息状态：waiting,replied,readReplied
     */
    var status: FeedbackStatus? = null

    /**
     * submissionAt datetime NOT
     */
    var submissionAt: LocalDateTime? = null

    /**
     * replyAt datetime NULL回复时间
     */
    var replyAt: LocalDateTime? = null

    /**
     * replyContent text NULL回复内容
     */
    var replyContent: String? = null

    /**
     * replyImages text NULL回复图片列表
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var replyImages: List<String>? = null

    var iuessId: String? = null

    var adminId: Long? = null

    var operationLogs: List<UserFeedbackOperationLogs>? = null

}