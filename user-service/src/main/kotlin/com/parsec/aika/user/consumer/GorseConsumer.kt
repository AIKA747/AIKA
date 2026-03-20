package com.parsec.aika.user.consumer

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.GorseFeedbackBO
import com.parsec.aika.common.model.bo.GorseItemBO
import com.parsec.aika.common.model.bo.GorseMethod
import com.parsec.aika.user.config.GorseMqConst
import com.parsec.aika.user.gorse.GorseService
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component
import javax.annotation.Resource

@Component
class GorseConsumer {

    @Resource
    private lateinit var gorseService: GorseService

    @RabbitHandler
    @RabbitListener(queues = [GorseMqConst.GORSE_ITEM_QUEUE])
    fun itemReceiver(msg: String) {
//        StaticLog.info("itemReceiver: {}", msg)
        try {
            val itemBO = JSONUtil.toBean(msg, GorseItemBO::class.java)
            if (itemBO.method == GorseMethod.del) {
                gorseService.deleteItem(itemBO.itemId!!)
            } else {
                gorseService.saveItem(itemBO.itemId!!, itemBO.comment, itemBO.category!!, itemBO.labels ?: listOf())
            }
        } catch (e: Exception) {
            StaticLog.error("gorse item error: {}", e.message)
        }
    }


    @RabbitHandler
    @RabbitListener(queues = [GorseMqConst.GORSE_FEEDBACK_QUEUE])
    fun feedBackReceiver(msg: String) {
        StaticLog.info("feedBackReceiver: {}", msg)
        val feedbackBO = JSONUtil.toBean(msg, GorseFeedbackBO::class.java)
        if (feedbackBO.method == GorseMethod.del) {
            gorseService.deleteFeedback(feedbackBO.userId!!, feedbackBO.itemId!!, feedbackBO.feedbackType!!)
        } else {
            gorseService.saveFeedback(
                feedbackBO.userId!!, feedbackBO.itemId!!, feedbackBO.comment, feedbackBO.feedbackType!!
            )
        }
    }

}