package com.parsec.aika.bot.config

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
    fun botRelationQueue() = Queue(SyncRelationMqConst.BOT_RELATION_QUEUE)

    @Bean
    fun bindBotRelationRouteKey(): Binding =
        BindingBuilder.bind(botRelationQueue()).to(relationExchange()).with(SyncRelationMqConst.BOT_RELATION_ROUTE_KEY)

}

object SyncRelationMqConst {
    const val RELATION_EXCHANGE = "RELATION_EXCHANGE"
    const val BOT_RELATION_ROUTE_KEY = "BOT_RELATION_ROUTE_KEY"
    const val BOT_RELATION_QUEUE = "BOT_RELATION_QUEUE"
}