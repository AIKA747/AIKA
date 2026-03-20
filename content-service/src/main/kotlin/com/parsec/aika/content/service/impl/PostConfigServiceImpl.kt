package com.parsec.aika.content.service.impl

import com.parsec.aika.content.service.PostConfigService
import org.springframework.stereotype.Service
import jakarta.annotation.Resource
import org.springframework.data.redis.core.RedisTemplate

/**
 * 緩存的配置信息
 */
@Service
class PostConfigServiceImpl : PostConfigService {

    @Resource
    private lateinit var redisTemplate: RedisTemplate<String, Any>

    private final val postCacheConfigKey = "glob:cache:confg:post"

    private final val postCreateBlockedEnabledKey = "glob:cache:confg:post:enabled"
    private final val postCreateBlockedNumberKey = "glob:cache:confg:post:number"

    override fun postCreateBlockedEnabled(): Boolean {
        val postCreateBlockedEnabled =
            redisTemplate.opsForHash<String, Any>().get(postCacheConfigKey, postCreateBlockedEnabledKey) ?: return true
        return postCreateBlockedEnabled as Boolean
    }

    override fun postCreateBlockedNumber(): Int {
        val postCreateBlockedNumber =
            redisTemplate.opsForHash<String, Any>().get(postCacheConfigKey, postCreateBlockedNumberKey) ?: return 3
        return postCreateBlockedNumber as Int
    }

    override fun setPostCreateBlockedEnabled(value: Boolean) {
        redisTemplate.opsForHash<String, Any>().put(postCacheConfigKey, postCreateBlockedEnabledKey, value)
    }

    override fun setPostCreateBlockedNumber(value: Int) {
        redisTemplate.opsForHash<String, Any>().put(postCacheConfigKey, postCreateBlockedNumberKey, value)
    }

}