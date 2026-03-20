package com.parsec.aika.common.model.constant

object RedisCont {

    /**
     * 登录用户状态校验
     */
    var USER_INFO = "login:user:"

    /**
     * 用户在线标识
     * arg0:用户id
     */
    const val CHAT_USER_ONLINE_FLAG = "user:online:{}"

    const val FEEDBACK_EMAILS = "FEEDBACK_EMAILS"

    const val REPORT_EMAILS = "REPORT_EMAILS"
}