package com.parsec.aika.gateway.props

import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Component

@RefreshScope
@Component
class GatewayProps {

    @Value("\${jwt.key}")
    var jwtKey: String? = null

    @Value("\${custom.systemSwitch:false}")
    var systemSwitch: Boolean? = false

    @Value("\${custom.systemMessage:}")
    var systemMessage: String? = null

}