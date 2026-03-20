package com.parsec.aika.content.consumer

import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.em.MsgType
import com.parsec.aika.content.config.RabbitmqConst.CHAT_STORY_MSG_UP_QUEUE
import com.parsec.aika.content.service.ChatService
import com.parsec.aika.content.service.StoryMessageService
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component


@Component
class ChatMessageConsumer {

    @Autowired
    private lateinit var storyMessageService: StoryMessageService

    @Autowired
    private lateinit var chatService: ChatService

    @RabbitHandler
    @RabbitListener(queues = [CHAT_STORY_MSG_UP_QUEUE])
    fun sessionMsgReceiver(msg: String) {
        try {
            StaticLog.info("$CHAT_STORY_MSG_UP_QUEUE,收到聊天消息：$msg")
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
                        storyMessageService.handlerChatMsg(user, baseMessageDTO)
                    }

                    MsgType.READ_MSG -> {
                        StaticLog.info("处理READ_MSG消息...")
                        storyMessageService.handlerReadMsg(user, baseMessageDTO)
                    }

                    MsgType.RESP_MSG -> {
                        StaticLog.info("处理RESP_MSG消息...")
                        StaticLog.info("user:{},story.handlerRespMsg:{}", user, msgStr)
//                        storyMessageService.handlerRespMsg(user, baseMessageDTO)
                    }

                    else -> {
                        StaticLog.info("user:{},story.暂不处理的消息:{}", user, msgStr)
                    }
                }
            } catch (e: Exception) {
                StaticLog.error("处理bot上行会话消息异常2,{}", e)
                chatService.respChatMsg(
                    user, baseMessageDTO.failResp("bot处理消息异常：${e.message}")
                )
            }
        } catch (e: Exception) {
            StaticLog.info("$CHAT_STORY_MSG_UP_QUEUE 消息体转换异常,消息：$msg")
            StaticLog.error("处理bot上行会话消息异常1,{}", e)
        }
    }

}
