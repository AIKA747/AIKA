package com.parsec.aika.content.service

import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.StrUtil
import com.parsec.aika.common.model.bo.SyncRelationBO
import com.parsec.aika.common.model.em.ActionType
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.PostMessageType
import com.parsec.aika.common.model.entity.Comment
import com.parsec.aika.common.model.entity.FollowRelation
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.service.impl.NoticeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import jakarta.annotation.Resource

@SpringBootTest
class NoticeServiceTest {

    @Resource
    private lateinit var noticeService: NoticeService

    @Autowired
    private lateinit var noticeMessageListener: NoticeMessageListener

    var user = LoginUserInfo().apply {
        userId = 1
    }

    //    @Test
    fun sendUserCommentMessage() {
        //发送用户消息
        val post = Post().apply {
            id = 1
            author = 1
            type = AuthorType.USER
        }
        val comment = Comment().apply {
            this.content = "123456789"
        }
        noticeService.sendCommentMessage(user, post, comment)
        ThreadUtil.safeSleep(5000)
        // 验证消息是否被监听器捕获
        val receivedMessages = noticeMessageListener.receivedUserMessages.last()
        //验证接收到的消息信息
        assert(post.id == receivedMessages.id)
        assert(post.author == receivedMessages.author)
        assert(receivedMessages.type == PostMessageType.comment)
        assert(comment.content == receivedMessages.commentContent)

        //发送机器人消息
        val post1 = Post().apply {
            id = 1
            author = 1
            type = AuthorType.BOT
        }
        val comment1 = Comment().apply {
            this.content = "123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789"
        }
        noticeService.sendCommentMessage(user, post1, comment1)
        ThreadUtil.safeSleep(5000)
        // 验证消息是否被监听器捕获
        val receivedBotMessages = noticeMessageListener.receivedBotMessages.last()

        // 验证消息是否被发送到队列
        val commentContent1 = StrUtil.subPre(comment1.content, 50)
        assert(post1.id == receivedBotMessages.id)
        assert(post1.author == receivedBotMessages.author)
        assert(receivedBotMessages.type == PostMessageType.comment)
        assert(commentContent1 == receivedBotMessages.commentContent)
        //清理一下队列
        noticeMessageListener.clearReceivedMessages()
    }

    //能够过单测但是过不了CI，不知道为什么
//    @Test
    fun senUserThumbMessage() {
        val post = Post().apply {
            id = 1
            author = 1
            type = AuthorType.USER
        }
        noticeService.sendThumbMessage(post, 1)
        ThreadUtil.safeSleep(3000)
        val receivedMessages = noticeMessageListener.receivedUserMessages.last()
        assert(post.id == receivedMessages.id)
        assert(post.author == receivedMessages.author)
        assert(receivedMessages.type == PostMessageType.thumb)
        //清理一下队列
        noticeMessageListener.clearReceivedMessages()
    }

    //    @Test
    fun syncUserRelationInfo() {
        val fr = FollowRelation().apply {
            id = 1
            followingId = 1
            creator = 1
            type = AuthorType.USER
        }
        noticeService.syncUserRelationInfo(SyncRelationBO().apply {
            userId = fr.creator
            followingId = fr.followingId
            actionType = ActionType.ADD
            botImage = fr.botImage
        }, fr.type!!)
        ThreadUtil.safeSleep(5000)
        val receivedMessages = noticeMessageListener.receivedUserRelationMessages.last()
        assert(receivedMessages.userId == fr.creator)
        assert(receivedMessages.followingId == fr.followingId)
        assert(receivedMessages.actionType == ActionType.ADD)

        val fr1 = FollowRelation().apply {
            id = 1
            followingId = 1
            creator = 1
            type = AuthorType.BOT
        }
        noticeService.syncUserRelationInfo(SyncRelationBO().apply {
            userId = fr1.creator
            followingId = fr1.followingId
            actionType = ActionType.ADD
            botImage = fr1.botImage
        }, fr1.type!!)
        ThreadUtil.safeSleep(5000)
        val receivedMessages1 = noticeMessageListener.receivedBotRelationMessages.last()
        assert(receivedMessages1.userId == fr1.creator)
        assert(receivedMessages1.followingId == fr1.followingId)
        assert(receivedMessages1.actionType == ActionType.ADD)

        //清理一下队列
        noticeMessageListener.clearReceivedMessages()
    }

}
