package com.parsec.aika.chat.remote.fallback

import com.parsec.aika.chat.remote.UserFeignClient
import com.parsec.aika.common.model.dto.CheckUserChatDTO
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.stereotype.Component

@Component
class UserFeignFallback : UserFeignClient {
    override fun checkUserChatInfo(
        userId: Long, botId: Long?, storyId: Long?, country: String?
    ): BaseResult<CheckUserChatDTO> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, null)
    }
}