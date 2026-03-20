package com.parsec.aika.user.remote.fallback

import com.parsec.aika.user.model.vo.resp.DictionaryResp
import com.parsec.aika.user.remote.BotFeignClient
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class BotFeignFallback : BotFeignClient {
    override fun chatNum(
        userId: Long, minTime: String?, maxTime: String?, botId: Long?
    ): BaseResult<Int> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, 0)
    }

    override fun getDicList(dicType: String?): BaseResult<List<DictionaryResp>> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, emptyList())
    }

    override fun checkBotNameExists(name: String): BaseResult<Boolean> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, false)
    }

    override fun getChatroomMemberNotifycationCount(memberId: Long): Int {
        return 0
    }
}
