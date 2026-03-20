package com.parsec.aika.content.config

import com.parsec.aika.content.config.RabbitmqConst.CHAT_MSG_DIRECT_EXCHANGE
import com.parsec.aika.content.config.RabbitmqConst.CHAT_MSG_DOWN_QUEUE
import com.parsec.aika.content.config.RabbitmqConst.CHAT_MSG_DOWN_ROUTE_KEY
import com.parsec.aika.content.config.RabbitmqConst.CHAT_STORY_MSG_UP_QUEUE
import com.parsec.aika.content.config.RabbitmqConst.CHAT_STORY_MSG_UP_ROUTE_KEY
import com.parsec.aika.content.config.RabbitmqConst.OPERATION_LOG_EXCHANGE
import com.parsec.aika.content.config.RabbitmqConst.OPERATION_LOG_QUEUE
import com.parsec.aika.content.config.RabbitmqConst.OPERATION_LOG_ROUTE_KEY
import com.parsec.aika.content.config.RabbitmqConst.USER_COUNT_DIRECT_EXCHANGE
import com.parsec.aika.content.config.RabbitmqConst.USER_NOTIFY_EXCHANGE
import com.parsec.aika.content.config.RabbitmqConst.USER_NOTIFY_QUEUE
import com.parsec.aika.content.config.RabbitmqConst.USER_NOTIFY_ROUTE_KEY
import com.parsec.aika.content.config.RabbitmqConst.USER_STORIES_INFO_QUEUE
import com.parsec.aika.content.config.RabbitmqConst.USER_STORIES_INFO_ROUTE_KEY
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
        return DirectExchange(USER_COUNT_DIRECT_EXCHANGE)
    }

    @Bean
    fun userStoriesInfoQueue(): Queue {
        return Queue(USER_STORIES_INFO_QUEUE)
    }

    @Bean
    fun bindUserStoriesCountRouteKey(): Binding {
        return BindingBuilder.bind(userStoriesInfoQueue()).to(exchangeDirect()).with(USER_STORIES_INFO_ROUTE_KEY)
    }

    @Bean
    fun chatExchangeDirect(): DirectExchange {
        return DirectExchange(CHAT_MSG_DIRECT_EXCHANGE)
    }

    @Bean
    fun storyMsgUpQueue(): Queue {
        return Queue(CHAT_STORY_MSG_UP_QUEUE)
    }

    @Bean
    fun storyMsgUpRouteKey(): Binding {
        return BindingBuilder.bind(storyMsgUpQueue()).to(chatExchangeDirect()).with(CHAT_STORY_MSG_UP_ROUTE_KEY)
    }

    @Bean
    fun msgDownQueueQueue(): Queue {
        return Queue(CHAT_MSG_DOWN_QUEUE)
    }

    @Bean
    fun msgDownRouteKey(): Binding {
        return BindingBuilder.bind(msgDownQueueQueue()).to(chatExchangeDirect()).with(CHAT_MSG_DOWN_ROUTE_KEY)
    }

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

    @Bean
    fun userNotifyExchange(): DirectExchange {
        return DirectExchange(USER_NOTIFY_EXCHANGE)
    }

    @Bean
    fun userNotifyQueue(): Queue {
        return Queue(USER_NOTIFY_QUEUE)
    }

    @Bean
    fun bindUserNotifyRouteKey(): Binding {
        return BindingBuilder.bind(userNotifyQueue()).to(userNotifyExchange()).with(USER_NOTIFY_ROUTE_KEY)
    }

}

object RabbitmqConst {
    /**
     * 用户数据（粉丝/机器人/订阅机器人/故事/故事评论）数量更新交换器
     */
    const val USER_COUNT_DIRECT_EXCHANGE = "USER_COUNT_DIRECT_EXCHANGE"

    /**
     * 用户故事数量队列
     */
    const val USER_STORIES_INFO_ROUTE_KEY = "USER_STORIES_INFO_ROUTE_KEY"

    /**
     * 故事信息队列
     */
    const val USER_STORIES_INFO_QUEUE = "USER_STORIES_INFO_QUEUE"

    /**
     * 聊天交换器
     */
    const val CHAT_MSG_DIRECT_EXCHANGE = "CHAT_MSG_DIRECT_EXCHANGE"

    /**
     * 故事聊天上行队列路由key
     */
    const val CHAT_STORY_MSG_UP_ROUTE_KEY = "CHAT_STORY_MSG_UP_ROUTE_KEY"

    /**
     * 故事聊天上行队列
     */
    const val CHAT_STORY_MSG_UP_QUEUE = "CHAT_STORY_MSG_UP_QUEUE"

    /**
     * 聊天下行队列
     */
    const val CHAT_MSG_DOWN_QUEUE = "CHAT_MSG_DOWN_QUEUE"

    /**
     * 聊天下行队列路由key
     */
    const val CHAT_MSG_DOWN_ROUTE_KEY = "CHAT_MSG_DOWN_ROUTE_KEY"

    /**
     * 日志记录
     */
    const val OPERATION_LOG_EXCHANGE = "OPERATION_LOG_EXCHANGE"
    const val OPERATION_LOG_ROUTE_KEY = "OPERATION_LOG_ROUTE_KEY"
    const val OPERATION_LOG_QUEUE = "OPERATION_LOG_QUEUE"

    /**
     * 通知消息推送队列交互机/路由key/队列
     */
    const val USER_NOTIFY_EXCHANGE = "USER_NOTIFY_EXCHANGE"
    const val USER_NOTIFY_ROUTE_KEY = "USER_NOTIFY_ROUTE_KEY"
    const val USER_NOTIFY_QUEUE = "USER_NOTIFY_QUEUE"
}