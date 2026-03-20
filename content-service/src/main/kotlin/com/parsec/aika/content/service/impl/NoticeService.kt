package com.parsec.aika.content.service.impl

import cn.hutool.core.collection.CollUtil
import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.common.mapper.AuthorMapper
import com.parsec.aika.common.model.bo.NotifyBO
import com.parsec.aika.common.model.bo.NotifyMetadata
import com.parsec.aika.common.model.bo.NotifyType
import com.parsec.aika.common.model.bo.SyncRelationBO
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.Author
import com.parsec.aika.common.model.entity.Comment
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.config.SyncRelationMqConst
import com.parsec.aika.content.service.NotificationService
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import jakarta.annotation.Resource

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/22.
 */
@Service
class NoticeService {

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    @Resource
    private lateinit var authorMapper: AuthorMapper

    @Resource
    private lateinit var notificationService: NotificationService

    // 当用户回复帖子后，发送消息
    @Async
    fun sendCommentMessage(user: LoginUserInfo, post: Post, comment: Comment) {
        //逻辑作废
//        val routeKey = if (post.type == AuthorType.USER) {
//            NoticeMessageMqConst.USER_NOTICE_MESSAGE_ROUTE_KEY
//        } else {
//            NoticeMessageMqConst.BOT_NOTICE_MESSAGE_ROUTE_KEY
//        }
//        val commentContent = StrUtil.subPre(comment.content, 50)
//        rabbitTemplate.convertAndSend(
//            NoticeMessageMqConst.NOTICE_MESSAGE_EXCHANGE, routeKey, JSONUtil.toJsonStr(PostMessageBO().apply {
//                this.id = post.id
//                this.author = post.author
//                this.commentContent = commentContent
//                this.type = PostMessageType.comment
//            })
//        )
        //通知用户,自己评论自己的帖子不发生评论通知
        if (post.type == AuthorType.USER && post.author != comment.creator) {
            this.sendCommentNotification(comment, post)
        }
        //发送通知消息给@的用户
        if (CollUtil.isNotEmpty(comment.replyTo)) {
            this.sendNotificationToAtUser(comment, post)
        }
    }

    private fun sendCommentNotification(comment: Comment, post: Post) {
        //查询评论者名称
        val authorInfo = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, comment.creator).eq(Author::type, AuthorType.USER)
        )
        val userIds = listOf(post.author!!)
        notificationService.sendNotification(NotifyBO().apply {
            this.userIds = userIds
            this.type = NotifyType.comment
            this.authorId = authorInfo?.userId
            this.avatar = authorInfo?.avatar
            this.nickname = authorInfo?.nickname
            this.username = authorInfo?.username
            this.gender = authorInfo?.gender
            this.cover = post.cover
            this.metadata = NotifyMetadata().apply {
                this.postId = post.id
                this.summary = post.summary
                this.type = post.type
                this.likes = post.likes
                this.reposts = (post.reposts ?: 0) + 1
                this.commentId = comment.id
                this.content = comment.content
            }
        })
    }

    private fun sendNotificationToAtUser(comment: Comment, post: Post) {
        //发送通知消息的对象
        val userIds = comment.replyTo!!.map {
            authorMapper.selectOne(
                KtQueryWrapper(Author::class.java).eq(Author::username, it).eq(Author::type, AuthorType.USER)
            )?.userId
        }.filterNotNull()
        if (CollUtil.isNotEmpty(userIds)) {
            //查询评论者名称
            val authorInfo = authorMapper.selectOne(
                KtQueryWrapper(Author::class.java).eq(Author::userId, comment.creator).eq(Author::type, AuthorType.USER)
            )
            notificationService.sendNotification(NotifyBO().apply {
                this.userIds = userIds
                this.type = NotifyType.at
                this.authorId = authorInfo?.userId
                this.avatar = authorInfo?.avatar
                this.nickname = authorInfo?.nickname
                this.username = authorInfo?.username
                this.gender = authorInfo?.gender
                this.cover = post.cover
                this.metadata = NotifyMetadata().apply {
                    this.postId = post.id
                    this.summary = post.summary
                    this.type = post.type
                    this.likes = post.likes
                    this.reposts = (post.reposts ?: 0) + 1
                    this.commentId = comment.id
                    this.content = comment.content
                }
            })
        }
    }


    // 当用户点赞帖子后，发送消息
    @Async
    fun sendThumbMessage(post: Post, fromUserId: Long) {
        //查询评论者名称
        val authorInfo = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, fromUserId).eq(Author::type, AuthorType.USER)
        )
        val userIds = listOf(post.author!!)
        notificationService.sendNotification(NotifyBO().apply {
            this.userIds = userIds
            this.type = NotifyType.thumb
            this.authorId = authorInfo?.userId
            this.avatar = authorInfo?.avatar
            this.nickname = authorInfo?.nickname
            this.username = authorInfo?.username
            this.gender = authorInfo?.gender
            this.cover = post.cover
            this.metadata = NotifyMetadata().apply {
                this.postId = post.id
                this.summary = post.summary
                this.type = post.type
                this.likes = (post.likes ?: 0) + 1
                this.reposts = post.reposts
            }
        })
    }

    // 当用户关注用户后，发送消息
    @Async
    fun syncUserRelationInfo(syncRelationBO: SyncRelationBO, type: AuthorType) {
        val routeKey = if (type == AuthorType.USER) {
            SyncRelationMqConst.USER_RELATION_ROUTE_KEY
        } else {
            SyncRelationMqConst.BOT_RELATION_ROUTE_KEY
        }
        rabbitTemplate.convertAndSend(
            SyncRelationMqConst.RELATION_EXCHANGE, routeKey, JSONUtil.toJsonStr(syncRelationBO)
        )
    }

}
