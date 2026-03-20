package com.parsec.aika.chat.config

import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_ASSISTANT_MSG_UP_QUEUE
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_ASSISTANT_MSG_UP_ROUTE_KEY
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_BOT_MSG_UP_QUEUE
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_BOT_MSG_UP_ROUTE_KEY
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_GAME_MSG_UP_QUEUE
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_GAME_MSG_UP_ROUTE_KEY
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_GROUP_MSG_UP_QUEUE
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_GROUP_MSG_UP_ROUTE_KEY
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_MSG_DIRECT_EXCHANGE
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_MSG_DOWN_QUEUE
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_MSG_DOWN_ROUTE_KEY
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_STORY_MSG_UP_QUEUE
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_STORY_MSG_UP_ROUTE_KEY
import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class RabbitMQConfig {

    @Bean
    fun exchangeDirect(): DirectExchange {
        return DirectExchange(CHAT_MSG_DIRECT_EXCHANGE)
    }

    @Bean
    fun assistantMsgUpQueue(): Queue {
        return Queue(CHAT_ASSISTANT_MSG_UP_QUEUE)
    }

    @Bean
    fun assistantMsgUpRouteKey(): Binding {
        return BindingBuilder.bind(assistantMsgUpQueue()).to(exchangeDirect()).with(CHAT_ASSISTANT_MSG_UP_ROUTE_KEY)
    }

    @Bean
    fun botMsgUpQueue(): Queue {
        return Queue(CHAT_BOT_MSG_UP_QUEUE)
    }

    @Bean
    fun botMsgUpRouteKey(): Binding {
        return BindingBuilder.bind(botMsgUpQueue()).to(exchangeDirect()).with(CHAT_BOT_MSG_UP_ROUTE_KEY)
    }

    @Bean
    fun storyMsgUpQueue(): Queue {
        return Queue(CHAT_STORY_MSG_UP_QUEUE)
    }

    @Bean
    fun storyMsgUpRouteKey(): Binding {
        return BindingBuilder.bind(storyMsgUpQueue()).to(exchangeDirect()).with(CHAT_STORY_MSG_UP_ROUTE_KEY)
    }

    @Bean
    fun gameMsgUpQueue(): Queue {
        return Queue(CHAT_GAME_MSG_UP_QUEUE)
    }

    @Bean
    fun gameMsgUpRouteKey(): Binding {
        return BindingBuilder.bind(gameMsgUpQueue()).to(exchangeDirect()).with(CHAT_GAME_MSG_UP_ROUTE_KEY)
    }

    @Bean
    fun groupMsgUpQueue(): Queue {
        return Queue(CHAT_GROUP_MSG_UP_QUEUE)
    }

    @Bean
    fun groupMsgUpRouteKey(): Binding {
        return BindingBuilder.bind(groupMsgUpQueue()).to(exchangeDirect()).with(CHAT_GROUP_MSG_UP_ROUTE_KEY)
    }

    @Bean
    fun msgDownQueueQueue(): Queue {
        return Queue(CHAT_MSG_DOWN_QUEUE)
    }

    @Bean
    fun msgDownRouteKey(): Binding {
        return BindingBuilder.bind(msgDownQueueQueue()).to(exchangeDirect()).with(CHAT_MSG_DOWN_ROUTE_KEY)
    }

}