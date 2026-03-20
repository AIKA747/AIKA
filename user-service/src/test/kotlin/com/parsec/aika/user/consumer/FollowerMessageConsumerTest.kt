package com.parsec.aika.user.consumer

import cn.hutool.json.JSONUtil
import com.parsec.aika.common.model.bo.SyncRelationBO
import com.parsec.aika.common.model.em.ActionType
import com.parsec.aika.user.config.SyncRelationMqConst.RELATION_EXCHANGE
import com.parsec.aika.user.config.SyncRelationMqConst.USER_RELATION_ROUTE_KEY
import com.parsec.aika.user.mapper.FollowerMapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.jdbc.Sql
import javax.annotation.Resource

@SpringBootTest
class FollowerMessageConsumerTest {

    @Autowired
    private lateinit var rabbitTemplate: RabbitTemplate

    @Resource
    lateinit var followerMapper: FollowerMapper


    @Test
    @Sql(scripts = ["classpath:sql/clear_follower.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun followingMsgReceiver() {
        val userId = 1L
        val followingId = 2L
        //发送关注消息
        rabbitTemplate.convertAndSend(
            RELATION_EXCHANGE, USER_RELATION_ROUTE_KEY, JSONUtil.toJsonStr(SyncRelationBO().apply {
                this.userId = userId
                this.followingId = followingId
                actionType = ActionType.ADD
            })
        )
        Thread.sleep(5000)
        val follower = followerMapper.selectByUidAndFollowingId(userId, followingId)
        assertNotNull(follower)
        assertEquals(1, follower?.uf)  // 验证 uf 是否为 1
        assertEquals(0, follower?.fu)  // 验证 fu 是否为 0
    }


}