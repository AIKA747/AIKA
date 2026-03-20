package com.parsec.aika.order.service.impl

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.lang.Assert
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.common.mapper.OrderMapper
import com.parsec.aika.common.mapper.PaymentMapper
import com.parsec.aika.common.mapper.ServicePackageMapper
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.entity.Order
import com.parsec.aika.common.model.entity.Payment
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.ExcelExportUtil
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.order.model.vo.req.GetManageCountryIncomeRankingReq
import com.parsec.aika.order.model.vo.req.GetManageOrdersReq
import com.parsec.aika.order.model.vo.req.OrderEndpointQueryVo
import com.parsec.aika.order.model.vo.resp.*
import com.parsec.aika.order.service.OrderService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.beans.BeanUtils
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource


@Service
class OrderServiceImpl : OrderService {

    @Resource
    private lateinit var orderMapper: OrderMapper

    @Resource
    private lateinit var paymentMapper: PaymentMapper

    @Resource
    private lateinit var servicePackageMapper: ServicePackageMapper

    /**
     * 订单详情
     */
    override fun getManageOrderId(id: Long, loginUserInfo: LoginUserInfo): GetManageOrderIdResp {
        val order = orderMapper.selectById(id)
        Assert.notNull(order, "订单不存在")
        val resp = GetManageOrderIdResp()
        BeanUtils.copyProperties(order, resp)
        resp.paymentInfo = paymentMapper.selectList(
            KtQueryWrapper(Payment::class.java).eq(Payment::orderNo, order.orderNo)
        ).map {
            val vo = GetManageOrderIdPaymentInfoResp()
            BeanUtils.copyProperties(it, vo)
            vo
        }
        return resp
    }

    /**
     * 订单列表
     */
    override fun getManageOrders(
        req: GetManageOrdersReq,
        loginUserInfo: LoginUserInfo,
    ): PageResult<GetManageOrdersResp> {
        PageHelper.startPage<GetManageOrdersResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetManageOrdersResp>().page(orderMapper.getManageOrders(req))
    }

    override fun getManageCountryIncomeRanking(
        req: GetManageCountryIncomeRankingReq,
        loginUserInfo: LoginUserInfo,
    ): PageResult<GetManageCountryIncomeRankingResp> {
        PageHelper.startPage<GetManageCountryIncomeRankingResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetManageCountryIncomeRankingResp>().page(orderMapper.getManageCountryIncomeRanking(req))
    }

    override fun feignUserSuccessOrderList(
        queryVo: OrderEndpointQueryVo,
    ): PageResult<FeignUserSubscriptionsListVo> {
        // 查询订单表(成功的订单信息)，按照userId分组，查询出来的就是用户的订阅信息
        // subStatus: 订阅状态：Valid，Expired  ——  根据订单表中的订阅过期时间判断
        val pageNum = if (queryVo.pageNo == null || queryVo.pageNo!! < 1) 1 else queryVo.pageNo
        val pageSizeNum = if (queryVo.pageSize == null || queryVo.pageSize!! < 1) 10 else queryVo.pageSize
        PageHelper.startPage<FeignUserSubscriptionsListVo>(pageNum!!, pageSizeNum!!)
        return PageUtil<FeignUserSubscriptionsListVo>().page(
            orderMapper.feignUserOrderList(
                queryVo, OrderStatusEnum.Success
            )
        )
    }

    /**
     * 查询用户订阅信息
     */
    override fun getFeignUserSubscription(userId: Long): List<GetFeignSubscriptionResp> {
        val resp = ArrayList<GetFeignSubscriptionResp>()
        // 到期时间、订阅时间
        var expiredDate: LocalDateTime? = null
        var subscriptTime: LocalDateTime? = null

        // 查询当前用户下状态为成功的订单
        val orderList = orderMapper.selectList(
            KtQueryWrapper(Order::class.java).eq(Order::userId, userId).eq(Order::status, OrderStatusEnum.Success)
        )
        if (orderList.isEmpty()) return resp
        // 所用到的服务包 id to pack
        val packageMap =
            servicePackageMapper.selectBatchIds(orderList.map { it.packageId }.toSet()).associateBy { it.id }

        // 按照支付回调时间升序排序
        for (order in orderList.sortedBy { it.callbackAt }) {
            val pack = packageMap[order.packageId] ?: continue
            val subPeriod = pack.subPeriod!!.toLong()
            // 填充基础数据
            val vo = GetFeignSubscriptionResp().apply {
                this.packageId = pack.id
                this.packageName = pack.packageName
                this.cover = pack.cover
                this.description = pack.description
            }

            // 到期时间为空 写入订阅和到期时间
            if (expiredDate == null) {
                expiredDate = order.callbackAt!!.plusDays(subPeriod)
                subscriptTime = order.callbackAt
                // (到期时间+服务包订阅时长) < 订单支付回调时间 代表没有续费，开启下一段记录
            } else if (expiredDate.plusDays(subPeriod).isBefore(order.callbackAt)) {
                // 订单中断需要记录上一次订阅的记录
                resp.add(vo.apply {
                    this.expiredDate = expiredDate
                    this.subscriptTime = subscriptTime
                })
                expiredDate = order.callbackAt!!.plusDays(subPeriod)
                subscriptTime = order.callbackAt
            } else {
                expiredDate = expiredDate.plusDays(subPeriod)
            }
            // 循环结束 记录最后一次的订阅记录
            resp.add(vo.apply {
                this.expiredDate = expiredDate
                this.subscriptTime = subscriptTime
            })
        }
        return resp
    }

