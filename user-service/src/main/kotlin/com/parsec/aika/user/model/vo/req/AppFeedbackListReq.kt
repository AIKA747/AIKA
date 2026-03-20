package com.parsec.aika.user.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

/**
 * app端查询用户反馈列表
 */
class AppFeedbackListReq : PageVo() {
    var listType: String? = null
}