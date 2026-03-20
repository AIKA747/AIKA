package com.parsec.aika.user.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SyncRelationMqConfig {

    @Bean
    fun relationExchange() = DirectExchange(SyncRelationMqConst.RELATION_EXCHANGE)

    @Bean
    fun userRelationQueue() = Queue(SyncRelationMqConst.USER_RELATION_QUEUE)

    @Bean
    fun bindUserRelationRouteKey(): Binding = BindingBuilder.bind(userRelationQueue()).to(relationExchange())
        .with(SyncRelationMqConst.USER_RELATION_ROUTE_KEY)
}

object SyncRelationMqConst {
    const val RELATION_EXCHANGE = "RELATION_EXCHANGE"
    const val USER_RELATION_ROUTE_KEY = "USER_RELATION_ROUTE_KEY"
    const val USER_RELATION_QUEUE = "USER_RELATION_QUEUE"
}