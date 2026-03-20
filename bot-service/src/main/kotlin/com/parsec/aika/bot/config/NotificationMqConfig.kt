package com.parsec.aika.bot.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class NotificationMqConfig {

    @Bean
    fun notifyExchange() = DirectExchange(NotificationMqConst.NOTIFY_EXCHANGE)

    @Bean
    fun chatroomNotifyQueue() = Queue(NotificationMqConst.CHATROOM_NOTIFY_QUEUE)

    @Bean
    fun bindChatroomNotifyRouteKey(): Binding = BindingBuilder.bind(chatroomNotifyQueue()).to(notifyExchange())
        .with(NotificationMqConst.CHATROOM_NOTIFY_ROUTE_KEY)

}

object NotificationMqConst {
    const val NOTIFY_EXCHANGE = "NOTIFY_EXCHANGE"
    const val CHATROOM_NOTIFY_ROUTE_KEY = "CHATROOM_NOTIFY_ROUTE_KEY"
    const val CHATROOM_NOTIFY_QUEUE = "CHATROOM_NOTIFY_QUEUE"
}