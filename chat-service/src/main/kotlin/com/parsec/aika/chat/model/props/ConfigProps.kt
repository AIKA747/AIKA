package com.parsec.aika.chat.model.props

import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Component

@Component
@RefreshScope
class ConfigProps {
    @Value("\${jwt.key}")
    var jwtKey: String? = null

    @Value("\${mqtt.botTopic}")
    var botTopic: String? = null

    @Value("\${mqtt.userTopic}")
    var userTopic: String? = null

    @Value("\${mqtt.qos}")
    var qos: Int? = null

    @Value("\${mqtt.connTest:false}")
    var connTest: Boolean? = null

    @Value("\${mqtt.clientId}")
    var clientId: String? = null

    @Value("\${mqtt.broker}")
    var broker: String? = null

    @Value("\${mqtt.username}")
    var username: String? = null

    @Value("\${mqtt.password}")
    var password: String? = null
}