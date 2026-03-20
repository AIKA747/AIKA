package com.parsec.aika.order.config

import com.parsec.aika.order.config.RabbitmqConst.OPERATION_LOG_EXCHANGE
import com.parsec.aika.order.config.RabbitmqConst.OPERATION_LOG_QUEUE
import com.parsec.aika.order.config.RabbitmqConst.OPERATION_LOG_ROUTE_KEY
import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RabbitMQConfig {

    @Bean
    fun operationLogExchange(): DirectExchange {
        return DirectExchange(OPERATION_LOG_EXCHANGE)
    }

    @Bean
    fun operationLogQueue(): Queue {
        return Queue(OPERATION_LOG_QUEUE)
    }

    @Bean
    fun operationLogRouteKey(): Binding {
        return BindingBuilder.bind(operationLogQueue()).to(operationLogExchange()).with(OPERATION_LOG_ROUTE_KEY)
    }

}

object RabbitmqConst {

    /**
     * 日志记录
     */
    const val OPERATION_LOG_EXCHANGE = "OPERATION_LOG_EXCHANGE"
    const val OPERATION_LOG_ROUTE_KEY = "OPERATION_LOG_ROUTE_KEY"
    const val OPERATION_LOG_QUEUE = "OPERATION_LOG_QUEUE"
}