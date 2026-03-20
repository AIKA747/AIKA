package com.parsec.aika.bot.consumer

import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.IdUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.BotServiceApplicationTests
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_GAME_MSG_UP_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_MSG_DIRECT_EXCHANGE
import com.parsec.aika.common.mapper.GameMessageRecordMapper
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.dto.MessageDTO
import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.MsgType
import com.parsec.aika.common.model.em.SourceTypeEnum
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.GameMessageRecord
import org.junit.jupiter.api.Test
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.jdbc.Sql
import kotlin.test.assertEquals

class GameMessageConsumerTest : BotServiceApplicationTests() {

    @Autowired
    private lateinit var rabbitTemplate: RabbitTemplate

    @Autowired
    private lateinit var gameMessageRecordMapper: GameMessageRecordMapper

    @Test
    @Sql(
        value = ["classpath:/sql/clear_game_message_record.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD
    )
    fun gameMsgReceiver() {
        //模拟监听到客户端消息
        val user = "APPUSER123456"
        val chatMessageBO = ChatMessageBO().apply {
            this.objectId = "threadId"
            this.textContent = "hello world"
            this.userId = "123456"
            this.contentType = ContentType.TEXT
            this.sourceType = SourceTypeEnum.user
            this.userType = UserTypeEnum.APPUSER
        }
        val baseMessageDTO = BaseMessageDTO().apply {
            this.clientMsgId = IdUtil.simpleUUID()
            this.msgType = MsgType.CHAT_MSG
            this.username = "test user"
            this.locale = "en"
            this.sessionId = "123456-game-threadId"
            this.msgData = chatMessageBO
        }
        //放入游戏消息处理队列
        rabbitTemplate.convertAndSend(
            CHAT_MSG_DIRECT_EXCHANGE, CHAT_GAME_MSG_UP_ROUTE_KEY, MessageDTO.createMessage(user, baseMessageDTO)
        )
        //暂停几秒，查询记录是否保存成功
        ThreadUtil.safeSleep(5000)
        val list = gameMessageRecordMapper.selectList(
            KtQueryWrapper(GameMessageRecord::class.java).eq(GameMessageRecord::sourceType, SourceTypeEnum.user)
                .eq(GameMessageRecord::userId, chatMessageBO.userId)
                .eq(GameMessageRecord::threadId, chatMessageBO.objectId)
        )
        assertEquals(1, list.size)
        assertEquals(chatMessageBO.textContent, list[0].textContent)
        assertEquals(chatMessageBO.userId, list[0].userId.toString())
        assertEquals(chatMessageBO.objectId, list[0].threadId.toString())
    }
}