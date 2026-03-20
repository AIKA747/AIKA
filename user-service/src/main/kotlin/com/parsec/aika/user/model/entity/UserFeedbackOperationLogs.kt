package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.parsec.aika.common.model.em.UserTypeEnum
import java.time.LocalDateTime

@TableName("user_feedback_operation_log", autoResultMap = true)
class UserFeedbackOperationLogs {

    //    idbigint NOT NULL
    var id: Long? = null

    //    feedbackIdbigint NOT NULL反馈id
    var feedbackId: Long? = null

    //    statusvarchar(255) NOT NULL状态:underReview, pending, rejected, completed, withdraw
    var status: FeedbackStatus? = null

    //    userTypevarchar(255) NOT NULL操作用户类型
    var userType: UserTypeEnum? = null

    //    operationUserIdbigint NOT NULL操作人用户id
    var operationUserId: Long? = null

    //    operationUservarchar(255) NULL操作人昵称
    var operationUser: String? = null

    //    operationTimedatetime NOT NULL操作时间
    var operationTime: LocalDateTime? = null

    //    remarkvarchar(255) NULL备注
    var remark: String? = null

}
