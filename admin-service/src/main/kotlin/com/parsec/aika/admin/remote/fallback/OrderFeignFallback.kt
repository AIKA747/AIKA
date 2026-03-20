package com.parsec.aika.admin.remote.fallback

import com.parsec.aika.admin.model.vo.resp.GetIncomeDataResp
import com.parsec.aika.admin.model.vo.resp.GetSubDataResp
import com.parsec.aika.admin.remote.OrderFeignClient
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.stereotype.Component

@Component
class OrderFeignFallback: OrderFeignClient {
    override fun getFeignIncomeData(date: String, country: String): BaseResult<GetIncomeDataResp> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, GetIncomeDataResp())
    }

    override fun getFeignSubscribersData(date: String, country: String): BaseResult<GetSubDataResp> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, GetSubDataResp())
    }

}