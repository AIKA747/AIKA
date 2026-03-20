package com.parsec.aika.content.controller.app

import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.parsec.aika.common.mapper.PostMapper
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.ThreadContent
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.*
import com.parsec.aika.content.service.PostService
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import jakarta.annotation.Resource
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue
import kotlin.test.fail

@SpringBootTest
internal class AppPostControllerTest {

    @Resource
    private lateinit var appPostController: AppPostController

    @Resource
    private lateinit var postService: PostService

    @Resource
    private lateinit var postMapper: PostMapper

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate


    val loginUserInfo = LoginUserInfo().apply {
        this.userId = 1874022463235452931
        username = "test user"

    }
    val loginUserInfo2 = LoginUserInfo().apply {
        this.userId = 2
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostsFeeds__no_condition() {
        val list = appPostController.getPostsFeeds(GetAppContentPostFeedReq(), loginUserInfo).data.list
        assertEquals(6, list.size)
        val data = list[0]
        assertNotNull(data.author)
        assertNotNull(data.nickname)
        assertEquals(1, data.thread!!.size)
        assertEquals("Post content 1", data!!.thread!![0].content)
        assertEquals("title1", data!!.thread!![0].title)
        assertEquals(2, data!!.thread!![0].images.size)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostsThread() {
        val list = appPostController.getPostsThread(GetAppContentPostFeedReq(), loginUserInfo).data.list
        assertEquals(6, list.size)
        assertEquals(1, list[0].postId)
        assertEquals(2, list[0].images!!.size)
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostsThread__keyword() {
        var list = appPostController.getPostsThread(
            GetAppContentPostFeedReq().apply { keywords = "keyword3" }, loginUserInfo
        ).data.list
        assertEquals(1, list.size)
        assertEquals(2, list[0].postId)

        list = appPostController.getPostsThread(
            GetAppContentPostFeedReq().apply { keywords = "Summary 3" }, loginUserInfo
        ).data.list
        assertEquals(1, list.size)
        assertEquals(3, list[0].postId)

    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostsFeeds__order() {
        val list = appPostController.getPostsFeeds(
            GetAppContentPostFeedReq().apply {}, loginUserInfo
        ).data.list
        assertEquals("Post Title 6", list[4].title)
        assertEquals("Post Title 5", list[5].title)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostsFeeds__by_topicTag() {
        val list = appPostController.getPostsFeeds(
            GetAppContentPostFeedReq().apply { this.topicTag = "#tag2" },
            loginUserInfo
        ).data.list
        assertEquals(1, list.size)
        assertEquals("#tag1,#tag2", list[0].topicTags)

        // 测试一下分页是否生效
        appPostController.getPostsFeeds(
            GetAppContentPostFeedReq().apply {
                this.pageSize = 5
                this.pageNo = 2
            }, loginUserInfo
        ).data.list.let { assertEquals(1, it.size) }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostsFeeds__by_keywords() {
        var list = appPostController.getPostsFeeds(
            GetAppContentPostFeedReq().apply { this.keywords = "Title 2" },
            loginUserInfo
        ).data.list
        assertEquals(1, list.size)
        assertEquals("keyword3,keyword4", list[0].keywords)

        list = appPostController.getPostsFeeds(
            GetAppContentPostFeedReq().apply { this.keywords = "Summary 2" },
            loginUserInfo
        ).data.list
        assertEquals(1, list.size)
        assertEquals("keyword3,keyword4", list[0].keywords)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostsFeeds__page() {
        val data = appPostController.getPostsFeeds(
            GetAppContentPostFeedReq().apply { pageSize = 1 }, loginUserInfo
        ).data
        assertEquals(1, data.pageSize)
        assertEquals(6, data.pages)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostsFollow__no_following_users() {
        val req = GetAppContentPostFeedReq().apply {}
        val response = appPostController.getPostsFollow(req, loginUserInfo2)

        // 预期结果应该是空列表
        val list = response.data.list
        assertEquals(0, list.size)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostsFollow__with_following_users() {
        // 假设 userId 1 关注了一些用户，并且这些用户有帖子
        val req = GetAppContentPostFeedReq().apply {}
        val response = appPostController.getPostsFollow(req, loginUserInfo)

        val list = response.data.list
        assertEquals(4, list.size)

        // 验证第一条帖子
        val firstPost = list[0]
        assertNotNull(firstPost.author)
        assertNotNull(firstPost.nickname)
        assertEquals("Post Title 2", firstPost.title)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun getPostsFollow__with_type_bot() {
        // 假设 userId 1 关注了一些用户，并且这些用户有帖子
        val req = GetAppContentPostFeedReq().apply { type = AuthorType.BOT }
        val response = appPostController.getPostsFollow(req, loginUserInfo)

        val list = response.data.list
        assertEquals(1, list.size)

        // 验证第一条帖子
        val firstPost = list[0]
        assertNotNull(firstPost.author)
        assertNotNull(firstPost.nickname)
        assertEquals("Post Title 3", firstPost.title)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    //    我发表的文章
    fun getPostsPrivate__should_return_post_list() {
        val req = GetAppContentPostFeedReq()
        val response = appPostController.getPostsPrivate(req, loginUserInfo)
        val list = response.data.list
        assertEquals(2, list.size)

        // 验证第一条帖子
        val firstPost = list[0]
        assertNotNull(firstPost.author)
        assertNotNull(firstPost.nickname)
        assertEquals("Post Title 1", firstPost.title)

        StaticLog.info(
            "data: id={}, title={}, author={}, nickname={}, summary={}",
            firstPost.id,
            firstPost.title,
            firstPost.author,
            firstPost.nickname,
            firstPost.summary
        )
    }

    @Test
    @Rollback
    @Transactional
    fun testCreatePost() {
        // 测试创建帖子 - 正常情况
        val req = PostAppPostReq().apply {
            title = "Test Post"
            summary = "Test Summary"
            cover = "http://test.com/image.jpg"
            thread = listOf(
                ThreadContent().apply {
                    title = "Thread 1"
                    content = "Content 1"
                    images = listOf("http://test.com/1.jpg")
                })
            topicTags = "test,post"
        }

        val result = appPostController.createPost(req, loginUserInfo)
        assertEquals(0, result.code)
        assertNotNull(result.data)

        // 测试创建帖子 - 从thread获取信息
        val req2 = PostAppPostReq().apply {
            thread = listOf(
                ThreadContent().apply {
                    title = "Thread Title"
                    content = "Thread Content"
                    images = listOf("http://test.com/2.jpg")
                })
            topicTags = "test,post"
        }

        val result2 = appPostController.createPost(req2, loginUserInfo)
        assertEquals(0, result2.code)
        assertNotNull(result2.data)

        // 测试创建帖子 - 所有字段为空
        val req3 = com.parsec.aika.common.model.vo.req.PostAppPostReq().apply {
            thread = listOf(ThreadContent().apply { images = listOf() })
        }

        try {
            appPostController.createPost(req3, loginUserInfo)
            fail("Should throw exception")
        } catch (e: Exception) {
            assertEquals("Title, summary and cover cannot all be empty", e.message)
        }

        // 传一个帖子，其thread第一个节点的cover为空，title和content有值，第二个节点cover有值，post的summary、title、cover都为空，
        // 保存后，post的cover应该是第二个thread节点的cover，title和summary应该是第一个thread节点的title和content
        PostAppPostReq().apply {
            thread = listOf(ThreadContent().apply {
                title = "Thread Title"
                content = "Thread Content"
            }, ThreadContent().apply {
                title = "Thread Title 2"
                content = "Thread Content 2"
                images = listOf("http://test.com/2.jpg")
            })
        }.let { appPostController.createPost(it, loginUserInfo).data!! }

    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/clear_post_index.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun testDeletePost() {
        // 创建测试帖子
        val req = PostAppPostReq().apply {
            title = "Test Post"
            summary = "Test Summary"
            thread = listOf(
                ThreadContent().apply {
                    title = "Thread 1"
                    content = "Content 1"
                })
            topicTags = "test,post"
        }

        val postId = appPostController.createPost(req, loginUserInfo).data!!

        // 测试删除 - 正常情况
        val result = appPostController.deletePost(postId, loginUserInfo)
        assertEquals(0, result.code)

        // 测试删除 - 不存在的帖子
        try {
            appPostController.deletePost(9999, loginUserInfo)
            fail("Should throw exception")
        } catch (e: Exception) {
            assertEquals("Post not found", e.message)
        }

        val req2 = PostAppPostReq().apply {
            title = "Test Post"
            summary = "Test Summary"
            thread = listOf(
                ThreadContent().apply {
                    title = "Thread 1"
                    content = "Content 1"
                })
            topicTags = "test,post"
        }

        val postId2 = appPostController.createPost(req2, loginUserInfo).data!!

        // 测试删除 - 没有权限
        val otherUserInfo = LoginUserInfo().apply {
            userId = 2
            username = "other user"
        }

//        try {
        appPostController.deletePost(postId2, otherUserInfo)
//        fail("Should throw exception")
//        } catch (e: Exception) {
//            assertEquals("No permission to delete this post", e.message)
//        }
    }

    @Test
    @Sql(
        value = ["/sql/clear_comment_post.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD
    )
    fun testThumb() {
        // 创建测试帖子
        val req = PostAppPostReq().apply {
            title = "Test Post"
            summary = "Test Summary"
            thread = listOf(
                ThreadContent().apply {
                    title = "Thread 1"
                    content = "Content 1"
                })
            topicTags = "test,post"
        }

        val postId = appPostController.createPost(req, loginUserInfo).data!!

        // 测试点赞
        val thumbReq = com.parsec.aika.common.model.vo.req.PostAppThumbReq().apply {
            this.postId = postId
            this.thumb = true
        }

        val result = appPostController.thumb(thumbReq, loginUserInfo)
        assertEquals(0, result.code)

        // 验证点赞数为1
        Thread.sleep(2000)

        postService.detail(postId, loginUserInfo).let {
            assertNotNull(it)
            assertEquals(1, it.likes)
            it
        }

        // 测试取消点赞
        thumbReq.thumb = false
        val result2 = appPostController.thumb(thumbReq, loginUserInfo)
        assertEquals(0, result2.code)

        // 测试点赞不存在的帖子
        try {
            thumbReq.postId = 9999
            appPostController.thumb(thumbReq, loginUserInfo)
            fail("Should throw exception")
        } catch (e: Exception) {
            assertEquals("Post not found", e.message)
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/test_post.sql")
    fun getShortcuts() {
        val list = appPostController.getShortcuts(loginUserInfo).data
        assertNotNull(list)
        assertTrue(list.isNotEmpty())

        val firstItem = list[0]
        assertNotNull(firstItem.userId)
        assertNotNull(firstItem.nickname)
        assertNotNull(firstItem.avatar)

        //检查查询出来的firstItem是否是在24小时内发表的
        val post = postMapper.selectById(firstItem.postId)
        assertNotNull(post)
        assertTrue(post.createdAt!!.isAfter(LocalDateTime.now().minusDays(1)))

        //检查查询出来的列表list中，一个userId只能有一条记录
        val userIds = list.map { it.userId }
        assertEquals(userIds.size, userIds.distinct().size)


    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun updateVisits() {
        val list = postMapper.selectList(QueryWrapper())
        val post = list[0]


        // 第一次访问
        val req = PostAppPostVisitReq().apply { this.id = post.id }

        val key = "post:visit:${req.id}:${loginUserInfo.userId}"
        stringRedisTemplate.delete(key)


        appPostController.updateVisits(req, loginUserInfo)

        val exits = postService.selectById(post.id!!)
        assertEquals(101, exits.visits)

        // 5分钟内重复访问
        appPostController.updateVisits(req, loginUserInfo)
        val postAfterSecondVisit = postService.detail(post.id!!, loginUserInfo)
        assertEquals(101, postAfterSecondVisit.visits)


    }

    @Test
    @Transactional
    @Rollback
    @Sql("/sql/post_comment_user_test.sql")
    fun testGetCommentUsers() {
        GetCommentUsersReq().apply {
            pageNo = 1
            pageSize = 10
            username = "test"
        }.let {
            val result = appPostController.getCommentUsers(1, it, loginUserInfo)
            // 没有评论
            assertEquals(listOf("author"), result.data.list)
        }

        GetCommentUsersReq().apply {
            pageNo = 1
            pageSize = 10
            username = "test"
        }.let {
            val result = appPostController.getCommentUsers(2, it, loginUserInfo)
            // 验证前缀匹配并且test3 type不匹配
            assertEquals(listOf("test1", "test2", "author"), result.data.list)
        }

        GetCommentUsersReq().apply {
            pageNo = 1
            pageSize = 10
            username = "test1"
        }.let {
            val result = appPostController.getCommentUsers(2, it, loginUserInfo)
            assertEquals(listOf("test1", "author"), result.data.list)
        }
    }

    //测试获取帖子详情
    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppPostControllerList.sql")
    fun detail() {
        val result = appPostController.detail(1, loginUserInfo)
        assertNotNull(result.data)
        assertEquals("Post Title 1", result.data.title)
        assertEquals("Post content 1", result.data.thread!![0].content)
        //测试avatar和nickname
        assertEquals("avatar1.png", result.data.avatar)
        assertEquals("Author1", result.data.nickname)

    }

    @Test
    @Rollback
    @Transactional
    fun createBotPost() {
        val botPostReq = BotPostReq().apply {
            botId = 1
            title = "Bot Post Title"
            summary = "Bot Post Summary"
            cover = "bot_post_cover.png"
        }
        val botPost = postService.createBotPost(botPostReq)
        assertTrue(botPost > 0)
    }

}
