package com.parsec.aika.content.consumer

import cn.hutool.core.thread.ThreadUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.common.mapper.AuthorMapper
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.Author
import com.parsec.aika.content.config.AuthorSyncMqConst
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.boot.test.context.SpringBootTest
import jakarta.annotation.Resource

@SpringBootTest
class AuthorSyncMessageConsumerTest {

    @Resource
    private lateinit var authorMapper: AuthorMapper

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

//    @Test
    fun authorSyncUserMsgReceiver() {
        val authorInfo = AuthorSyncBO().apply {
            userId = 1
            type = AuthorType.USER
            nickname = "test"
            avatar = "test"
        }
        //新增-同步不存在的作者信息
        rabbitTemplate.convertAndSend(
            AuthorSyncMqConst.AUTHOR_SYNC_EXCHANGE,
            AuthorSyncMqConst.AUTHOR_SYNC_USER_ROUTE_KEY,
            JSONUtil.toJsonStr(authorInfo)
        )
        //停2秒确保消息处理完成
        ThreadUtil.safeSleep(2000)
        //检查消息是否成功保存
        val author = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, authorInfo.userId).eq(Author::type, authorInfo.type)
        )
        assert(author != null)
        assert(author.nickname == authorInfo.nickname)
        assert(author.avatar == authorInfo.avatar)

        //修改
        authorInfo.nickname = "test1"
        authorInfo.avatar = ""
        //更新-同步不存在的作者信息
        rabbitTemplate.convertAndSend(
            AuthorSyncMqConst.AUTHOR_SYNC_EXCHANGE,
            AuthorSyncMqConst.AUTHOR_SYNC_USER_ROUTE_KEY,
            JSONUtil.toJsonStr(authorInfo)
        )
        //停5秒确保消息处理完成
        ThreadUtil.safeSleep(5000)
        //检查消息是否成功保存
        val author1 = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, authorInfo.userId).eq(Author::type, authorInfo.type)
        )
        assert(author != null)
        assert(author1.nickname == authorInfo.nickname)
        Assertions.assertNotEquals("",author1.avatar)

        //修改头像
        AuthorSyncBO().let {
            it.userId = 1
            it.type = AuthorType.USER
            it.avatar = "test1111"
            rabbitTemplate.convertAndSend(
                AuthorSyncMqConst.AUTHOR_SYNC_EXCHANGE,
                AuthorSyncMqConst.AUTHOR_SYNC_USER_ROUTE_KEY,
                JSONUtil.toJsonStr(it)
            )
            //停5秒确保消息处理完成
            ThreadUtil.safeSleep(5000)

            authorMapper.selectOne(
                KtQueryWrapper(Author::class.java).eq(Author::userId, authorInfo.userId).eq(Author::type, authorInfo.type)
            ).let { author2 ->
                assert(author2 != null)
                assert(author2.avatar == it.avatar)
                assert(author2.nickname == author1.nickname)
            }
        }


        //清理数据数据
        authorMapper.deleteById(author1.id)
        assert(authorMapper.selectById(author1.id) == null)
    }



//    @Test
    fun authorSyncBotMsgReceiver() {
        val authorInfo = AuthorSyncBO().apply {
            userId = 1
            type = AuthorType.BOT
            nickname = "test"
            avatar = "test"
        }
        //新增-同步不存在的作者信息
        rabbitTemplate.convertAndSend(
            AuthorSyncMqConst.AUTHOR_SYNC_EXCHANGE,
            AuthorSyncMqConst.AUTHOR_SYNC_BOT_ROUTE_KEY,
            JSONUtil.toJsonStr(authorInfo)
        )
        //停2秒确保消息处理完成
        ThreadUtil.safeSleep(2000)
        //检查消息是否成功保存
        val author = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, authorInfo.userId).eq(Author::type, authorInfo.type)
        )
        assert(author != null)
        assert(author.nickname == authorInfo.nickname)
        assert(author.avatar == authorInfo.avatar)

        //修改
        authorInfo.nickname = "test1"
        //更新-同步不存在的作者信息
        rabbitTemplate.convertAndSend(
            AuthorSyncMqConst.AUTHOR_SYNC_EXCHANGE,
            AuthorSyncMqConst.AUTHOR_SYNC_BOT_ROUTE_KEY,
            JSONUtil.toJsonStr(authorInfo)
        )
        //停2秒确保消息处理完成
        ThreadUtil.safeSleep(2000)
        //检查消息是否成功保存
        val author1 = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, authorInfo.userId).eq(Author::type, authorInfo.type)
        )
        assert(author != null)
        assert(author1.nickname == authorInfo.nickname)
        //清理数据数据
        authorMapper.deleteById(author1.id)
        assert(authorMapper.selectById(author1.id) == null)

    }

}
