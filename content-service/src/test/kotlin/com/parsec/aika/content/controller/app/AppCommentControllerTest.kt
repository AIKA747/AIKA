package com.parsec.aika.content.controller.app

import com.parsec.aika.common.mapper.CommentMapper
import com.parsec.aika.common.mapper.PostMapper
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.CommentCreateVo
import com.parsec.aika.common.model.vo.req.CommentQueryVo
import com.parsec.trantor.exception.core.BusinessException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.util.*
import jakarta.annotation.Resource

@SpringBootTest
internal class AppCommentControllerTest {

    @Resource
    private lateinit var commentController: AppCommentController

    @Resource
    private lateinit var commentMapper: CommentMapper

    @Resource
    private lateinit var postMapper: PostMapper

    private var userInfo: LoginUserInfo = LoginUserInfo()

    @BeforeEach
    fun setBefore() {
        userInfo = LoginUserInfo().apply {
            this.userId = 1874022463235452100
            this.userType = UserTypeEnum.APPUSER
        }
    }

    @Test
    @Sql("/sql/comment_init.sql")
    @Sql( value = ["/sql/clear_comment_post.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun testCreate() {
        val vo = CommentCreateVo().apply {
            this.content = "测试1"
            this.postId = 1
        }

        val result = commentController.createComment(vo, userInfo)
        assertEquals(result.code, 0)
        // 新增接口调用成功后，返回成功后的评论id
        Thread.sleep(3000)
        val saveVo = commentMapper.selectById(result.data.id)
        assertEquals(saveVo.id, result.data.id)
        assertEquals(saveVo.postId, vo.postId)
        assertEquals(1,this.postMapper.selectById(saveVo.postId).reposts)

        val v01 = CommentCreateVo().apply {
            this.voiceUrl = "https://www.test.com/voice.mp3"
            this.postId = 1
        }


        val result01 = commentController.createComment(v01, userInfo)
        assertEquals(result01.code, 0)
        // 新增接口调用成功后，返回成功后的评论id
        val saveVo01 = commentMapper.selectById(result01.data.id)
        assertEquals(saveVo01.id, result01.data.id)
        assertEquals(saveVo01.voiceUrl, v01.voiceUrl)
        Thread.sleep(3000)
        assertEquals(this.postMapper.selectById(saveVo01.postId).reposts, 2)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/comment_init.sql")
    fun testList() {
        val queryVo = CommentQueryVo()
        queryVo.postId = 2
        val result = commentController.getPageList(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        result.data.list.forEach { comment ->
            assertEquals(comment.postId, queryVo.postId)
            if (comment.id == 3) {
                assertEquals(listOf("test1"), comment.replyTo)
            }
        }
    }

    @Test
    @Sql("/sql/comment_init.sql")
    @Sql( value = ["/sql/clear_comment_post.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun testDelete() {
        val id = 1

        //获取查询前的post
        val oldReposts = postMapper.selectById(2).reposts!!

        // 删除前，能查询到数据
        val beforeTag = commentMapper.selectById(id)
        assertNotNull(beforeTag)
        // 删除
        val result = commentController.deleteComment(id, userInfo)
        assertEquals(result.code, 0)
        // 删除后，查询到的数据为空
        val afterTag = commentMapper.selectById(id)
        assertNull(afterTag)

        //删除后，查询Post的reposts数减少1
        Thread.sleep(2000)
        assertEquals(oldReposts - 1,postMapper.selectById(2).reposts)
        // 不能删除没有权限的评论
        assertThrows(BusinessException::class.java) {
            commentController.deleteComment(3, userInfo)
        }


        // 帖子主人，可以删除任意的评论, 也就是说，id为102的用户，可以删除id为4 的评论
        commentController.deleteComment(4, LoginUserInfo().apply {
            this.userId = 1874022463235452102
            this.userType = UserTypeEnum.APPUSER
        })
        Thread.sleep(2000)
        assertEquals(1,postMapper.selectById(3).reposts)


        // 不能删除没有权限的评论
        // 因为这个帖子的作者是一个机器人type=BOT，人类无权删除 。也就是说，不能仅仅依靠post中的author字段来判断是否有权限删除评论，还要结合type字段
        userInfo.userId = 101
        assertThrows(BusinessException::class.java) {
            commentController.deleteComment(3, userInfo)
        }
    }

    @Test
    @Sql("/sql/comment_init.sql")
    @Transactional
    fun testCreateReplyTo() {
        val vo = CommentCreateVo().apply {
            this.content = "测试1@test1"
            this.postId = 3
        }
        val result = commentController.createComment(vo, userInfo)
        assertEquals(result.code, 0)
        val saveVo = commentMapper.selectById(result.data)
        // test1没有对帖子进行评论，所以replyTo字段中应该不包含test1
        assertTrue(!saveVo.replyTo!!.contains("test1"))


        val vo2 = CommentCreateVo().apply {
            this.content = "测试1@test777"
            this.postId = 3
        }
        val result2 = commentController.createComment(vo2, userInfo)
        assertEquals(result2.code, 0)
        val saveVo2 = commentMapper.selectById(result2.data)
        // test777用户不存在，所以replyTo字段中应该不包含test777
        assertTrue(!saveVo2.replyTo!!.contains("test777"))


        //test2用户没有对帖子进行评论，所以replyTo字段中应该不包含test2
         CommentCreateVo().apply {
            this.content = "测试1@test2"
            this.postId = 3
             commentController.createComment(vo2, userInfo).let {
                    assertEquals(it.code, 0)
                    commentMapper.selectById(it.data).let {
                        assertTrue(!saveVo2.replyTo!!.contains("test2"))
                    }
             }
        }



        val vo3 = CommentCreateVo().apply {
            this.content = "测试1@test3"
            this.postId = 3
        }
        val result3 = commentController.createComment(vo3, userInfo)
        assertEquals(result3.code, 0)
        val saveVo3 = commentMapper.selectById(result3.data)
        // test3有对帖子进行评论，所以replyTo字段中应该包含test3
        assertTrue(saveVo3.replyTo!!.contains("test3"))


        val vo4 = CommentCreateVo().apply {
            this.content = "测试1@(test3)"
            this.postId = 3
        }
        val result4 = commentController.createComment(vo4, userInfo)
        assertEquals(result4.code, 0)
        val saveVo4 = commentMapper.selectById(result4.data)
        // @规则匹配失败，所以replyTo字段中应该不包含test3
        assertTrue(!saveVo4.replyTo!!.contains("test3"))


        val vo5 = CommentCreateVo().apply {
            this.content = "没有艾特用户名"
            this.postId = 3
        }
        val result5 = commentController.createComment(vo5, userInfo)
        assertEquals(result5.code, 0)
        val saveVo5 = commentMapper.selectById(result5.data)
        assertTrue(saveVo5.replyTo!!.isEmpty())  // replyTo字段应为空

        //添加多个@用户，确保都放入了replyTo字段中
        val vo6 = CommentCreateVo().apply {
            this.content = "测试3@test3 测试4@test4"
            this.postId = 3
        }
        val result6 = commentController.createComment(vo6, userInfo)
        assertEquals(result6.code, 0)
        val saveVo6 = commentMapper.selectById(result6.data)
        assertTrue(saveVo6.replyTo!!.contains("test3"))
        assertTrue(saveVo6.replyTo!!.contains("test4"))

    }
}
