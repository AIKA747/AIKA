package com.parsec.aika.order.service

import com.parsec.aika.common.model.entity.Order
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.GetManageCountryIncomeRankingReq
import com.parsec.aika.order.model.vo.req.GetManageOrdersReq
import com.parsec.aika.order.model.vo.req.OrderEndpointQueryVo
import com.parsec.aika.order.model.vo.resp.*
import com.parsec.trantor.common.response.PageResult
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.web.bind.annotation.PathVariable
import java.time.LocalDateTime


interface OrderService {
    fun getManageOrderId(@PathVariable id: Long, loginUserInfo: LoginUserInfo): GetManageOrderIdResp

    fun getManageOrders(req: GetManageOrdersReq, loginUserInfo: LoginUserInfo): PageResult<GetManageOrdersResp>

    fun getManageCountryIncomeRanking(
        req: GetManageCountryIncomeRankingReq, loginUserInfo: LoginUserInfo
    ): PageResult<GetManageCountryIncomeRankingResp>

    /**
     * 根据用户分组，查询用户最新一条订单成功信息
     */
    fun feignUserSuccessOrderList(queryVo: OrderEndpointQueryVo): PageResult<FeignUserSubscriptionsListVo>

    fun getFeignUserSubscription(userId: Long): List<GetFeignSubscriptionResp>

    fun getManageExport(): XSSFWorkbook

    fun getOrderInfoByOrderNo(orderNo: String?): Order?
    fun paySuccess(orderNo: String, callbackTime: LocalDateTime): Order
    fun payFailed(orderNo: String?, callbackTime: LocalDateTime)
    fun getFeignIncomeData(date: String, country: String): GetIncomeDataResp

    fun getFeignSubscribersData(date: String, country: String): GetSubDataResp

}