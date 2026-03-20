package com.parsec.aika.chat.service.impl

import cn.hutool.core.util.StrUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.chat.service.AppUserOnlineService
import com.parsec.aika.common.model.constrant.RedisConst.CHAT_USER_ONLINE_FLAG
import com.parsec.trantor.redis.util.RedisUtil
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class AppUserOnlineServiceImpl : AppUserOnlineService {

    override fun online(userId: Long) {
        val redisKey = StrUtil.format(CHAT_USER_ONLINE_FLAG, userId)
        StaticLog.info("标记用户在线状态：{}", redisKey)
        //标记1分钟过期
        RedisUtil.set(redisKey, "1", 1, TimeUnit.MINUTES)
    }


}