package com.parsec.aika.order.model.props

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Component

@RefreshScope
@Component
class FreedompayProps {

    @Value("\${freedompay.merchantId}")
    var merchantId: String? = null

    @Value("\${freedompay.secretKey}")
    var secretKey: String? = null

    @Value("\${freedompay.domain}")
    var domain: String? = null

    @Value("\${freedompay.initPayment}")
    var initPayment: String? = null

    @Value("\${freedompay.getStatus}")
    var getStatus: String? = null

    @Value("\${freedompay.resultUrl}")
    var resultUrl: String? = null

    @Value("\${freedompay.successUrl}")
    var successUrl: String? = null

    @Value("\${freedompay.failureUrl}")
    var failureUrl: String? = null


}