package com.parsec.aika.chat.consumer

import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.chat.mqtt.MqttHandler
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_MSG_DOWN_QUEUE
import com.parsec.aika.common.model.dto.BaseMessageDTO
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component


@Component
class ChatMessageConsumer {

    @Autowired
    private lateinit var mqttHandler: MqttHandler

    @Value("\${mqtt.userTopic}")
    private val userTopic: String? = null

    @Value("\${mqtt.qos}")
    private val qos: Int? = null

    @RabbitHandler
    @RabbitListener(queues = [CHAT_MSG_DOWN_QUEUE])
    fun sessionMsgReceiver(msg: String) {
        try {
            StaticLog.info("收到消息：$msg")
            val jsonObject = JSONObject(msg)
            val msgJson = jsonObject.getStr("baseMessageDTO")
            //下发消息
            mqttHandler.publishMsg(
                StrUtil.format(userTopic, jsonObject.getStr("user")),
                JSONUtil.toBean(msgJson, BaseMessageDTO::class.java),
                qos!!
            )
        } catch (e: Exception) {
            StaticLog.error("回复用户消息异常,下行消息:$msg")
            e.printStackTrace()
        }
    }


}