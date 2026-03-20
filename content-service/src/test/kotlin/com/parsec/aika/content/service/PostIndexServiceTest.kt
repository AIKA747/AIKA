package com.parsec.aika.content.service

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.parsec.aika.common.mapper.PostIndexMapper
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.entity.PostIndex
import com.parsec.aika.common.model.entity.ThreadContent
import org.junit.jupiter.api.Assertions
import jakarta.annotation.Resource
import kotlin.test.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
class PostIndexServiceTest {

  @Resource private lateinit var postIndexService: PostIndexService

  @Resource private lateinit var postIndexMapper: PostIndexMapper

  @Test
  @Rollback
  @Transactional
  fun testCreatePostIndices() {
    // 创建测试Post
    val post =
            Post().apply {
              id = 1
              thread =
                      listOf(
                              ThreadContent().apply { content = "Test content 1" },
                              ThreadContent().apply { content = "Test content 2" }
                      )
            }

    // 调用创建索引
    postIndexService.createPostIndices(post)

    // 等待异步执行完成
    Thread.sleep(1000)

    // 验证结果
    val indices = postIndexMapper.selectList(QueryWrapper<PostIndex>().eq("postId", post.id))

    assertEquals(2, indices.size)
    assertEquals(0, indices[0].threadIndex)
    assertEquals(1, indices[1].threadIndex)
    assertEquals("Test content 1", indices[0].summary)
    assertEquals("Test content 2", indices[1].summary)
  }

    @Test
    @Sql("/sql/clear_post_index.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    fun testCreatePostIndicesWithLongContent() {
        val longContent = "a".repeat(1000) // 长度超过500字符
        val post = Post().apply {
            id = 3
            thread = listOf(
                ThreadContent().apply { content = longContent }
            )
        }

        postIndexService.createPostIndices(post)

        // 等待异步执行完成
        Thread.sleep(1000)

        // 验证 summary 只包含前500个字符
        val indices = postIndexMapper.selectList(QueryWrapper<PostIndex>().eq("postId", post.id))
        assertEquals(1, indices.size)
        assertEquals(longContent.take(500), indices[0].summary)
    }

  @Test
  fun testDeletePostIndices() {
    // 创建测试数据
    val postId = 1
    postIndexMapper.insert(
            PostIndex().apply {
              this.postId = postId
              this.threadIndex = 0
            }
    )

    // 调用删除
    postIndexService.deletePostIndices(postId)

    // 等待异步执行完成
    Thread.sleep(1000)

    // 验证结果
    val count = postIndexMapper.selectCount(QueryWrapper<PostIndex>().eq("postId", postId))
    assertEquals(0, count)
  }


    @Test
    fun testDeleteMultiplePostIndices() {
        val postId = 3
        postIndexMapper.insert(
            PostIndex().apply {
                this.postId = postId
                this.threadIndex = 0
            }
        )
        postIndexMapper.insert(
            PostIndex().apply {
                this.postId = postId
                this.threadIndex = 1
            }
        )

        // 调用删除
        postIndexService.deletePostIndices(postId)

        // 等待异步执行完成
        Thread.sleep(1000)

        // 验证删除了所有相关的 PostIndex 数据
        val count = postIndexMapper.selectCount(QueryWrapper<PostIndex>().eq("postId", postId))
        assertEquals(0, count)
    }
}
