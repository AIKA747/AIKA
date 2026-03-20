package com.parsec.aika.content.remote.fallback

import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.vo.AppUserVO
import com.parsec.aika.content.remote.UserFeignClient
import org.springframework.stereotype.Component

@Component
class UserFeignFallback : UserFeignClient {
    override fun userInfo(userId: Long): AppUserVO? {
        StaticLog.error("调用用户服务获取用户信息失败...")
        return null
    }

    override fun getBlockedUserIdList(userId: Long): List<Long>? {
        StaticLog.error("获取屏蔽用户ID集合失败...")
        return null
    }

}