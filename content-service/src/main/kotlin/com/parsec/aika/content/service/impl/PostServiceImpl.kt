package com.parsec.aika.content.service.impl

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.*
import com.parsec.aika.common.model.bo.*
import com.parsec.aika.common.model.dto.PostDto
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.BotPostReq
import com.parsec.aika.common.model.vo.req.PostAppPostReq
import com.parsec.aika.common.model.vo.req.PostAppPostVisitReq
import com.parsec.aika.common.model.vo.resp.GetAppShortcutResp
import com.parsec.aika.common.model.vo.resp.ManagePostListResp
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.remote.UserFeignClient
import com.parsec.aika.content.service.*
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import jakarta.annotation.Resource
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit

@Service
class PostServiceImpl : PostService {

    @Autowired
    private lateinit var followRelationMapper: FollowRelationMapper

    @Resource
    private lateinit var postMapper: PostMapper

    @Resource
    private lateinit var thumbMapper: ThumbMapper

    @Resource
    private lateinit var noticeService: NoticeService

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    @Resource
    private lateinit var authorService: AuthorService

    @Resource
    private lateinit var postIndexService: PostIndexService

    @Resource
    private lateinit var authorMapper: AuthorMapper

    @Resource
    private lateinit var postBlockedMapper: PostBlockedMapper

    @Resource
    private lateinit var notificationService: NotificationService

    @Resource
    private lateinit var moderationsService: ModerationsService

    @Resource
    private lateinit var postConfigService: PostConfigService

    @Resource
    private lateinit var sensitiveWordsService: SensitiveWordsService

    @Resource
    private lateinit var userFeignClient: UserFeignClient

    @Resource
    private lateinit var gorseService: GorseService

    override fun createPost(req: PostAppPostReq, loginUserInfo: LoginUserInfo): Int {
        //校验用户敏感信息
        val createBlockedEnabled = postConfigService.postCreateBlockedEnabled()
        if (createBlockedEnabled) {
            //查询作者被标注发布敏感贴子次数
            val num = postMapper.sensitivePostsNum(loginUserInfo.userId)
            val blockedNumber = postConfigService.postCreateBlockedNumber()
            Assert.state(
                num < blockedNumber,
                "There are too many posts containing sensitive information, and the system will limit you from posting new posts. Please contact the administrator first to handle this"
            )
        }

        // 处理标题、摘要和封面
        var title = req.title
        var summary = req.summary
        var cover = req.cover

        // 如果为空则从thread中获取
        if (title.isNullOrBlank() || summary.isNullOrBlank() || cover.isNullOrBlank()) {
            val firstContent = req.thread?.firstOrNull {
                it.title.isNotBlank() && it.content.isNotBlank()
            }

            if (title.isNullOrBlank()) {
                title = firstContent?.title
            }
            if (summary.isNullOrBlank()) {
                summary = firstContent?.content
            }
            if (cover.isNullOrBlank()) {
                cover = req.thread?.firstNotNullOfOrNull { it.images?.firstOrNull() }
            }
        }

        // 校验必填字段
        Assert.isFalse(
            title.isNullOrBlank() && summary.isNullOrBlank() && cover.isNullOrBlank(),
            "Title, summary and cover cannot all be empty"
        )

        val post = Post().apply {
            this.title = title
            this.summary = summary ?: ""
            this.cover = cover
            this.thread = req.thread
            this.topicTags = req.topicTags
            this.author = loginUserInfo.userId
            this.type = AuthorType.USER
            this.likes = 0
            this.reposts = 0
            this.visits = 0
            this.createdAt = LocalDateTime.now()
            this.updatedAt = LocalDateTime.now()
        }

        postMapper.insert(post)

        // 异步创建索引
        postIndexService.createPostIndices(post)

        //发送通知
        this.sendNotification(post)

        //同步一下数据到gorse
        gorseService.syncItem(GorseItemBO().apply {
            this.category = GorseCategory.post
            this.itemId = "post${post.id}"
            this.comment = post.summary
            this.labels = post.recommendTags?.split(",")
            this.method = GorseMethod.save
        })

        return post.id!!
    }

    private fun sendNotification(post: Post) {
        //查询关注我的用户id集合（通知对象）
        val userIds = followRelationMapper.selectList(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::followingId, post::author)
                .eq(FollowRelation::type, post.type).eq(FollowRelation::agreed, true)
        ).mapNotNull(FollowRelation::creator)

