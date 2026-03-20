package com.parsec.aika.chat.mqtt

import cn.hutool.core.util.StrUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.chat.model.props.ConfigProps
import com.parsec.aika.chat.service.MqttMsgService
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken
import org.eclipse.paho.client.mqttv3.MqttCallback
import org.eclipse.paho.client.mqttv3.MqttMessage
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.annotation.PostConstruct


@Component
class MqttMsgRecevier : MqttCallback {

    @Autowired
    private lateinit var mqttHandler: MqttHandler

    @Autowired
    private lateinit var mqttMsgService: MqttMsgService

    @Autowired
    private lateinit var configProps: ConfigProps

    @PostConstruct
    fun initMqttServer() {
        //链接mqtt服务
        mqttHandler.connectMqttServer(this)
        //订阅主题,此处需要共享订阅,解决多个实例处理同一条消息的情况
        val botTopic = StrUtil.format(configProps.botTopic, "#")
        mqttHandler.subscribe("\$share/chatService/$botTopic", configProps.qos!!)
        StaticLog.info("MqttMsgRecevier subscribe topic:{}  success!!!", configProps.botTopic)
    }

    override fun connectionLost(cause: Throwable?) {
        StaticLog.error(cause)
        // 连接丢失后，一般在这里面进行重连
        StaticLog.warn("连接断开，开始重连..")
        mqttHandler.reconnection(this)
        //订阅主题,此处需要共享订阅,解决多个实例处理同一条消息的情况
        val botTopic = StrUtil.format(configProps.botTopic, "#")
        mqttHandler.subscribe("\$share/chatService/$botTopic", configProps.qos!!)
        StaticLog.warn("连接断开，重连成功！！")
    }

    override fun messageArrived(topic: String, message: MqttMessage) {
        try {
            // subscribe后得到的消息会执行到这里面
            StaticLog.debug("接收消息主题:{}", topic)
            StaticLog.debug("接收消息Qos:{}", message.qos)
            val user = StrUtil.subSuf(topic, StrUtil.lastIndexOfIgnoreCase(topic, "/") + 1)
            StaticLog.debug("user:{}", user)
            //处理接收到的消息
            mqttMsgService.handler(user, String(message.payload))
        } catch (e: Exception) {
            StaticLog.error("处理mqtt消息异常")
            e.printStackTrace()
        }
    }

    override fun deliveryComplete(token: IMqttDeliveryToken) {
        StaticLog.info("MqttMsgRecevier deliveryComplete:{}", token.isComplete)
        val topics = token.topics
        for (topic in topics) {
            StaticLog.info("向主题【$topic】发送消息成功！")
        }
    }
}