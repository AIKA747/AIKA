package com.parsec.aika.chat.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.chat.mqtt.MqttHandler
import com.parsec.aika.chat.remote.ContentFeignClient
import com.parsec.aika.chat.remote.UserFeignClient
import com.parsec.aika.chat.service.AppUserOnlineService
import com.parsec.aika.chat.service.MqttMsgService
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_ASSISTANT_MSG_UP_ROUTE_KEY
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_BOT_MSG_UP_ROUTE_KEY
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_GAME_MSG_UP_ROUTE_KEY
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_GROUP_MSG_UP_ROUTE_KEY
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_MSG_DIRECT_EXCHANGE
import com.parsec.aika.common.model.constrant.RabbitmqConst.CHAT_STORY_MSG_UP_ROUTE_KEY
import com.parsec.aika.common.model.constrant.RedisConst
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.dto.MessageDTO
import com.parsec.aika.common.model.em.ChatModule
import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.MsgType
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.redis.util.RedisUtil
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.annotation.Resource

@Service
class MqttMsgServiceImpl : MqttMsgService {

    @Autowired
    private lateinit var mqttHandler: MqttHandler

    @Autowired
    private lateinit var rabbitTemplate: RabbitTemplate

    @Value("\${mqtt.userTopic}")
    private val userTopic: String? = null

    @Value("\${mqtt.qos}")
    private val qos: Int? = null

    @Resource
    private lateinit var userFeignClient: UserFeignClient

    @Resource
    private lateinit var contentFeignClient: ContentFeignClient

    @Resource
    private lateinit var appUserOnlineService: AppUserOnlineService

