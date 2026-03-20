package com.parsec.aika.order.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.log.StaticLog
import com.parsec.aika.common.mapper.AppleNotifyMapper
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.em.PayStatusEnum
import com.parsec.aika.common.model.em.PayTypeEnum
import com.parsec.aika.common.model.entity.AppleNotify
import com.parsec.aika.common.model.entity.Payment
import com.parsec.aika.common.util.ApplePayUtil
import com.parsec.aika.order.model.vo.resp.GetAppPaymentResultResp
import com.parsec.aika.order.model.vo.resp.PaymentResp
import com.parsec.aika.order.service.ApplePayService
import com.parsec.aika.order.service.OrderNoGeneratorService
import com.parsec.aika.order.service.OrderService
import com.parsec.aika.order.service.PaymentService
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ApplePayServiceImpl : ApplePayService {

    @Autowired
    private lateinit var orderService: OrderService

    @Autowired
    private lateinit var paymentService: PaymentService

    @Autowired
    private lateinit var appleNotifyMapper: AppleNotifyMapper

    @Autowired
    private lateinit var orderNoGeneratorService: OrderNoGeneratorService

    @Value("\${apple.pay.password:982812477a44411187c604f05f27dca4}")
    private lateinit var password: String

//    private val PRODUCT_PREFIX = "PRODUCT"

    override fun createApplePay(orderNo: String?): PaymentResp? {
        //查询订单信息
        val order = orderService.getOrderInfoByOrderNo(orderNo)
            ?: throw BusinessException("Payment initiation failed, order information cannot be queried")
        Assert.state(order.status != OrderStatusEnum.Cancelled, "Order cancelled")
        Assert.state(order.status != OrderStatusEnum.Success, "Order paid")

        //生成订单支付信息
        val paymentInfo = paymentService.savePaymentInfo(Payment().apply {
            this.orderNo = orderNo
            this.amount = order.amount
            this.payNo = orderNoGeneratorService.generateOrderNumber("AIP")
            this.status = PayStatusEnum.default
            this.creator = order.userId
            this.creatorName = order.username
            this.type = PayTypeEnum.Payment
            this.payMethod = PayMethodEnum.ApplePay
        })
//        return PaymentResp(paymentInfo.payNo, "$PRODUCT_PREFIX${order.packageId}")
        return PaymentResp(paymentInfo.payNo, order.packageId.toString())
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun check(test: Boolean?, receipt: String, payNo: String, transactionId: String): GetAppPaymentResultResp {
        StaticLog.info(
            "[test={}]支付单号：{}, transactionId:{}, 验证支付凭证：{}", test, payNo, transactionId, receipt
        )
        //判断交易单号或支付凭证是否已兑换
        paymentService.checkInAppPayReceipt(transactionId, receipt)
        //校验苹果内购凭证
        val iapReceipt = ApplePayUtil.buyAppVerify(receipt, password, test ?: false, transactionId)
            ?: throw BusinessException("Payment voucher verification failed")
        //查询支付信息
        var payment = paymentService.getPaymentInfo(payNo)
        if (payment.status == PayStatusEnum.success) {
            return paymentService.getAppPaymentResult(payment.orderNo!!)
        }
        //查询订单信息
        val order = orderService.getOrderInfoByOrderNo(payment.orderNo)
            ?: throw BusinessException("Payment initiation failed, order information cannot be queried")
//        Assert.state(
//            "$PRODUCT_PREFIX${order.packageId}" == iapReceipt.productId,
//            "Voucher verification failed, product ID verification failed"
//        )
        Assert.state(
            iapReceipt.productId == order.packageId.toString(),
            "Voucher verification failed, product ID verification failed"
        )
        //获取订单号
        payment = paymentService.paySuccess(payNo, iapReceipt.purchaseDatePst, transactionId, receipt)
        return paymentService.getAppPaymentResult(payment.orderNo!!)
    }

    override fun saveServerNotify(body: String) {
        appleNotifyMapper.insert(AppleNotify().apply {
            this.body = body
        })
    }

    override fun checkV2(
        test: Boolean?, receipt: String, payNo: String, transactionId: String
    ): GetAppPaymentResultResp? {
        StaticLog.info("V2[test={}]支付单号：{}, transactionId:{}, 验证支付凭证：{}", test, payNo, transactionId, receipt)
        //判断交易单号或支付凭证是否已兑换
        paymentService.checkInAppPayReceipt(transactionId, receipt)
        //校验苹果内购凭证
        val iapReceipt = ApplePayUtil.buyAppVerifyV2(test ?: false, transactionId)
        //查询支付信息
        var payment = paymentService.getPaymentInfo(payNo)
        if (payment.status == PayStatusEnum.success) {
            return paymentService.getAppPaymentResult(payment.orderNo!!)
        }
        //查询订单信息
        val order = orderService.getOrderInfoByOrderNo(payment.orderNo)
            ?: throw BusinessException("Payment initiation failed, order information cannot be queried")
//        Assert.state(
//            "$PRODUCT_PREFIX${order.packageId}" == iapReceipt.productId,
//            "Voucher verification failed, product ID verification failed"
//        )
        Assert.state(
            iapReceipt.productId == order.packageId.toString(),
            "Voucher verification failed, product ID verification failed"
        )
        //获取订单号
        payment = paymentService.paySuccess(payNo, iapReceipt.purchaseDatePst, transactionId, receipt)
        return paymentService.getAppPaymentResult(payment.orderNo!!)
    }

}