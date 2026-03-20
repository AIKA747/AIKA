package com.parsec.aika.bot.config

import com.parsec.aika.bot.config.RabbitmqConst.CHAT_ASSISTANT_MSG_UP_QUEUE
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_ASSISTANT_MSG_UP_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_BOT_MSG_UP_QUEUE
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_BOT_MSG_UP_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_GAME_MSG_UP_QUEUE
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_GAME_MSG_UP_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_GROUP_MSG_UP_QUEUE
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_GROUP_MSG_UP_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_MSG_DIRECT_EXCHANGE
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_MSG_DOWN_QUEUE
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_MSG_DOWN_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.OPERATION_LOG_EXCHANGE
import com.parsec.aika.bot.config.RabbitmqConst.OPERATION_LOG_QUEUE
import com.parsec.aika.bot.config.RabbitmqConst.OPERATION_LOG_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.USER_BOT_INFO_QUEUE
import com.parsec.aika.bot.config.RabbitmqConst.USER_BOT_INFO_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.USER_COUNT_DIRECT_EXCHANGE
import com.parsec.aika.bot.config.RabbitmqConst.USER_NOTIFY_EXCHANGE
import com.parsec.aika.bot.config.RabbitmqConst.USER_NOTIFY_QUEUE
import com.parsec.aika.bot.config.RabbitmqConst.USER_NOTIFY_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.USER_SUBSCRIPT_BOT_COUNT_QUEUE
import com.parsec.aika.bot.config.RabbitmqConst.USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY
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
    fun botMsgUpQueue(): Queue {
        return Queue(CHAT_BOT_MSG_UP_QUEUE)
    }

    @Bean
    fun bindBotMsgUpMsg(): Binding {
        return BindingBuilder.bind(botMsgUpQueue()).to(exchangeDirect()).with(CHAT_BOT_MSG_UP_ROUTE_KEY)
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
    fun gameMsgUpQueue(): Queue {
        return Queue(CHAT_GAME_MSG_UP_QUEUE)
    }

    @Bean
    fun gameMsgUpRouteKey(): Binding {
        return BindingBuilder.bind(gameMsgUpQueue()).to(exchangeDirect()).with(CHAT_GAME_MSG_UP_ROUTE_KEY)
    }

    @Bean
    fun chatMsgDownQueue(): Queue {
        return Queue(CHAT_MSG_DOWN_QUEUE)
    }

    @Bean
    fun bindSessionDownMsg(): Binding {
        return BindingBuilder.bind(chatMsgDownQueue()).to(exchangeDirect()).with(CHAT_MSG_DOWN_ROUTE_KEY)
    }

    @Bean
    fun userCountExchangeDirect(): DirectExchange {
        return DirectExchange(USER_COUNT_DIRECT_EXCHANGE)
    }

    @Bean
    fun userBotNumQueue(): Queue {
        return Queue(USER_BOT_INFO_QUEUE)
    }

    @Bean
    fun bindUserBotNumRouteKey(): Binding {
        return BindingBuilder.bind(userBotNumQueue()).to(userCountExchangeDirect()).with(USER_BOT_INFO_ROUTE_KEY)
    }

    @Bean
    fun userSubscriptBotCountQueue(): Queue {
        return Queue(USER_SUBSCRIPT_BOT_COUNT_QUEUE)
    }

    @Bean
    fun bindUserSubscriptBotCountRouteKey(): Binding {
        return BindingBuilder.bind(userSubscriptBotCountQueue()).to(userCountExchangeDirect())
            .with(USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY)
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
    fun groupMsgUpQueue(): Queue {
        return Queue(CHAT_GROUP_MSG_UP_QUEUE)
    }

    @Bean
    fun groupMsgUpRouteKey(): Binding {
        return BindingBuilder.bind(groupMsgUpQueue()).to(exchangeDirect()).with(CHAT_GROUP_MSG_UP_ROUTE_KEY)
    }

}

object RabbitmqConst {

    /**
     * 聊天交换器
     */
    const val CHAT_MSG_DIRECT_EXCHANGE = "CHAT_MSG_DIRECT_EXCHANGE"

    /**
     * 机器人聊天上行队列
     */
    const val CHAT_BOT_MSG_UP_QUEUE = "CHAT_BOT_MSG_UP_QUEUE"

    /**
     * 助手聊天消息上行队列
     */
    const val CHAT_ASSISTANT_MSG_UP_QUEUE = "CHAT_ASSISTANT_MSG_UP_QUEUE"

    /**
     * 聊天消息队列-下行
     */
    const val CHAT_MSG_DOWN_QUEUE = "CHAT_SESSION_MSG_DOWN_QUEUE"

    /**
     * bot聊天消息队列-上行路由key
     */
    const val CHAT_BOT_MSG_UP_ROUTE_KEY = "CHAT_BOT_MSG_UP_ROUTE_KEY"

    /**
     * 游戏聊天上行队列
     */
    const val CHAT_GAME_MSG_UP_QUEUE = "CHAT_GAME_MSG_UP_QUEUE"

    /**
     * 游戏聊天上行队列路由key
     */
    const val CHAT_GAME_MSG_UP_ROUTE_KEY = "CHAT_GAME_MSG_UP_ROUTE_KEY"

    /**
     * 助手聊天消息上行队列路由key
     */
    const val CHAT_ASSISTANT_MSG_UP_ROUTE_KEY = "CHAT_ASSISTANT_MSG_UP_ROUTE_KEY"

    /**
     * 聊天下行队列路由key
     */
    const val CHAT_MSG_DOWN_ROUTE_KEY = "CHAT_MSG_DOWN_ROUTE_KEY"


    /**
     * 用户数据（粉丝/机器人/订阅机器人/故事/故事评论）数量更新交换器
     */
    const val USER_COUNT_DIRECT_EXCHANGE = "USER_COUNT_DIRECT_EXCHANGE"

    /**
     * 用户创建机器人数量队列
     */
    const val USER_BOT_INFO_QUEUE = "USER_BOT_INFO_QUEUE"

    /**
     * 订阅机器人数量
     */
    const val USER_SUBSCRIPT_BOT_COUNT_QUEUE = "USER_SUBSCRIPT_BOT_COUNT_QUEUE"

    /**
     * 用户创建机器人数量队列
     */
    const val USER_BOT_INFO_ROUTE_KEY = "USER_BOT_INFO_ROUTE_KEY"

    /**
     * 用户订阅机器人数量队列
     */
    const val USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY = "USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY"

    /**
     * 通知消息推送队列交互机/路由key/队列
     */
    const val USER_NOTIFY_EXCHANGE = "USER_NOTIFY_EXCHANGE"
    const val USER_NOTIFY_ROUTE_KEY = "USER_NOTIFY_ROUTE_KEY"
    const val USER_NOTIFY_QUEUE = "USER_NOTIFY_QUEUE"

    /**
     * 日志记录
     */
    const val OPERATION_LOG_EXCHANGE = "OPERATION_LOG_EXCHANGE"
    const val OPERATION_LOG_ROUTE_KEY = "OPERATION_LOG_ROUTE_KEY"
    const val OPERATION_LOG_QUEUE = "OPERATION_LOG_QUEUE"

    /**
     * 游戏聊天上行队列
     */
    const val CHAT_GROUP_MSG_UP_QUEUE = "CHAT_GROUP_MSG_UP_QUEUE"
    const val CHAT_GROUP_MSG_UP_ROUTE_KEY = "CHAT_GROUP_MSG_UP_ROUTE_KEY"

}