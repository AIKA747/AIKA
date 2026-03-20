package com.parsec.aika.user.model.vo.req

import com.parsec.aika.user.model.entity.FeedbackStatus
import jakarta.validation.constraints.NotBlank
import org.springframework.format.annotation.DateTimeFormat

class FeedbackStatisticsReq {

    @NotBlank
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    var minSubmissionAt: String? = null

    @NotBlank
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    var maxSubmissionAt: String? = null

    var username: String? = null

    var status: FeedbackStatus? = null

    var titleValue: String? = null

}