package com.parsec.aika.bot.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FollowRelationMqConfig {

    @Bean
    fun followRelationExchange(): DirectExchange {
        return DirectExchange(FollowRelationMqConst.FOLLOW_RELATION_EXCHANGE)
    }

    @Bean
    fun followBotRelationQueue(): Queue {
        return Queue(FollowRelationMqConst.FOLLOW_BOT_RELATION_QUEUE)
    }

    @Bean
    fun bindFollowBotRelationRouteKey(): Binding {
        return BindingBuilder.bind(followBotRelationQueue()).to(followRelationExchange())
            .with(FollowRelationMqConst.FOLLOW_BOT_RELATION_ROUTE_KEY)
    }

    @Bean
    fun unfollowBotRelationQueue(): Queue {
        return Queue(FollowRelationMqConst.UNFOLLOW_BOT_RELATION_QUEUE)
    }

    @Bean
    fun bindUnfollowBotRelationRouteKey(): Binding {
        return BindingBuilder.bind(unfollowBotRelationQueue()).to(followRelationExchange())
            .with(FollowRelationMqConst.UNFOLLOW_BOT_RELATION_ROUTE_KEY)
    }

}

object FollowRelationMqConst {
    const val FOLLOW_RELATION_EXCHANGE = "FOLLOW_RELATION_EXCHANGE"

    const val FOLLOW_BOT_RELATION_ROUTE_KEY = "FOLLOW_BOT_RELATION_ROUTE_KEY"
    const val FOLLOW_BOT_RELATION_QUEUE = "FOLLOW_BOT_RELATION_QUEUE"
    const val UNFOLLOW_BOT_RELATION_ROUTE_KEY = "UNFOLLOW_BOT_RELATION_ROUTE_KEY"
    const val UNFOLLOW_BOT_RELATION_QUEUE = "UNFOLLOW_BOT_RELATION_QUEUE"
}