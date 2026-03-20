package com.parsec.aika.bot.consumer

import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_GAME_MSG_UP_QUEUE
import com.parsec.aika.bot.service.ChatService
import com.parsec.aika.bot.service.GameMessageService
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.em.MsgType
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component


@Component
class GameMessageConsumer {

    @Autowired
    private lateinit var gameMessageService: GameMessageService

    @Autowired
    private lateinit var chatService: ChatService

    @RabbitHandler
    @RabbitListener(queues = [CHAT_GAME_MSG_UP_QUEUE])
    fun sessionMsgReceiver(msg: String) {
        try {
            StaticLog.info("$CHAT_GAME_MSG_UP_QUEUE,收到聊天消息：$msg")
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
                        StaticLog.info("GAME处理CHAT_MSG消息...")
                        gameMessageService.handlerChatMsg(user, baseMessageDTO)
                    }

                    MsgType.READ_MSG -> {
                        StaticLog.info("GAME处理READ_MSG消息...")
                        gameMessageService.handlerReadMsg(user, baseMessageDTO)
                    }

                    MsgType.CHAT_MSG_REGENERATE -> {
                        gameMessageService.handlerMsgRegenerate(user, baseMessageDTO)
                    }

                    MsgType.RESP_MSG -> {
                        StaticLog.info("GAME处理RESP_MSG消息...")
                        StaticLog.info("{}，GAME.handlerRespMsg：{}", user, msgStr)
                    }

                    else -> {
                        StaticLog.info("user:{},GAME.暂不处理的消息:{}", user, msgStr)
                    }
                }
            } catch (e: Exception) {
                StaticLog.error("处理GAME上行会话消息异常2,{}", e)
                chatService.respChatMsg(
                    user, baseMessageDTO.failResp("game processing message exception：${e.message}")
                )
            }
        } catch (e: Exception) {
            StaticLog.info("$CHAT_GAME_MSG_UP_QUEUE 消息体转换异常,消息：$msg")
            StaticLog.error("处理GAME上行会话消息异常1,{}", e)
        }
    }

}