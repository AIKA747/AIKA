package com.parsec.aika.chat

import com.parsec.aika.chat.service.MqttMsgService
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class ChatServiceApplicationTests {

    @Autowired
    private lateinit var mqttMsgService: MqttMsgService

    @Test
    fun contextLoads() {
        val user = "APPUSER1"
        val json = """
			{
			  "chatModule":"bot",
			  "msgType":"CHAT_MSG",
			  "msgId":123456789,
			  "msgData":{
			    "objectId":1752524358159527938,
			    "contentType":"TEXT",
			    "content":"测试发送消息给机器人6"
			  },
			  "test":true
			}
		""".trimIndent()
        mqttMsgService.handler(user, json)
    }

}
