package com.parsec.aika.content.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class NoticeMessageMqConfig {

    @Bean
    fun noticeMessageExchange() = DirectExchange(NoticeMessageMqConst.NOTICE_MESSAGE_EXCHANGE)

    @Bean
    fun userNoticeMessageQueue() = Queue(NoticeMessageMqConst.USER_NOTICE_MESSAGE_QUEUE)

    @Bean
    fun bindUserNoticeMessageRouteKey(): Binding =
        BindingBuilder.bind(userNoticeMessageQueue()).to(noticeMessageExchange())
            .with(NoticeMessageMqConst.USER_NOTICE_MESSAGE_ROUTE_KEY)

    @Bean
    fun botNoticeMessageQueue() = Queue(NoticeMessageMqConst.BOT_NOTICE_MESSAGE_QUEUE)

    @Bean
    fun bindBotNoticeMessageRouteKey(): Binding =
        BindingBuilder.bind(botNoticeMessageQueue()).to(noticeMessageExchange())
            .with(NoticeMessageMqConst.BOT_NOTICE_MESSAGE_ROUTE_KEY)
}


object NoticeMessageMqConst {

    const val NOTICE_MESSAGE_EXCHANGE = "NOTICE_MESSAGE_EXCHANGE"
    const val USER_NOTICE_MESSAGE_ROUTE_KEY = "USER_NOTICE_MESSAGE_ROUTE_KEY"
    const val USER_NOTICE_MESSAGE_QUEUE = "USER_NOTICE_MESSAGE_QUEUE"
    const val BOT_NOTICE_MESSAGE_ROUTE_KEY = "BOT_NOTICE_MESSAGE_ROUTE_KEY"
    const val BOT_NOTICE_MESSAGE_QUEUE = "BOT_NOTICE_MESSAGE_QUEUE"
}