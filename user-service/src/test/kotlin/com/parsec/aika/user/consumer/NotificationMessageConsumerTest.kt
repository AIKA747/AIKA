package com.parsec.aika.user.consumer

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import javax.annotation.Resource

@SpringBootTest
class NotificationMessageConsumerTest {

    @Resource
    private lateinit var notificationMessageConsumer: NotificationMessageConsumer

    @Test
    fun test() {
        val msg = """
            {"type":"thumb","userIds":[1786335134982156289],"authorId":1786335134982156289,"avatar":"http://dummyimage.com/100x100","nickname":"NULL","username":"yyds","cover":"esse consectetur sint sunt proident","metadata":{"postId":10,"summary":"proident in officia ea","likes":1,"reposts":0,"type":"USER"}}
        """.trimIndent()
        notificationMessageConsumer.notifyReceiver(msg)
    }

}