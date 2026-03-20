package com.parsec.aika.bot.gpt

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import javax.annotation.Resource

@SpringBootTest
class DeepseekClientTest {

    @Resource
    private lateinit var deepseekClient: DeepseekClient

    @Test
    fun test() {
        val text = deepseekClient.send(
            "你是一个有效",
            false,
            null,
            listOf(ChatMessage("user", "请写一个java程序，打印1到1000的数字，要求每行打印10个数字"))
        )
        println(text)
    }

}