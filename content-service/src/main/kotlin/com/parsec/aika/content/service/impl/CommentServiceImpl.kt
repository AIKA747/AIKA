package com.parsec.aika.content.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.AuthorMapper
import com.parsec.aika.common.mapper.CommentMapper
import com.parsec.aika.common.mapper.PostMapper
import com.parsec.aika.common.model.bo.GorseCategory
import com.parsec.aika.common.model.bo.GorseItemBO
import com.parsec.aika.common.model.bo.GorseMethod
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.Author
import com.parsec.aika.common.model.entity.Comment
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.CommentCreateVo
import com.parsec.aika.common.model.vo.req.CommentQueryVo
import com.parsec.aika.common.model.vo.resp.CommentResp
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.remote.UserFeignClient
import com.parsec.aika.content.service.CommentService
import com.parsec.aika.content.service.GorseService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import jakarta.annotation.Resource
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class CommentServiceImpl : CommentService {

    @Resource
    private lateinit var commentMapper: CommentMapper

    @Resource
    private lateinit var noticeService: NoticeService

    @Resource
    private lateinit var postMapper: PostMapper

    @Resource
    private lateinit var authorMapper: AuthorMapper

    @Resource
    private lateinit var userFeignClient: UserFeignClient

    @Resource
    private lateinit var gorseService: GorseService

    override fun pageList(req: CommentQueryVo): PageResult<CommentResp> {
        req.blockedUserIdList = userFeignClient.getBlockedUserIdList(req.loginUserId!!)
        val page = Page<CommentResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<CommentResp>().page(commentMapper.commentPageList(page, req))
    }

    override fun create(vo: CommentCreateVo, user: LoginUserInfo): Comment {
        Assert.isTrue(vo.content != null || vo.voiceUrl != null, "content or voiceUrl can not be null")
        val post = checkPost(vo.postId!!)
        val comment = Comment().apply {
            this.content = vo.content
            this.postId = vo.postId!!
            this.voiceUrl = vo.voiceUrl
            this.creator = user.userId
            this.type = AuthorType.USER
            if (this.content != null) {
                this.replyTo = extractUsernames(post, vo.content!!)
            }
            this.createdAt = LocalDateTime.now()
            this.updatedAt = LocalDateTime.now()
            this.fileProperty = vo.fileProperty
            this.replyCommontInfo = vo.replyCommontInfo
        }

        commentMapper.insert(comment)
        noticeService.sendCommentMessage(user, post, comment)

        if (StrUtil.isNotBlank(comment.content)) {
            gorseService.syncItem(GorseItemBO().apply {
                this.method = GorseMethod.save
                this.itemId = "comment${comment.id}"
                this.category = GorseCategory.comment
                this.comment = comment.content
                this.labels = emptyList()
            })
        }
        return comment
    }

    override fun delete(id: Int, user: LoginUserInfo, callback: (postId: Int) -> Unit) {
        val comment = this.checkComment(id)
        val post = this.checkPost(comment.postId!!)
        val author = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, user.userId)
        ) ?: throw BusinessException("User Author does not exist")
        if (user.userId == comment.creator || (user.userId == post.author && author.type == post.type)) {
            commentMapper.deleteById(id)
            callback(post.id!!)
        } else {
            throw BusinessException("You do not have permission to delete this comment")
        }
        if (StrUtil.isNotBlank(comment.content)) {
            gorseService.syncItem(GorseItemBO().apply {
                this.method = GorseMethod.del
                this.itemId = "comment${comment.id}"
            })
        }
    }

    @Async
    override fun updatePostCommentCount(postId: Int) {
        val post = this.checkPost(postId)
        post.reposts = this.countPostComment(postId)
        postMapper.updateById(post)
    }

    override fun replyUsernames(post: Post, username: String?): List<String> {
        val authorName = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, post.author)
        )?.username ?: throw BusinessException("Author does not exist")

        return this.queryReplyUsers(post).mapNotNull {
            authorMapper.selectOne(
                KtQueryWrapper(Author::class.java).eq(Author::userId, it.first).eq(Author::type, it.second)
                    .likeRight(username != null, Author::username, username)
            )?.username
        }.toList().plus(authorName)
    }

    override fun userPageList(pageNo: Int, pageSize: Int, userId: Long?, loginUserId: Long): PageResult<CommentResp>? {
        val blockedUserIdList = userFeignClient.getBlockedUserIdList(loginUserId)
        if (blockedUserIdList !== null && blockedUserIdList.contains(userId!!.toLong())) throw RuntimeException("You have blocked this user")
        val page = Page<CommentResp>(pageNo.toLong(), pageSize.toLong())
        return PageUtil<CommentResp>().page(commentMapper.userPageList(page, userId ?: loginUserId, loginUserId))
    }

    override fun editComment(vo: CommentCreateVo, user: LoginUserInfo): Int? {
        val comment = this.commentMapper.selectById(vo.id) ?: throw BusinessException("Comment does not exist")
        if (comment.creator != user.userId) {
            throw BusinessException("You are not allowed to edit this comment")
        }
        comment.content = vo.content
        comment.voiceUrl = vo.voiceUrl
        comment.fileProperty = vo.fileProperty
        comment.updatedAt = LocalDateTime.now()
        this.commentMapper.updateById(comment)
        if (StrUtil.isNotBlank(comment.content)) {
            gorseService.syncItem(GorseItemBO().apply {
                this.method = GorseMethod.save
                this.itemId = "comment${comment.id}"
                this.category = GorseCategory.comment
                this.comment = comment.content
                this.labels = emptyList()
            })
        }
        return comment.id
    }

    private fun countPostComment(postId: Int): Long {
        return this.commentMapper.selectCount(
            KtQueryWrapper(Comment::class.java).eq(Comment::postId, postId)
        )
    }

    private fun checkPost(id: Int): Post {
        val post = postMapper.selectById(id)
        Assert.notNull(post, "Post does not exist")
        return post
    }

    private fun checkComment(id: Int): Comment {
        val comment = commentMapper.selectById(id)
        Assert.notNull(comment, "Comment does not exist")
        return comment
    }

    private fun queryReplyUsers(post: Post): List<Pair<Long, AuthorType>> {
        return commentMapper.selectList(
            KtQueryWrapper(Comment::class.java).eq(Comment::postId, post.id)
        ).map { it.creator!! to it.type!! }.distinct()
    }

    private fun extractUsernames(post: Post, content: String): List<String> {

        if (content.isEmpty()) {
            return emptyList()
        }
        val replyUsernames = this.replyUsernames(post, null)
        if (replyUsernames.isEmpty()) {
            return emptyList()
        }
        val regex = Regex("@(\\S+)")
        return regex.findAll(content).map { it.groupValues[1] }.filter {
            replyUsernames.contains(it) && this.authorMapper.selectCount(
                KtQueryWrapper(Author::class.java).eq(
                    Author::username, it
                )
            ) > 0
        }.toList()
    }
}
