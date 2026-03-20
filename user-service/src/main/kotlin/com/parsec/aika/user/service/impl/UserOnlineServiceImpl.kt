package com.parsec.aika.user.service.impl

import cn.hutool.core.util.StrUtil
import com.parsec.aika.common.model.constant.RedisCont.CHAT_USER_ONLINE_FLAG
import com.parsec.aika.user.service.UserOnlineService
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit
import javax.annotation.Resource

@Service
class UserOnlineServiceImpl : UserOnlineService {

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    override fun online(userId: Long): Boolean {
        val redisKey = StrUtil.format(CHAT_USER_ONLINE_FLAG, userId)
        return stringRedisTemplate.hasKey(redisKey)
    }

    override fun onlineFlag(userId: Long) {
        val redisKey = StrUtil.format(CHAT_USER_ONLINE_FLAG, userId)
        stringRedisTemplate.opsForValue().set(redisKey, "1", 1, TimeUnit.MINUTES)
    }
}