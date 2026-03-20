package com.parsec.aika.user.config

import com.parsec.aika.user.config.NotificationMqConst.CHATROOM_NOTIFY_QUEUE
import com.parsec.aika.user.config.NotificationMqConst.CHATROOM_NOTIFY_ROUTE_KEY
import com.parsec.aika.user.config.NotificationMqConst.NOTIFY_EXCHANGE
import com.parsec.aika.user.config.NotificationMqConst.NOTIFY_QUEUE
import com.parsec.aika.user.config.NotificationMqConst.NOTIFY_ROUTE_KEY
import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class NotificationMqConfig {
    @Bean
    fun notifyExchange(): DirectExchange {
        return DirectExchange(NOTIFY_EXCHANGE)
    }

    @Bean
    fun notifyQueue(): Queue {
        return Queue(NOTIFY_QUEUE)
    }

    @Bean
    fun bindNotifyRouteKey(): Binding {
        return BindingBuilder.bind(notifyQueue()).to(notifyExchange()).with(NOTIFY_ROUTE_KEY)
    }

    @Bean
    fun chatroomNotifyQueue() = Queue(CHATROOM_NOTIFY_QUEUE)

    @Bean
    fun bindChatroomNotifyRouteKey(): Binding =
        BindingBuilder.bind(chatroomNotifyQueue()).to(notifyExchange()).with(CHATROOM_NOTIFY_ROUTE_KEY)
}

object NotificationMqConst {
    const val NOTIFY_EXCHANGE = "NOTIFY_EXCHANGE"
    const val NOTIFY_ROUTE_KEY = "NOTIFY_ROUTE_KEY"
    const val NOTIFY_QUEUE = "NOTIFY_QUEUE"

    const val CHATROOM_NOTIFY_ROUTE_KEY = "CHATROOM_NOTIFY_ROUTE_KEY"
    const val CHATROOM_NOTIFY_QUEUE = "CHATROOM_NOTIFY_QUEUE"
}