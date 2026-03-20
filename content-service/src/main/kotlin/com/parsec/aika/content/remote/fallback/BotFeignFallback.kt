package com.parsec.aika.content.remote.fallback

import com.parsec.aika.common.model.vo.req.BotImageUpdateReq
import com.parsec.aika.content.remote.BotFeignClient
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.stereotype.Component

@Component
class BotFeignFallback : BotFeignClient {
    override fun updateBotImage(req: BotImageUpdateReq): BaseResult<*> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, null)
    }
}