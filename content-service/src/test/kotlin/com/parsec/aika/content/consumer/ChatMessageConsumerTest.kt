package com.parsec.aika.content.consumer

import com.parsec.aika.content.ContentServiceApplicationTests
import org.springframework.beans.factory.annotation.Autowired

class ChatMessageConsumerTest : ContentServiceApplicationTests() {

    @Autowired
    lateinit var chatMessageConsumer: ChatMessageConsumer

    val msg = """
        {
        	"chatModule": "story",
        	"msgType": "CHAT_MSG",
        	"clientMsgId": "abc123",
        	"msgData": {
        		"objectId": 1761313472498417666,
        		"userId": 1761293998898085889,
        		"userType": "APPUSER",
        		"contentType": "TEXT",
        		"textContent": "您好",
        		"digitHuman": true,
        		"json": {
        			"id": "1761583328089083906",
        			"giftName": "Love flower",
        			"image": "https://aika-demo.s3.amazonaws.com/public/b5f4723fde204f3bbec6614180253d32_flower1.png"
        		},
        		"fileProperty": {
        			"name": "test",
        			"url": "www.baidu.com"
        		}
        	},
        	"test": false
        }
    """.trimIndent()

//    @Test
    fun test() {
        chatMessageConsumer.sessionMsgReceiver(msg)
    }


}
