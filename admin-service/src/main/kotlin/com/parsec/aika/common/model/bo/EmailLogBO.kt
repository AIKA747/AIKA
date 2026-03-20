package com.parsec.aika.common.model.bo

import java.time.LocalDateTime

class EmailLogBO {

    /**
     * 邮箱地址
     */
    var email: String? = null

    /**
     * 主题
     */
    var subject: String? = null

    /**
     * 邮件内容
     */
    var content: String? = null

    var status: String? = null

    var sendTime: LocalDateTime? = null
}