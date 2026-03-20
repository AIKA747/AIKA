package com.parsec.aika.bot.consumer

import com.parsec.aika.bot.BotServiceApplicationTests
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional

class BotMessageConsumerTest : BotServiceApplicationTests() {

    @Autowired
    private lateinit var botMessageConsumer: BotMessageConsumer

    @Autowired
    private lateinit var assistantMessageConsumer: AssistantMessageConsumer

    @Test
    fun sessionMsgReceiver() {
        val json = """
            {"user":"APPUSER1762418882751074305","baseMessageDTO":{"chatModule":"bot","msgType":"CHAT_MSG","msgData":{"objectId":"1762081066799607809","userId":"1767890683528032257","userType":"APPUSER","contentType":"IMAGE","json":"","media":"https://aika-demo.s3.amazonaws.com/public/e903f43c448b48438ec872fb0348f8a6_929022c7-a6f5-4116-a9c3-5eda7fc69c20.jpeg","textContent":"","fileProperty":{"fileName":"file:///data/user/0/com.umaylabs.aika/cache/ImagePicker/929022c7-a6f5-4116-a9c3-5eda7fc69c20.jpeg"},"msgId":"","digitHuman":false},"clientMsgId":"1709434437305","sessionId":"APPUSER1762418882751074305-assistant-1760868258732335106","test":false,"username":"test"}}
        """.trimIndent()
        botMessageConsumer.sessionMsgReceiver(json)
    }

    @Test
    fun assistantMsgReceiver() {
        val json = """
            {
            	"user": "APPUSER1761293998898085889",
            	"baseMessageDTO": {
	"chatModule": "assistant",
	"msgType": "CHAT_MSG",
	"clientMsgId": "abc123",
	"msgData": {
		"objectId": 1767737950333898753,
		"userId": 1761293998898085889,
		"userType": "APPUSER",
		"contentType": "TEXT",
		"textContent": "可以推荐一个故事来吗",
		"digitHuman": false,
		"fileProperty": {
			"name": "test",
			"url": "www.baidu.com"
		}
	},
	"test": false
}
            }
        """.trimIndent()
        assistantMessageConsumer.sessionMsgReceiver(json)
    }

}