package com.parsec.aika.admin.config

import com.parsec.aika.admin.config.RabbitmqConst.CHAT_MSG_DIRECT_EXCHANGE
import com.parsec.aika.admin.config.RabbitmqConst.EMAIL_SEND_RECORD_EXCHANGE
import com.parsec.aika.admin.config.RabbitmqConst.EMAIL_SEND_RECORD_QUEUE
import com.parsec.aika.admin.config.RabbitmqConst.EMAIL_SEND_RECORD_ROUTE_KEY
import com.parsec.aika.admin.config.RabbitmqConst.OPERATION_LOG_EXCHANGE
import com.parsec.aika.admin.config.RabbitmqConst.OPERATION_LOG_QUEUE
import com.parsec.aika.admin.config.RabbitmqConst.OPERATION_LOG_ROUTE_KEY
import com.parsec.aika.admin.config.RabbitmqConst.READ_MSG_QUEUE
import com.parsec.aika.admin.config.RabbitmqConst.READ_MSG_ROUTE_KEY
import com.parsec.aika.admin.config.RabbitmqConst.SESSION_MSG_DOWN_QUEUE
import com.parsec.aika.admin.config.RabbitmqConst.SESSION_MSG_DOWN_ROUTE_KEY
import com.parsec.aika.admin.config.RabbitmqConst.SESSION_MSG_UP_QUEUE
import com.parsec.aika.admin.config.RabbitmqConst.SESSION_MSG_UP_ROUTE_KEY
import com.parsec.aika.admin.config.RabbitmqConst.USER_BOT_INFO_QUEUE
import com.parsec.aika.admin.config.RabbitmqConst.USER_BOT_INFO_ROUTE_KEY
import com.parsec.aika.admin.config.RabbitmqConst.USER_COUNT_DIRECT_EXCHANGE
import com.parsec.aika.admin.config.RabbitmqConst.USER_SUBSCRIPT_BOT_COUNT_QUEUE
import com.parsec.aika.admin.config.RabbitmqConst.USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY
import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class RabbitMQConfig {

    @Bean
    fun sessionMsgUpQueue(): Queue {
        return Queue(SESSION_MSG_UP_QUEUE)
    }

    @Bean
    fun sessionMsgDownQueue(): Queue {
        return Queue(SESSION_MSG_DOWN_QUEUE)
    }

    @Bean
    fun readMsgQueue(): Queue {
        return Queue(READ_MSG_QUEUE)
    }

    @Bean
    fun exchangeDirect(): DirectExchange {
        return DirectExchange(CHAT_MSG_DIRECT_EXCHANGE)
    }

    @Bean
    fun bindSessionUpMsg(): Binding {
        return BindingBuilder.bind(sessionMsgUpQueue()).to(exchangeDirect()).with(SESSION_MSG_UP_ROUTE_KEY)
    }

    @Bean
    fun bindSessionDownMsg(): Binding {
        return BindingBuilder.bind(sessionMsgDownQueue()).to(exchangeDirect()).with(SESSION_MSG_DOWN_ROUTE_KEY)
    }

    @Bean
    fun bindReadMsg(): Binding {
        return BindingBuilder.bind(readMsgQueue()).to(exchangeDirect()).with(READ_MSG_ROUTE_KEY)
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
    fun emailSendRecordExchange(): DirectExchange {
        return DirectExchange(EMAIL_SEND_RECORD_EXCHANGE)
    }

    @Bean
    fun emailSendRecordQueue(): Queue {
        return Queue(EMAIL_SEND_RECORD_QUEUE)
    }

    @Bean
    fun emailSendRecordRouteKey(): Binding {
        return BindingBuilder.bind(emailSendRecordQueue()).to(emailSendRecordExchange())
            .with(EMAIL_SEND_RECORD_ROUTE_KEY)
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
}

object RabbitmqConst {
    /**
     * 发送邮件日志记录
     */
    const val EMAIL_SEND_RECORD_EXCHANGE = "EMAIL_SEND_RECORD_EXCHANGE"

    const val EMAIL_SEND_RECORD_QUEUE = "EMAIL_SEND_RECORD_QUEUE"

    const val EMAIL_SEND_RECORD_ROUTE_KEY = "EMAIL_SEND_RECORD_ROUTE_KEY"

    /**
     * 聊天消息队列-上行
     */
    const val SESSION_MSG_UP_QUEUE = "CHAT_SESSION_MSG_UP_QUEUE"

    /**
     * 聊天消息队列-下行
     */
    const val SESSION_MSG_DOWN_QUEUE = "CHAT_SESSION_MSG_DOWN_QUEUE"

    /**
     * 消息已读队列
     */
    const val READ_MSG_QUEUE = "CHAT_READ_MSG_QUEUE"

    /**
     * 聊天交换器
     */
    const val CHAT_MSG_DIRECT_EXCHANGE = "CHAT_MSG_DIRECT_EXCHANGE"

    /**
     * 聊天消息队列-上行路由key
     */
    const val SESSION_MSG_UP_ROUTE_KEY = "CHAT_SESSION_MSG_UP_ROUTE_KEY"

    /**
     * 聊天消息队列-下行路由key
     */
    const val SESSION_MSG_DOWN_ROUTE_KEY = "CHAT_SESSION_MSG_DOWN_ROUTE_KEY"

    /**
     * 消息已读队列路由key
     */
    const val READ_MSG_ROUTE_KEY = "CHAT_READ_MSG_ROUTE_KEY"


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
     * 日志记录
     */
    const val OPERATION_LOG_EXCHANGE = "OPERATION_LOG_EXCHANGE"
    const val OPERATION_LOG_ROUTE_KEY = "OPERATION_LOG_ROUTE_KEY"
    const val OPERATION_LOG_QUEUE = "OPERATION_LOG_QUEUE"


}