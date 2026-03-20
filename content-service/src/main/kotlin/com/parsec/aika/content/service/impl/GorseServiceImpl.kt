package com.parsec.aika.content.service.impl

import cn.hutool.json.JSONUtil
import com.parsec.aika.common.model.bo.GorseFeedbackBO
import com.parsec.aika.common.model.bo.GorseItemBO
import com.parsec.aika.content.config.GorseMqConst
import com.parsec.aika.content.service.GorseService
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Service
import jakarta.annotation.Resource

@Service
class GorseServiceImpl : GorseService {

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    override fun syncItem(gorseItemBO: GorseItemBO) {
        rabbitTemplate.convertAndSend(
            GorseMqConst.GORSE_EXCHANGE, GorseMqConst.GORSE_ITEM_ROUTE_KEY, JSONUtil.toJsonStr(gorseItemBO)
        )
    }

    override fun syncFeedback(gorseFeedbackBO: GorseFeedbackBO) {
        rabbitTemplate.convertAndSend(
            GorseMqConst.GORSE_EXCHANGE, GorseMqConst.GORSE_FEEDBACK_ROUTE_KEY, JSONUtil.toJsonStr(gorseFeedbackBO)
        )
    }

}