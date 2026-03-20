package com.parsec.aika.bot.consumer

import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_BOT_MSG_UP_QUEUE
import com.parsec.aika.bot.service.BotMessageService
import com.parsec.aika.bot.service.ChatService
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.em.MsgType
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component


@Component
class BotMessageConsumer {

    @Autowired
    private lateinit var botMessageService: BotMessageService

    @Autowired
    private lateinit var chatService: ChatService

    @RabbitHandler
    @RabbitListener(queues = [CHAT_BOT_MSG_UP_QUEUE])
    fun sessionMsgReceiver(msg: String) {
        try {
            StaticLog.info("$CHAT_BOT_MSG_UP_QUEUE,收到聊天消息：$msg")
            val jsonObject = JSONObject(msg)
            val user = jsonObject.getStr("user")
            val msgStr = jsonObject.getStr("baseMessageDTO")
            val baseMessageDTO = JSONUtil.toBean(msgStr, BaseMessageDTO::class.java)
            if (null == baseMessageDTO) {
                StaticLog.info("接收消息内容:{}", msg)
                return
            }
            try {
                when (baseMessageDTO.msgType) {
                    MsgType.CHAT_MSG -> {
                        StaticLog.info("处理CHAT_MSG消息...")
                        botMessageService.handlerChatMsg(user, baseMessageDTO)
                    }

                    MsgType.READ_MSG -> {
                        StaticLog.info("处理READ_MSG消息...")
                        botMessageService.handlerReadMsg(user, baseMessageDTO)
                    }

                    MsgType.RESP_MSG -> {
                        StaticLog.info("处理RESP_MSG消息...")
                        StaticLog.info("{}，bot.handlerRespMsg：{}", user, msgStr)
//                        botMessageService.handlerRespMsg(user, baseMessageDTO)
                    }

                    MsgType.CHAT_MSG_REGENERATE -> {
                        botMessageService.handlerMsgRegenerate(user, baseMessageDTO)
                    }

                    else -> {
                        StaticLog.info("user:{},bot.暂不处理的消息:{}", user, msgStr)
                    }
                }
            } catch (e: Exception) {
                StaticLog.error("处理bot上行会话消息异常2,{}", e)
                chatService.respChatMsg(
                    user, baseMessageDTO.failResp("bot处理消息异常：${e.message}")
                )
            }
        } catch (e: Exception) {
            StaticLog.info("$CHAT_BOT_MSG_UP_QUEUE 消息体转换异常,消息：$msg")
            StaticLog.error("处理bot上行会话消息异常1,{}", e)
        }
    }

}