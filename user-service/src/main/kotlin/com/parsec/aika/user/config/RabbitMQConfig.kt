package com.parsec.aika.user.config

import com.parsec.aika.user.config.RabbitmqConst.EMAIL_SEND_RECORD_EXCHANGE
import com.parsec.aika.user.config.RabbitmqConst.EMAIL_SEND_RECORD_QUEUE
import com.parsec.aika.user.config.RabbitmqConst.EMAIL_SEND_RECORD_ROUTE_KEY
import com.parsec.aika.user.config.RabbitmqConst.OPERATION_LOG_EXCHANGE
import com.parsec.aika.user.config.RabbitmqConst.OPERATION_LOG_QUEUE
import com.parsec.aika.user.config.RabbitmqConst.OPERATION_LOG_ROUTE_KEY
import com.parsec.aika.user.config.RabbitmqConst.USER_BOT_INFO_QUEUE
import com.parsec.aika.user.config.RabbitmqConst.USER_BOT_INFO_ROUTE_KEY
import com.parsec.aika.user.config.RabbitmqConst.USER_COUNT_DIRECT_EXCHANGE
import com.parsec.aika.user.config.RabbitmqConst.USER_FANS_COUNT_QUEUE
import com.parsec.aika.user.config.RabbitmqConst.USER_FANS_COUNT_ROUTE_KEY
import com.parsec.aika.user.config.RabbitmqConst.USER_NOTIFY_EXCHANGE
import com.parsec.aika.user.config.RabbitmqConst.USER_NOTIFY_QUEUE
import com.parsec.aika.user.config.RabbitmqConst.USER_NOTIFY_ROUTE_KEY
import com.parsec.aika.user.config.RabbitmqConst.USER_STORIES_INFO_QUEUE
import com.parsec.aika.user.config.RabbitmqConst.USER_STORIES_INFO_ROUTE_KEY
import com.parsec.aika.user.config.RabbitmqConst.USER_SUBSCRIPT_BOT_COUNT_QUEUE
import com.parsec.aika.user.config.RabbitmqConst.USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY
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
    fun userBotNumQueue(): Queue {
        return Queue(USER_BOT_INFO_QUEUE)
    }

    @Bean
    fun bindUserBotNumRouteKey(): Binding {
        return BindingBuilder.bind(userBotNumQueue()).to(exchangeDirect()).with(USER_BOT_INFO_ROUTE_KEY)
    }

    @Bean
    fun userSubscriptBotCountQueue(): Queue {
        return Queue(USER_SUBSCRIPT_BOT_COUNT_QUEUE)
    }

    @Bean
    fun bindUserSubscriptBotCountRouteKey(): Binding {
        return BindingBuilder.bind(userSubscriptBotCountQueue()).to(exchangeDirect())
            .with(USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY)
    }

    @Bean
    fun userFansCountQueue(): Queue {
        return Queue(USER_FANS_COUNT_QUEUE)
    }

    @Bean
    fun bindUserFansCountRouteKey(): Binding {
        return BindingBuilder.bind(userFansCountQueue()).to(exchangeDirect()).with(USER_FANS_COUNT_ROUTE_KEY)
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
    fun emailDirectExchange(): DirectExchange {
        return DirectExchange(EMAIL_SEND_RECORD_EXCHANGE)
    }

    @Bean
    fun emailSendRecordQueue(): Queue {
        return Queue(EMAIL_SEND_RECORD_QUEUE)
    }

    @Bean
    fun bindEmailSendRecordRouteKey(): Binding {
        return BindingBuilder.bind(emailSendRecordQueue()).to(emailDirectExchange()).with(EMAIL_SEND_RECORD_ROUTE_KEY)
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
     * 发送邮件日志记录
     */
    const val EMAIL_SEND_RECORD_EXCHANGE = "EMAIL_SEND_RECORD_EXCHANGE"

    const val EMAIL_SEND_RECORD_QUEUE = "EMAIL_SEND_RECORD_QUEUE"

    const val EMAIL_SEND_RECORD_ROUTE_KEY = "EMAIL_SEND_RECORD_ROUTE_KEY"

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
     * 粉丝数量队列
     */
    const val USER_FANS_COUNT_QUEUE = "USER_FANS_COUNT_QUEUE"

    /**
     * 故事信息队列
     */
    const val USER_STORIES_INFO_QUEUE = "USER_STORIES_INFO_QUEUE"

    /**
     * 用户创建机器人数量队列
     */
    const val USER_BOT_INFO_ROUTE_KEY = "USER_BOT_INFO_ROUTE_KEY"

    /**
     * 用户订阅机器人数量队列
     */
    const val USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY = "USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY"

    /**
     * 用户粉丝数量队列
     */
    const val USER_FANS_COUNT_ROUTE_KEY = "USER_FANS_COUNT_ROUTE_KEY"

    /**
     * 用户故事数量队列
     */
    const val USER_STORIES_INFO_ROUTE_KEY = "USER_STORIES_INFO_ROUTE_KEY"

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