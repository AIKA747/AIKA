package com.parsec.aika.bot.consumer

import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_GROUP_MSG_UP_QUEUE
import com.parsec.aika.bot.service.ChatService
import com.parsec.aika.bot.service.GroupMessageService
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.em.MsgType
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component


@Component
class GroupMessageConsumer {

    @Autowired
    private lateinit var groupMessageService: GroupMessageService

    @Autowired
    private lateinit var chatService: ChatService

    @RabbitHandler
    @RabbitListener(queues = [CHAT_GROUP_MSG_UP_QUEUE])
    fun sessionMsgReceiver(msg: String) {
        try {
            StaticLog.info("$CHAT_GROUP_MSG_UP_QUEUE,收到聊天消息：$msg")
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
                        StaticLog.info("GROUP处理CHAT_MSG消息...")
                        groupMessageService.handlerChatMsg(user, baseMessageDTO)
                    }

                    MsgType.RECALL -> {
                        groupMessageService.handlerRecallMsg(user, baseMessageDTO)
                        StaticLog.info("GROUP处理IMAGE_RESP消息...")
                    }

                    MsgType.READ_MSG -> {
                        StaticLog.info("GROUP处理READ_MSG消息...")
                    }

                    MsgType.RESP_MSG -> {
                        StaticLog.info("GROUP处理RESP_MSG消息...")
                        StaticLog.info("{}，GROUP.handlerRespMsg：{}", user, msgStr)
                    }

                    else -> {
                        StaticLog.info("user:{},GROUP.暂不处理的消息:{}", user, msgStr)
                    }
                }
            } catch (e: Exception) {
                StaticLog.error("处理GROUP上行会话消息异常2,{}", e)
                chatService.respChatMsg(
                    user, baseMessageDTO.failResp("group processing message exception：${e.message}")
                )
                e.printStackTrace()
            }
        } catch (e: Exception) {
            StaticLog.info("$CHAT_GROUP_MSG_UP_QUEUE 消息体转换异常,消息：$msg")
            StaticLog.error("处理GROUP上行会话消息异常1,{}", e)
            e.printStackTrace()
        }
    }

}

