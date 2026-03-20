package com.parsec.aika.chat.remote.fallback

import com.parsec.aika.chat.remote.ContentFeignClient
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.stereotype.Component

@Component
class ContentFeignFallback : ContentFeignClient {

    override fun moderations(text: String): BaseResult<Boolean?> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, null)
    }

}