    override fun getManageExport(): XSSFWorkbook {
        val data = orderMapper.getManageExport()
        // 创建XSSFWorkbook对象
        val wb = XSSFWorkbook()
        // 建立sheet对象
        val sheet = wb.createSheet("orders")
        // 生成一个列名 to 字段名的map
        val columnToFieldMap = mapOf(
            "订单号" to "orderNo",
            "消费者姓名" to "username",
            "邮箱" to "email",
            "电话" to "phone",
            "金额（分）" to "amount",
            "订单状态" to "statusStr",
            "创建时间" to "createdAt",
            "支付方式" to "payMethodStr",
            "支付单号" to "payNo",
            "支付时间" to "payTime",
        )
        ExcelExportUtil.export(sheet, data, columnToFieldMap)
        return wb
    }

    override fun getOrderInfoByOrderNo(orderNo: String?): Order? {
        return orderMapper.selectOne(KtQueryWrapper(Order::class.java).eq(Order::orderNo, orderNo))
    }

    override fun paySuccess(orderNo: String, callbackTime: LocalDateTime): Order {
        val order = (orderMapper.selectOne(KtQueryWrapper(Order::class.java).eq(Order::orderNo, orderNo))
            ?: throw BusinessException("订单号[${orderNo}]未查询到订单信息"))
        if (order.status == OrderStatusEnum.Success) {
            return order
        }
        order.callbackAt = callbackTime
        order.status = OrderStatusEnum.Success
        //通过公用方法查询用户的过期时间
        val userSubscription = this.getFeignUserSubscription(order.userId!!)
        order.expiredAt = this.calcSubscriptExpiredAt(userSubscription, order)
        orderMapper.updateById(order)
        return order
    }

    override fun payFailed(orderNo: String?, callbackTime: LocalDateTime) {
        val order = (orderMapper.selectOne(KtQueryWrapper(Order::class.java).eq(Order::orderNo, orderNo))
            ?: throw BusinessException("订单号[${orderNo}]未查询到订单信息"))
        order.callbackAt = callbackTime
        order.status = OrderStatusEnum.Cancelled
        order.cancelAt = callbackTime
        orderMapper.updateById(order)
    }

    override fun getFeignIncomeData(date: String, country: String): GetIncomeDataResp {
        return GetIncomeDataResp().apply {
            this.income = orderMapper.getFeignIncomeData(date, country, 0)
            this.totalIncome = orderMapper.getFeignIncomeData(date, country, 1)
        }
    }

    override fun getFeignSubscribersData(date: String, country: String): GetSubDataResp {
        return GetSubDataResp().apply {
            this.newSubscribers = orderMapper.getFeignSubDataNew(date, country, 0)
            this.totalSubscribers = orderMapper.getFeignSubDataNew(date, country, 1)
            this.expiredSubscribers = orderMapper.getFeignSubDataExpired(date, country, 0)
            this.totalExpiredSubscribers = orderMapper.getFeignSubDataExpired(date, country, 1)
            this.upcomingExpiringSubscribers = orderMapper.getFeignSubDataUpcomingExpiring(date, country)
        }
    }

    private fun calcSubscriptExpiredAt(userSubscription: List<GetFeignSubscriptionResp>, order: Order): LocalDateTime? {
        val servicePackage = servicePackageMapper.selectById(order.packageId)
            ?: throw BusinessException("服务包id[${order.packageId}]未查询到服务包信息")
        var subTime = order.callbackAt!!
        if (CollUtil.isNotEmpty(userSubscription)) {
            val expiredAt = userSubscription.last().expiredDate!!
            if (expiredAt.isAfter(order.callbackAt!!)) {
                subTime = expiredAt
            }
        }
        return subTime.plusDays(servicePackage.subPeriod!!.toLong())
    }

}