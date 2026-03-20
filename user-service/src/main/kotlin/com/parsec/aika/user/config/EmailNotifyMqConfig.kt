package com.parsec.aika.user.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class EmailNotifyMqConfig {

    @Bean
    fun emailNotifyExchange(): DirectExchange {
        return DirectExchange(EmailNotifyMqConst.EMAIL_NOTIFY_EXCHANGE)
    }

    @Bean
    fun emailNotifyFeedbackQueue(): Queue {
        return Queue(EmailNotifyMqConst.EMAIL_NOTIFY_FEEDBACK_QUEUE)
    }

    @Bean
    fun bindEmailNotifyFeedbackRouteKey(): Binding {
        return BindingBuilder.bind(emailNotifyFeedbackQueue()).to(emailNotifyExchange())
            .with(EmailNotifyMqConst.EMAIL_NOTIFY_FEEDBACK_ROUTE_KEY)
    }

    @Bean
    fun emailNotifyReportQueue(): Queue {
        return Queue(EmailNotifyMqConst.EMAIL_NOTIFY_REPORT_QUEUE)
    }

    @Bean
    fun bindEmailNotifyReportRouteKey(): Binding {
        return BindingBuilder.bind(emailNotifyReportQueue()).to(emailNotifyExchange())
            .with(EmailNotifyMqConst.EMAIL_NOTIFY_REPORT_ROUTE_KEY)
    }

}


object EmailNotifyMqConst {

    const val EMAIL_NOTIFY_EXCHANGE = "EMAIL_NOTIFY_EXCHANGE"
    const val EMAIL_NOTIFY_FEEDBACK_ROUTE_KEY = "EMAIL_NOTIFY_FEEDBACK_ROUTE_KEY"
    const val EMAIL_NOTIFY_FEEDBACK_QUEUE = "EMAIL_NOTIFY_FEEDBACK_QUEUE"
    const val EMAIL_NOTIFY_REPORT_ROUTE_KEY = "EMAIL_NOTIFY_REPORT_ROUTE_KEY"
    const val EMAIL_NOTIFY_REPORT_QUEUE = "EMAIL_NOTIFY_REPORT_QUEUE"

}