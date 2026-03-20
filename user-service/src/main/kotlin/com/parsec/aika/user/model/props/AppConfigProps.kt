package com.parsec.aika.user.model.props

import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Component

@RefreshScope
@Component
class AppConfigProps {

    /**
     * 是否开启google登陆
     */
    @Value("\${app.config.googleLogin:false}")
    var googleLogin: Boolean? = null

    /**
     * 非订阅用户免费聊天次数
     */
    @Value("\${app.user.chat.freeCount:3}")
    var freeCount: Int? = null

}