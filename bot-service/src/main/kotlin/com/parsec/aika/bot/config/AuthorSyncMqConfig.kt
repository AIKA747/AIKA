package com.parsec.aika.bot.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AuthorSyncMqConfig {
    @Bean
    fun authorSyncExchange(): DirectExchange {
        return DirectExchange(AuthorSyncMqConst.AUTHOR_SYNC_EXCHANGE)
    }

    @Bean
    fun authorBotSyncQueue(): Queue {
        return Queue(AuthorSyncMqConst.AUTHOR_SYNC_BOT_QUEUE)
    }

    @Bean
    fun bindAuthorBotSyncRouteKey(): Binding {
        return BindingBuilder.bind(authorBotSyncQueue()).to(authorSyncExchange())
            .with(AuthorSyncMqConst.AUTHOR_SYNC_BOT_ROUTE_KEY)
    }

    @Bean
    fun groupMemberSyncQueue(): Queue {
        return Queue(AuthorSyncMqConst.GROUP_MEMBER_SYNC_USER_QUEUE)
    }

    @Bean
    fun bindGroupBotMemberSyncRouteKey(): Binding {
        return BindingBuilder.bind(groupMemberSyncQueue()).to(authorSyncExchange())
            .with(AuthorSyncMqConst.AUTHOR_SYNC_BOT_ROUTE_KEY)
    }

}

object AuthorSyncMqConst {
    const val AUTHOR_SYNC_EXCHANGE = "AUTHOR_SYNC_EXCHANGE"

    const val AUTHOR_SYNC_BOT_ROUTE_KEY = "AUTHOR_SYNC_BOT_ROUTE_KEY"

    const val AUTHOR_SYNC_BOT_QUEUE = "AUTHOR_SYNC_BOT_QUEUE"
    const val GROUP_MEMBER_SYNC_USER_QUEUE = "GROUP_MEMBER_SYNC_USER_QUEUE"

}
