package com.parsec.aika.bot.remote.fallback

import cn.hutool.log.StaticLog
import com.parsec.aika.bot.remote.UserFeignClient
import com.parsec.aika.common.model.dto.AppUserVO
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.stereotype.Component

@Component
class UserFeignClientFallback : UserFeignClient {
    override fun createBotUserTask(taskId: Int, cron: String): BaseResult<*> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR)
    }

    override fun createBotPostTask(
        botId: Long, cron: String
    ): BaseResult<*> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR)
    }

    override fun userInfo(userId: Long): AppUserVO? {
        StaticLog.error("Call user service to get user information failed...")
        return null
    }
}
