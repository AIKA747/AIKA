package com.parsec.aika.content.service.impl

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper
import com.parsec.aika.common.mapper.PostIndexMapper
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.entity.PostIndex
import com.parsec.aika.content.service.PostIndexService
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import jakarta.annotation.Resource

@Service
class PostIndexServiceImpl : PostIndexService {

  @Resource private lateinit var postIndexMapper: PostIndexMapper

  @Async
  @Transactional
  override fun createPostIndices(post: Post) {
    if(post.id == null) return
    // 删除已存在的索引
    postIndexMapper.delete(QueryWrapper<PostIndex>().eq("postId", post.id))

    // 为每个thread节点创建索引
    post.thread?.forEachIndexed { index, content ->
      val summary = content.content?.take(500)

      postIndexMapper.insert(
              PostIndex().apply {
                this.postId = post.id
                this.summary = summary
                this.threadIndex = index
                this.createdAt = LocalDateTime.now()
                this.updatedAt = LocalDateTime.now()
              }
      )
    }
  }

  @Async
  @Transactional
  override fun deletePostIndices(postId: Int) {
    postIndexMapper.delete(QueryWrapper<PostIndex>().eq("postId", postId))
  }
}
