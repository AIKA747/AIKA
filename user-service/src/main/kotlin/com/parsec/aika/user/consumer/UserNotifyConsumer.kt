package com.parsec.aika.user.consumer

import cn.hutool.json.JSONObject
import cn.hutool.log.StaticLog
import com.parsec.aika.user.config.RabbitmqConst
import com.parsec.aika.user.service.PushListService
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class UserNotifyConsumer {

    @Autowired
    private lateinit var pushListService: PushListService

    @RabbitHandler
    @RabbitListener(queues = [RabbitmqConst.USER_NOTIFY_QUEUE])
    fun userNotify(msg: String) {
        try {
            StaticLog.info("${RabbitmqConst.USER_NOTIFY_QUEUE},收到用户通知：{}", msg)
            val messageVo = JSONObject(msg)
            pushListService.pushUserNotify(
                messageVo.getLong("userId"),
                messageVo.getStr("username"),
                messageVo.getStr("title"),
                messageVo.getStr("content"),
                messageVo.getLong("jobId")
            )
        } catch (e: Exception) {
            StaticLog.error("处理邮件发送日志异常")
            e.printStackTrace()
        }
    }

}