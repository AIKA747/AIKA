package com.parsec.aika.content.service

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.common.mapper.AuthorMapper
import com.parsec.aika.common.mapper.PostMapper
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.Author
import com.parsec.aika.common.model.entity.Post
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.jdbc.Sql
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import jakarta.annotation.Resource
import kotlin.math.exp
import kotlin.random.Random


@SpringBootTest
class AuthorServiceTest {


    @Resource
    private lateinit var authorService: AuthorService

    @Resource
    private lateinit var authorMapper: AuthorMapper

    @Resource
    private lateinit var postMapper: PostMapper



    @Test
    @Sql(value = ["/sql/author_pop_init.sql","/sql/post_pop_test.sql"], executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql( value = ["/sql/author_pop_clear.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun testAuthorPop() {
        // AuthorType不匹配更新失败
        authorService.updateAuthorPopDegree(100, AuthorType.USER)
        Thread.sleep(1000)
        val author = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java)
                .eq(Author::userId, 100))
        Assertions.assertTrue(author.pop!! <= 0)

        // 正确更新 pop
        authorService.updateAuthorPopDegree(100, AuthorType.BOT)
        Thread.sleep(1000)
        val author1 = authorMapper.selectOne(
                KtQueryWrapper(Author::class.java)
                    .eq(Author::userId, 100))
        Assertions.assertTrue(author1.pop!! > 0)
        Assertions.assertNotNull(author1.popUpdatedAt)

        // 数据已过期，更新pop为0
        authorService.updateAuthorPopDegree(101, AuthorType.USER)
        Thread.sleep(1000)
        val author2 = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java)
                .eq(Author::userId, 101))
        Thread.sleep(1000)
        Assertions.assertTrue(author2.pop!! <= 0)
    }


    @Test
    @Sql(value = ["/sql/author_pop_init.sql","/sql/post_pop_test.sql"], executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql( value = ["/sql/author_pop_clear.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun testMultiplePostsPopAverage() {
        val posts = postMapper.selectList(KtQueryWrapper(Post::class.java).eq(Post::author, 100))
        val totalPop = posts.sumOf<Post?> { post ->
            val days = ChronoUnit.DAYS.between( LocalDateTime.now().minusDays(30),post!!.createdAt)+1 // 修正：手动计算日期差
            if (days <= 0) {
                return@sumOf 0.0
            }
            val visits = post.visits ?: 0
            (0.4 * days) + (0.6 * 13 * exp(1 - 1.0 / (visits + 1)))
        }
        val averagePop = totalPop / 9

        authorService.updateAuthorPopDegree(100, AuthorType.BOT)

        Thread.sleep(1000)

        val author = authorMapper.selectOne(KtQueryWrapper(Author::class.java).eq(Author::userId, 100))

        Assertions.assertEquals(averagePop, author.pop!!, 0.01)
    }


    @Test
    @Sql(value = ["/sql/author_pop_init.sql","/sql/post_pop_test.sql"], executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql( value = ["/sql/author_pop_clear.sql"], executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun testPopUpdatedAt() {
        val authorBefore = authorMapper.selectOne(KtQueryWrapper(Author::class.java).eq(Author::userId, 100))
        val initialPopUpdatedAt = authorBefore.popUpdatedAt

        // 更新流行度
        authorService.updateAuthorPopDegree(100, AuthorType.BOT)

        Thread.sleep(1000)

        val authorAfter = authorMapper.selectOne(KtQueryWrapper(Author::class.java).eq(Author::userId, 100))
        Assertions.assertNotNull(authorAfter.popUpdatedAt)
        Assertions.assertNotEquals(initialPopUpdatedAt, authorAfter.popUpdatedAt)
    }

}
