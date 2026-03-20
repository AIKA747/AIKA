package com.parsec.aika.content.consumer

import cn.hutool.core.thread.ThreadUtil
import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.common.mapper.FollowRelationMapper
import com.parsec.aika.common.model.bo.FollowRelationBO
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.BotImage
import com.parsec.aika.common.model.entity.FollowRelation
import com.parsec.aika.content.config.FollowRelationMqConst
import jakarta.annotation.Resource
import org.junit.jupiter.api.Assertions
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.jdbc.Sql

@SpringBootTest
class FollowRelationConsumerTest {

    @Resource
    private lateinit var followRelationMapper: FollowRelationMapper

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    //    @Test
    @Sql(value = ["classpath:/sql/clear_relation.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun followRelationMsgReceiver() {
        val relationBO = FollowRelationBO().apply {
            this.creator = 1
            this.followingId = 1
            this.type = AuthorType.USER
        }
        //新增-同步不存在的作者信息
        rabbitTemplate.convertAndSend(
            FollowRelationMqConst.FOLLOW_RELATION_EXCHANGE,
            FollowRelationMqConst.FOLLOW_USER_RELATION_ROUTE_KEY,
            JSONUtil.toJsonStr(relationBO)
        )
        rabbitTemplate.convertAndSend(
            FollowRelationMqConst.FOLLOW_RELATION_EXCHANGE,
            FollowRelationMqConst.FOLLOW_USER_RELATION_ROUTE_KEY,
            JSONUtil.toJsonStr(relationBO)
        )
        //停2秒确保消息处理完成
        ThreadUtil.safeSleep(3000)
        //校验是否保存成功
        val count = followRelationMapper.selectCount(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId).eq(FollowRelation::type, relationBO.type)
        )
        assert(count == 1L)

        // 查询关注信息，默认为 agreed

        val followRelation = followRelationMapper.selectOne(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId).eq(FollowRelation::type, relationBO.type)
        )
        Assertions.assertEquals(true, followRelation.agreed)


        followRelationMapper.delete(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId).eq(FollowRelation::type, relationBO.type)
        )
        val count1 = followRelationMapper.selectCount(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId).eq(FollowRelation::type, relationBO.type)
        )
        assert(count1 == 0L)
    }

    //    @Test
    @Sql(scripts = ["classpath:/sql/user_follow_relation.sql"], executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(value = ["classpath:/sql/clear_relation.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun unfollowRelationMsgReceiver() {
        val relationBO = FollowRelationBO().apply {
            this.creator = 1
            this.followingId = 1
            this.type = AuthorType.USER
        }
        rabbitTemplate.convertAndSend(
            FollowRelationMqConst.FOLLOW_RELATION_EXCHANGE,
            FollowRelationMqConst.UNFOLLOW_USER_RELATION_ROUTE_KEY,
            JSONUtil.toJsonStr(relationBO)
        )
        //停2秒确保消息处理完成
        ThreadUtil.safeSleep(3000)
        val count = followRelationMapper.selectCount(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId).eq(FollowRelation::type, relationBO.type)
        )
        assert(count == 0L)
    }

    //    @Test
    @Sql(value = ["classpath:/sql/clear_relation.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun followBotRelationMsgReceiver() {
        val relationBO = FollowRelationBO().apply {
            this.creator = 1
            this.followingId = 1
            this.type = AuthorType.BOT
            this.botImage = BotImage().apply {
                this.avatar = "https://www.baidu.com/1.jpg"
                this.cover = "https://www.baidu.com/1.jpg"
            }
        }
        //新增-同步不存在的作者信息
        rabbitTemplate.convertAndSend(
            FollowRelationMqConst.FOLLOW_RELATION_EXCHANGE,
            FollowRelationMqConst.FOLLOW_BOT_RELATION_ROUTE_KEY,
            JSONUtil.toJsonStr(relationBO)
        )
        rabbitTemplate.convertAndSend(
            FollowRelationMqConst.FOLLOW_RELATION_EXCHANGE,
            FollowRelationMqConst.FOLLOW_BOT_RELATION_ROUTE_KEY,
            JSONUtil.toJsonStr(relationBO)
        )
        //停2秒确保消息处理完成
        ThreadUtil.safeSleep(3000)
        //校验是否保存成功
        val followRelation = followRelationMapper.selectOne(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId).eq(FollowRelation::type, relationBO.type)
        )
        assert(followRelation.botImage!!.avatar == relationBO.botImage!!.avatar)
        assert(followRelation.botImage!!.cover == relationBO.botImage!!.cover)

        // 测试关注信息中的 agreed 是否为true
        assert(followRelation.agreed)
        //清除数据
        followRelationMapper.delete(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId).eq(FollowRelation::type, relationBO.type)
        )
        val count1 = followRelationMapper.selectCount(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId).eq(FollowRelation::type, relationBO.type)
        )
        assert(count1 == 0L)
    }

    //    @Test
    @Sql(scripts = ["classpath:/sql/bot_follow_relation.sql"])
    fun unfollowBotRelationMsgReceiver() {
        val relationBO = FollowRelationBO().apply {
            this.creator = 1
            this.followingId = 1
            this.type = AuthorType.BOT
        }
        rabbitTemplate.convertAndSend(
            FollowRelationMqConst.FOLLOW_RELATION_EXCHANGE,
            FollowRelationMqConst.UNFOLLOW_USER_RELATION_ROUTE_KEY,
            JSONUtil.toJsonStr(relationBO)
        )
        //停2秒确保消息处理完成
        ThreadUtil.safeSleep(3000)
        //校验数据是否被删除
        val count = followRelationMapper.selectCount(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId).eq(FollowRelation::type, relationBO.type)
        )
        assert(count == 0L)
    }


}
