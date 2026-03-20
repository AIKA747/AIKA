package com.parsec.aika.order.controller.manage

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.ExcelUtil
import com.parsec.aika.order.model.vo.req.GetManageCountryIncomeRankingReq
import com.parsec.aika.order.model.vo.req.GetManageOrdersReq
import com.parsec.aika.order.model.vo.resp.GetManageCountryIncomeRankingResp
import com.parsec.aika.order.model.vo.resp.GetManageOrderIdResp
import com.parsec.aika.order.model.vo.resp.GetManageOrdersResp
import com.parsec.aika.order.service.OrderService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource
import javax.servlet.http.HttpServletResponse

@RestController
class ManageOrderController {

    @Resource
    private lateinit var orderService: OrderService

    /**
     * 订单详情
     */
    @GetMapping("/manage/order/{id}")
    fun getManageOrderId(@PathVariable id: Long, loginUserInfo: LoginUserInfo): BaseResult<GetManageOrderIdResp> {
        return BaseResult.success(orderService.getManageOrderId(id, loginUserInfo))
    }

    /**
     * 订单列表
     */
    @GetMapping("/manage/orders")
    fun getManageOrders(req: GetManageOrdersReq, loginUserInfo: LoginUserInfo): BaseResult<PageResult<GetManageOrdersResp>> {
        return BaseResult.success(orderService.getManageOrders(req, loginUserInfo))
    }


    /**
     * 订单列表
     */
    @GetMapping("/manage/country/income-ranking")
    fun getManageCountryIncomeRanking(req: GetManageCountryIncomeRankingReq, loginUserInfo: LoginUserInfo): BaseResult<PageResult<GetManageCountryIncomeRankingResp>> {
        return BaseResult.success(orderService.getManageCountryIncomeRanking(req, loginUserInfo))
    }

    /**
     * 导出全部订单信息
     */
    @GetMapping("/manage/export")
    fun getManageExport(response: HttpServletResponse) {
        val workbook = orderService.getManageExport()
        ExcelUtil.exportExcel(response, workbook, "订单信息_${System.currentTimeMillis()}")
    }


}