package com.parsec.aika.order.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.common.mapper.OrderMapper
import com.parsec.aika.common.mapper.ServicePackageMapper
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.entity.Order
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.service.OrderNoGeneratorService
import com.parsec.aika.order.service.PaymentService
import com.parsec.aika.order.service.PlaceOrderService
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class PlaceOrderServiceImpl : PlaceOrderService {

    @Autowired
    private lateinit var servicePackageMapper: ServicePackageMapper

    @Autowired
    private lateinit var orderMapper: OrderMapper

    @Autowired
    private lateinit var orderNoGeneratorService: OrderNoGeneratorService

    @Autowired
    private lateinit var paymentService: PaymentService

    override fun placeOrder(user: LoginUserInfo, packageId: Long?): Order? {
        //查询服务包详情
        val servicePackage = servicePackageMapper.selectById(packageId)
            ?: throw BusinessException("Service package information does not exist")
        //检查服务包是否限购
        if (servicePackage.purchaseLimit!! > 0) {
            //查询用户购买次数
            val userPurchaseNum = orderMapper.selectCount(
                KtQueryWrapper(Order::class.java).eq(Order::userId, user.userId).eq(Order::packageId, packageId)
                    .eq(Order::status, OrderStatusEnum.Success)
            )
            if (userPurchaseNum >= servicePackage.purchaseLimit!!) {
                throw BusinessException("The number of purchases has reached the limit")
            }
        }
        //组装order信息
        val order = Order().apply {
            this.userId = user.userId
            this.username = user.username
            this.phone = user.phone
            this.email = user.email
            this.country = user.country
            this.packageId = packageId
            this.packageName = servicePackage.packageName
            this.amount = servicePackage.price
            this.orderNo = orderNoGeneratorService.generateOrderNumber()
            this.creator = user.userId
            this.creatorName = user.username
            this.status = OrderStatusEnum.Unpaid
        }
        orderMapper.insert(order)
        if (order.amount == 0L) {
            return paymentService.zeroPay(order)
        }
        return order
    }

}