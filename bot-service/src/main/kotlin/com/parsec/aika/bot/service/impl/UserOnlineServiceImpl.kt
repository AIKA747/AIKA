package com.parsec.aika.bot.service.impl

import cn.hutool.core.util.StrUtil
import com.parsec.aika.bot.service.UserOnlineService
import com.parsec.aika.common.model.const.RedisConst.CHAT_USER_ONLINE_FLAG
import com.parsec.trantor.redis.util.RedisUtil
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class UserOnlineServiceImpl : UserOnlineService {


    override fun online(userId: Long): Boolean {
        val redisKey = StrUtil.format(CHAT_USER_ONLINE_FLAG, userId)
        return RedisUtil.hasKey(redisKey)
    }

    override fun onlineFlag(userId: Long): Boolean? {
        val redisKey = StrUtil.format(CHAT_USER_ONLINE_FLAG, userId)
        return RedisUtil.set(redisKey, "1", 1, TimeUnit.MINUTES)
    }
}