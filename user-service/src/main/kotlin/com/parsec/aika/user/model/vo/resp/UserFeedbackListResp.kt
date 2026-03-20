package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.user.model.entity.FeedbackStatus
import java.time.LocalDateTime

class UserFeedbackListResp {

    /**
     * 反馈id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 反馈消息状态：underReview, pending, rejected, completed, withdraw
     */
    var status: FeedbackStatus? = null

    /**
     * 提交时间
     */
    var submissionAt: LocalDateTime? = null

    /**
     * 反馈标题
     */
    var title: String? = null

}