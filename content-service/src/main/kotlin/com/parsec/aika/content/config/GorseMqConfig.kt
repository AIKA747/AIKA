package com.parsec.aika.content.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class GorseMqConfig {

    @Bean
    fun gorseExchange(): DirectExchange {
        return DirectExchange(GorseMqConst.GORSE_EXCHANGE)
    }

    @Bean
    fun gorseItemQueue(): Queue {
        return Queue(GorseMqConst.GORSE_ITEM_QUEUE)
    }

    @Bean
    fun bindGorseItemRouteKey(): Binding {
        return BindingBuilder.bind(gorseItemQueue()).to(gorseExchange()).with(GorseMqConst.GORSE_ITEM_ROUTE_KEY)
    }


    @Bean
    fun gorseFeedbackQueue(): Queue {
        return Queue(GorseMqConst.GORSE_FEEDBACK_QUEUE)
    }

    @Bean
    fun bindGorseFeedbackRouteKey(): Binding {
        return BindingBuilder.bind(gorseFeedbackQueue()).to(gorseExchange()).with(GorseMqConst.GORSE_FEEDBACK_ROUTE_KEY)
    }

}

object GorseMqConst {
    const val GORSE_EXCHANGE = "GORSE_EXCHANGE"
    const val GORSE_ITEM_ROUTE_KEY = "GORSE_ITEM_ROUTE_KEY"
    const val GORSE_ITEM_QUEUE = "GORSE_ITEM_QUEUE"
    const val GORSE_FEEDBACK_ROUTE_KEY = "GORSE_FEEDBACK_ROUTE_KEY"
    const val GORSE_FEEDBACK_QUEUE = "GORSE_FEEDBACK_QUEUE"
}