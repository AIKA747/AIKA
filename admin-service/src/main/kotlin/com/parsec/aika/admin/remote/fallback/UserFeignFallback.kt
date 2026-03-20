package com.parsec.aika.admin.remote.fallback

import com.parsec.aika.admin.model.vo.resp.RemoteUserNumData
import com.parsec.aika.admin.remote.UserFeignClient
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.stereotype.Component

@Component
class UserFeignFallback: UserFeignClient {
    override fun getUserCountryList(): BaseResult<List<String>> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, emptyList())
    }

    override fun getUserNums(date: String, country: String): BaseResult<RemoteUserNumData> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, RemoteUserNumData())
    }
}