        if (CollUtil.isNotEmpty(userIds)) {
            //查询作者信息
            val authorInfo = authorMapper.selectOne(
                KtQueryWrapper(Author::class.java).eq(Author::userId, post.author).eq(Author::type, post.type)
            )
            //给关注该作者的用户发送创建新帖子的通知
            notificationService.sendNotification(NotifyBO().apply {
                this.userIds = userIds
                this.type = NotifyType.post
                this.authorId = post.author
                this.cover = post.cover
                this.username = authorInfo?.username
                this.gender = authorInfo?.gender
                this.avatar = authorInfo?.avatar
                this.nickname = authorInfo?.nickname
                this.createdAt = LocalDateTime.now()
                this.metadata = NotifyMetadata().apply {
                    this.postId = post.id
                    this.summary = post.summary
                    this.likes = post.likes
                    this.reposts = post.reposts
                    this.type = post.type
                }
            })
        }

    }

    override fun deletePost(id: Int, loginUserInfo: LoginUserInfo) {
        val post = postMapper.selectById(id)
        Assert.notNull(post, "Post not found")
//        Assert.isTrue(
//            post.type == AuthorType.USER && post.author == loginUserInfo.userId, "No permission to delete this post"
//        )
        if (post.type == AuthorType.USER && post.author == loginUserInfo.userId) {
            postMapper.deleteById(id)
            // 异步删除索引
            postIndexService.deletePostIndices(id)
            gorseService.syncItem(GorseItemBO().apply {
                itemId = "post$id"
                method = GorseMethod.del
            })
        } else {
            //自己不想看某个帖子，屏蔽掉别人的帖子
            postBlockedMapper.insert(PostBlocked().apply {
                this.postId = id
                this.creator = loginUserInfo.userId
                this.createdAt = LocalDateTime.now()
            })
        }
    }

    @Transactional
    override fun thumb(req: com.parsec.aika.common.model.vo.req.PostAppThumbReq, loginUserInfo: LoginUserInfo) {
        val post = postMapper.selectById(req.postId)
        Assert.notNull(post, "Post not found")

        val thumb = thumbMapper.selectOne(
            QueryWrapper<Thumb>().eq("postId", req.postId).eq("creator", loginUserInfo.userId)
        )

        if (req.thumb!!) {
            if (thumb == null) {
                // 添加点赞记录
                thumbMapper.insert(
                    Thumb(
                        postId = req.postId, creator = loginUserInfo.userId, createdAt = LocalDateTime.now()
                    )
                )
                // 异步发送消息,自己给自己点赞不应该发通知
                if (post.type == AuthorType.USER && post.author != loginUserInfo.userId) {
                    noticeService.sendThumbMessage(post, loginUserInfo.userId!!)
                }
                gorseService.syncFeedback(GorseFeedbackBO().apply {
                    userId = loginUserInfo.userId.toString()
                    itemId = "post${post.id}"
                    feedbackType = GorseFeedbackType.like
                    method = GorseMethod.save
                    comment = "点赞"
                })
            }
        } else {
            if (thumb != null) {
                // 取消点赞
                thumbMapper.deleteById(thumb.id)
                gorseService.syncFeedback(GorseFeedbackBO().apply {
                    userId = loginUserInfo.userId.toString()
                    itemId = "post${post.id}"
                    feedbackType = GorseFeedbackType.like
                    method = GorseMethod.del
                })
            }
        }
    }

    override fun detail(id: Int, loginUserInfo: LoginUserInfo): PostDto {
        val post = postMapper.selectById(id) ?: throw BusinessException("Post does not exist")

        val blockedUserIds = userFeignClient.getBlockedUserIdList(loginUserInfo.userId!!)
        if (blockedUserIds != null && blockedUserIds.contains(post.author)) throw BusinessException("You have blocked the user")

        val postDto = PostDto()
        BeanUtils.copyProperties(post, postDto)
        authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, post.author).eq(Author::type, post.type)
        )?.let {
            postDto.nickname = it.nickname
            postDto.avatar = it.avatar
        }
        //查询是否点赞
        postDto.thumbed = thumbMapper.selectCount(
            QueryWrapper<Thumb>().eq("postId", id).eq("creator", loginUserInfo.userId)
        ) > 0

        gorseService.syncFeedback(GorseFeedbackBO().apply {
            userId = loginUserInfo.userId.toString()
            itemId = "post${post.id}"
            feedbackType = GorseFeedbackType.read
            method = GorseMethod.save
        })
        return postDto
    }

    @Async
    override fun updatePostLikes(postId: Int) {
        // 统计点赞数
        val count = thumbMapper.selectCount(QueryWrapper<Thumb>().eq("postId", postId))

        // 更新帖子点赞数
        postMapper.updateById(Post().apply {
            this.id = postId
            this.likes = count
        })
    }

    override fun getShortcuts(loginUserInfo: LoginUserInfo): List<GetAppShortcutResp> {
        val blockedUserIds = userFeignClient.getBlockedUserIdList(loginUserInfo.userId!!)
        return postMapper.getShortcuts(loginUserInfo.userId!!, blockedUserIds)
    }

    @Transactional
    override fun updateVisits(req: PostAppPostVisitReq, loginUserInfo: LoginUserInfo) {
        val post = postMapper.selectById(req.id) ?: return


        // 检查Redis中是否存在访问记录
        val key = "post:visit:${req.id}:${loginUserInfo.userId}"
        if (stringRedisTemplate.hasKey(key)) {
            return
        }

        // 更新访问数
        postMapper.updateById(Post().apply {
            this.id = req.id
            this.visits = (post.visits ?: 0) + 1
        })

        // 设置Redis过期时间
        stringRedisTemplate.opsForValue().set(key, "1", 5, TimeUnit.MINUTES)

        // 异步更新作者热度
        authorService.updateAuthorPopDegree(post.author!!, post.type!!)
    }

    override fun selectById(id: Int): Post {
        return postMapper.selectById(id) ?: throw BusinessException("Post does not exist")
    }

    override fun createBotPost(req: BotPostReq): Int {
        // 校验必填字段
        Assert.isFalse(
            req.title.isNullOrBlank() && req.summary.isNullOrBlank() && req.cover.isNullOrBlank(),
            "Title, summary and cover cannot all be empty"
        )
        if (CollUtil.isEmpty(req.thread)) {
            req.thread = listOf(ThreadContent().apply {
                this.title = req.title ?: ""
                this.images = listOf(req.cover)
                this.content = req.summary ?: ""
            })
        }

        val post = Post().apply {
            this.title = req.title
            this.summary = req.summary
            this.cover = req.cover
            this.thread = req.thread
            this.topicTags = req.topicTags
            this.author = req.botId
            this.type = AuthorType.BOT
            this.likes = 0
            this.reposts = 0
            this.visits = 0
            this.createdAt = LocalDateTime.now()
            this.updatedAt = LocalDateTime.now()
        }
        postMapper.insert(post)
        // 异步创建索引
        postIndexService.createPostIndices(post)

        //发送通知
        this.sendNotification(post)
        return post.id!!
    }

    override fun getPostPage(
        pageNo: Int, pageSize: Int, searchWord: String?, flagged: Boolean?
    ): PageResult<ManagePostListResp>? {
        val page = Page<ManagePostListResp>(pageNo.toLong(), pageSize.toLong())
        return PageUtil<ManagePostListResp>().page(postMapper.getPostList(page, searchWord, flagged))
    }

    override fun postBlocked(ids: List<Int>, blocked: Boolean): Int {
        return postMapper.update(Post().apply {
            this.blocked = blocked
        }, KtUpdateWrapper(Post::class.java).`in`(Post::id, ids))
    }

    override fun deletePosts(ids: List<Int>): Int? {
        return postMapper.deleteBatchIds(ids)
    }

    /**
     * 异步检查
     */
    @Async
    override fun moderations(postId: Int) {
        //查询post内容详情
        val post = postMapper.selectById(postId) ?: throw BusinessException("Post does not exist")
        //提取需要检查的字符串
        val arrStr = ArrayList<String?>()
        if (StrUtil.isNotBlank(post.title)) {
            arrStr.add(post.title)
        }
        if (StrUtil.isNotBlank(post.summary)) {
            arrStr.add(post.summary)
        }
        if (CollUtil.isNotEmpty(post.thread)) {
            post.thread!!.forEach {
                if (StrUtil.isNotBlank(it.title)) {
                    arrStr.addAll(listOf(it.title))
                }
                if (StrUtil.isNotBlank(it.content)) {
                    arrStr.add(it.content)
                }
            }
        }
        val text = arrStr.distinct().joinToString(";")
        //检查系统管理端内置的敏感词库
        var pair = sensitiveWordsService.check(text)
        if (null == pair) {
            pair = moderationsService.moderations(text)
        }
        if (pair != null) {
            postMapper.update(Post().apply {
                this.flagged = pair.first
                this.categories = pair.second
            }, KtUpdateWrapper(Post::class.java).eq(Post::id, postId))
        }
    }
}
