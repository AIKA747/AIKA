package com.parsec.aika.content.service

import com.parsec.aika.common.model.entity.Post

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/29.
 */
interface PostIndexService {
    fun createPostIndices(post:Post)

    fun deletePostIndices(postId:Int)
}