    override fun handler(user: String, paload: String) {
        var baseMessageDTO: BaseMessageDTO?
        try {
            baseMessageDTO = JSONUtil.toBean(paload, BaseMessageDTO::class.java)
            if (null == baseMessageDTO) {
                StaticLog.info("接收消息内容:{}", paload)
                return
            }
            //心跳消息直接处理
            if (baseMessageDTO.chatModule == ChatModule.heartbeat) {
                val userId = user.replace(UserTypeEnum.APPUSER.name, "")
                StaticLog.info("收到用户心跳消息:{}", userId)
                //标记用户在线
                appUserOnlineService.online(userId.toLong())
                mqttHandler.publishMsg(
                    StrUtil.format(userTopic!!, user), baseMessageDTO.response(0, "Healthy heartbeat"), qos!!
                )
                return
            }
            StaticLog.debug("收到[${user}]上行消息：${JSONUtil.toJsonStr(baseMessageDTO)}")
            val userInfoStr = RedisUtil.get<String?>("${RedisConst.CHAT_CONN_USER_INFO}$user")
            StaticLog.debug("收到用户消息，查询缓存用户信息：{}", userInfoStr)
            if (StrUtil.isNotBlank(userInfoStr)) {
                val loginUserInfo = JSONUtil.toBean(userInfoStr, LoginUserInfo::class.java)
                baseMessageDTO.username = loginUserInfo.username
                baseMessageDTO.locale = loginUserInfo.language
                baseMessageDTO.country = loginUserInfo.country
                //标记用户在线
                appUserOnlineService.online(loginUserInfo.userId!!)
            }
            //校验用户是否为订阅者且有可用聊天数
            if (!this.checkUserChatMsg(baseMessageDTO)) {
                StaticLog.warn("免费聊天次数已用完:{}", baseMessageDTO.sessionId)
                mqttHandler.publishMsg(
                    StrUtil.format(userTopic!!, user),
                    baseMessageDTO.response(1001, "Free chat limit used up today. Please recharge."),
                    qos!!
                )
                return
            }
            //检查消息是否违规
            if (baseMessageDTO.msgType == MsgType.CHAT_MSG) {
                val message = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ChatMessageBO::class.java)
                if (message.contentType == ContentType.TEXT || message.contentType == ContentType.md) {
                    val baseResult = contentFeignClient.moderations(message.textContent!!)
                    if (baseResult.isSuccess && baseResult.data == true) {
                        mqttHandler.publishMsg(
                            StrUtil.format(userTopic!!, user),
                            baseMessageDTO.response("The current content may cause discomfort or violate AIKA's policies, so the sending has failed!"),
                            qos!!
                        )
                        return
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            StaticLog.error("mqtt消息处理异常：${paload}")
            baseMessageDTO = BaseMessageDTO().apply {
                this.chatModule = ChatModule.other
            }
            mqttHandler.publishMsg(
                StrUtil.format(userTopic!!, user),
                baseMessageDTO.response("消息处理异常[${e.message}]，messageArrived: $paload"),
                qos!!
            )
            return
        }
        //根据不同模块消息，放入不同的队列
        when (baseMessageDTO.chatModule) {
            //助手消息
            ChatModule.assistant -> {
                //放入助手消息处理队列
                rabbitTemplate.convertAndSend(
                    CHAT_MSG_DIRECT_EXCHANGE,
                    CHAT_ASSISTANT_MSG_UP_ROUTE_KEY,
                    MessageDTO.createMessage(user, baseMessageDTO)
                )
            }
            //机器人消息
            ChatModule.bot -> {
                //放入机器人消息处理队列
                rabbitTemplate.convertAndSend(
                    CHAT_MSG_DIRECT_EXCHANGE, CHAT_BOT_MSG_UP_ROUTE_KEY, MessageDTO.createMessage(user, baseMessageDTO)
                )
            }
            //故事消息
            ChatModule.story -> {
                //放入故事消息处理队列
                rabbitTemplate.convertAndSend(
                    CHAT_MSG_DIRECT_EXCHANGE,
                    CHAT_STORY_MSG_UP_ROUTE_KEY,
                    MessageDTO.createMessage(user, baseMessageDTO)
                )
            }
            //故事消息
            ChatModule.game -> {
                //放入游戏消息处理队列
                rabbitTemplate.convertAndSend(
                    CHAT_MSG_DIRECT_EXCHANGE, CHAT_GAME_MSG_UP_ROUTE_KEY, MessageDTO.createMessage(user, baseMessageDTO)
                )
            }
            //群聊消息
            ChatModule.group -> {
                //放入游戏消息处理队列
                rabbitTemplate.convertAndSend(
                    CHAT_MSG_DIRECT_EXCHANGE,
                    CHAT_GROUP_MSG_UP_ROUTE_KEY,
                    MessageDTO.createMessage(user, baseMessageDTO)
                )
            }

            else -> {
                mqttHandler.publishMsg(
                    StrUtil.format(userTopic!!, user),
                    baseMessageDTO.response("不支持的发送消息的模块类型[${baseMessageDTO.chatModule}]"),
                    qos!!
                )
            }
        }

    }

    /**
     * 是否拦截用户聊天消息
     */
    private fun checkUserChatMsg(baseMessageDTO: BaseMessageDTO): Boolean {
        //不校验心跳消息
        if (baseMessageDTO.chatModule == ChatModule.heartbeat) {
            return true
        }
        //不校验助手聊天消息
        if (baseMessageDTO.chatModule == ChatModule.assistant) {
            return true
        }
        //不校验群聊消息
        if (baseMessageDTO.chatModule == ChatModule.group) {
            return true
        }
        //仅校验聊天消息
        if (baseMessageDTO.msgType != MsgType.CHAT_MSG) {
            return true
        }
        //获取聊天内容信息
        val chatMsg = JSONObject(baseMessageDTO.msgData)
        val userId = chatMsg.getLong("userId")
        //查询用户是否订阅用户和每日免费可使用次数
        val checkUserChatInfo = userFeignClient.checkUserChatInfo(userId, country = baseMessageDTO.country)
        Assert.state(checkUserChatInfo.isSuccess, checkUserChatInfo.msg)
        val userChatDTO = checkUserChatInfo.data
        //用户是订阅用户且订阅未过期
        if (Objects.nonNull(userChatDTO.expiredDate) && userChatDTO.expiredDate!!.isAfter(LocalDateTime.now())) {
            return true
        }
        //非订阅用户检查一些可用用次数是否用完
        return userChatDTO.enableChatNum!! > userChatDTO.totalChatNum!!
    }
}