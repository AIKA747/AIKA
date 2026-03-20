package com.parsec.aika.chat.mqtt

import cn.hutool.core.thread.ThreadUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.chat.model.props.ConfigProps
import com.parsec.aika.common.model.dto.BaseMessageDTO
import org.eclipse.paho.client.mqttv3.MqttCallback
import org.eclipse.paho.client.mqttv3.MqttClient
import org.eclipse.paho.client.mqttv3.MqttConnectOptions
import org.eclipse.paho.client.mqttv3.MqttException
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component


@Component
class MqttHandler {

    @Autowired
    private lateinit var configProps: ConfigProps

    private lateinit var mqttClient: MqttClient

    fun connectMqttServer(mqttCallback: MqttCallback) {
        mqttClient = MqttClient(configProps.broker, configProps.clientId, MemoryPersistence())
        val connOpts = MqttConnectOptions()
        connOpts.userName = configProps.username
        connOpts.password = configProps.password!!.toCharArray()
        connOpts.isCleanSession = true
        connOpts.connectionTimeout = 3000
        connOpts.keepAliveInterval = 30
        mqttClient.setCallback(mqttCallback)
        mqttClient.connect(connOpts)
    }

    /**
     * 发送消息
     *
     * @param topic
     * @param msg
     * @return
     */
    fun publishMsg(topic: String, msg: BaseMessageDTO, qos: Int): Boolean {
        return try {
            mqttClient.publish(topic, JSONUtil.toJsonStr(msg).toByteArray(Charsets.UTF_8), qos, false)
            true
        } catch (e: MqttException) {
            e.printStackTrace()
            false
        }
    }

    /**
     * 重新连接
     */
    fun reconnection(mqttCallback: MqttCallback) {
        try {
            this.connectMqttServer(mqttCallback)
        } catch (e: MqttException) {
            StaticLog.error("MqttAcceptClient reconnection error,message:{}", e.message)
            e.printStackTrace()
            ThreadUtil.safeSleep(1000)
        }
    }

    /**
     * 订阅某个主题
     *
     * @param topic 主题
     * @param qos   连接方式
     */
    fun subscribe(topic: String, qos: Int) {
        StaticLog.info("========================【开始订阅主题:{}】========================", topic)
        try {
            mqttClient.subscribe(topic, qos)
        } catch (e: MqttException) {
            StaticLog.error("MqttAcceptClient subscribe error,message:{}", e.message)
            e.printStackTrace()
        }
    }

    /**
     * 取消订阅某个主题
     *
     * @param topic
     */
    fun unsubscribe(topic: String) {
        StaticLog.info("========================【取消订阅主题:{}】========================", topic)
        try {
            mqttClient.unsubscribe(topic)
        } catch (e: MqttException) {
            StaticLog.error("MqttAcceptClient unsubscribe error,message:{}", e)
            e.printStackTrace()
        }
    }


}