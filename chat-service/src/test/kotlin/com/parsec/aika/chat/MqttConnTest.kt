package com.parsec.aika.chat

import cn.hutool.core.date.DateUtil
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.IdUtil
import cn.hutool.log.StaticLog
import org.eclipse.paho.client.mqttv3.MqttClient
import org.eclipse.paho.client.mqttv3.MqttConnectOptions
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import org.junit.jupiter.api.Test
import java.util.concurrent.atomic.AtomicInteger

class MqttConnTest {

    //    private val broker = "tcp://127.0.0.1:1883"
    private val broker = "wss://api-test.aikavision.com/mqtt"

    private val username = "test111"

    private val password = "test111"

    private val poolSize = 500

    private val testNum = 2000

//    @Test
    fun connTest() {
        val successCounter = AtomicInteger(0)
        val failCounter = AtomicInteger(0)
        val executor = ThreadUtil.createScheduledExecutor(poolSize)
        for (i in 1..testNum) {
            executor.execute {
                if (null != mqttClient()) successCounter.incrementAndGet() else failCounter.incrementAndGet()
            }
        }
        while (true) {
            StaticLog.info("当前时间:{}", DateUtil.now())
            StaticLog.info("activeCount:{}", executor.activeCount)
            StaticLog.info("taskCount:{}", executor.taskCount)
            StaticLog.info("completedTaskCount:{}", executor.completedTaskCount)
            if (executor.activeCount == 0 && executor.taskCount == executor.completedTaskCount) {
                StaticLog.info("任务执行完成，关闭线程池...")
                executor.shutdown()
            }
            if (executor.isShutdown) {
                break
            }
            ThreadUtil.safeSleep(5000)
        }
        StaticLog.info("测试完成，当前时间:{}", DateUtil.now())
        StaticLog.info("successCounter:{}", successCounter.get())
        StaticLog.info("failCounter:{}", failCounter.get())
    }

    private fun mqttClient(): MqttClient? {
        try {
            val mqttClient = MqttClient(broker, "test_conn_" + IdUtil.fastUUID(), MemoryPersistence())
            val connOpts = MqttConnectOptions()
            connOpts.userName = username
            connOpts.password = password.toCharArray()
            connOpts.isCleanSession = true
            connOpts.connectionTimeout = 3000
//            mqttClient.setCallback(MqttCallback)
            mqttClient.connect(connOpts)
            return mqttClient
        } catch (e: Exception) {
            StaticLog.error("链接异常:{}，Caused by:{}", e.message, e.cause?.message)
        }
        return null
    }
}