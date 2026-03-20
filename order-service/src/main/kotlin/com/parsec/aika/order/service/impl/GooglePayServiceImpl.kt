package com.parsec.aika.order.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.services.androidpublisher.AndroidPublisher
import com.google.api.services.androidpublisher.AndroidPublisherScopes
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.em.PayStatusEnum
import com.parsec.aika.common.model.em.PayTypeEnum
import com.parsec.aika.common.model.entity.Payment
import com.parsec.aika.order.model.vo.req.CheckGooglePayReq
import com.parsec.aika.order.model.vo.resp.GetAppPaymentResultResp
import com.parsec.aika.order.model.vo.resp.PaymentResp
import com.parsec.aika.order.service.GooglePayService
import com.parsec.aika.order.service.OrderNoGeneratorService
import com.parsec.aika.order.service.OrderService
import com.parsec.aika.order.service.PaymentService
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.DefaultResourceLoader
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

@Service
class GooglePayServiceImpl : GooglePayService {
    @Autowired
    private lateinit var orderService: OrderService

    @Autowired
    private lateinit var paymentService: PaymentService

    @Autowired
    private lateinit var orderNoGeneratorService: OrderNoGeneratorService

    @Value("\${google.application.packageName:com.umaylabs.aika.store}")
    private lateinit var packageName: String

//    private val PRODUCT_PREFIX = "product"

    //使用服务帐户Json文件获取Google凭据
    private val credential =
        GoogleCredential.fromStream(DefaultResourceLoader().getResource("classpath:google/aika-410203-86f0161d71be.json").inputStream)
            .createScoped(listOf(AndroidPublisherScopes.ANDROIDPUBLISHER))

    override fun createGooglePay(orderNo: String?): PaymentResp? {
        //查询订单信息
        val order = orderService.getOrderInfoByOrderNo(orderNo)
            ?: throw BusinessException("Payment initiation failed, order information cannot be queried")
        Assert.state(order.status != OrderStatusEnum.Cancelled, "Order cancelled")
        Assert.state(order.status != OrderStatusEnum.Success, "Order paid")

        //生成订单支付信息
        val paymentInfo = paymentService.savePaymentInfo(Payment().apply {
            this.orderNo = orderNo
            this.amount = order.amount
            this.payNo = orderNoGeneratorService.generateOrderNumber("GIP")
            this.status = PayStatusEnum.default
            this.creator = order.userId
            this.creatorName = order.username
            this.type = PayTypeEnum.Payment
            this.payMethod = PayMethodEnum.GooglePay
        })
//        return PaymentResp(paymentInfo.payNo, "$PRODUCT_PREFIX${order.packageId}")
        return PaymentResp(paymentInfo.payNo, order.packageId.toString())
    }

    /**
     * google内购订单校验
     */
    @Transactional(rollbackFor = [Exception::class])
    override fun check(req: CheckGooglePayReq): GetAppPaymentResultResp? {
        //查询支付信息
        var payment = paymentService.getPaymentInfo(req.payNo!!)
        if (payment.status == PayStatusEnum.success) {
            return paymentService.getAppPaymentResult(payment.orderNo!!)
        }
        //        使用谷歌凭据和收据从谷歌获取购买信息
        val httpTransport = GoogleNetHttpTransport.newTrustedTransport()
        val jsonFactory = JacksonFactory()
        val publisher =
            AndroidPublisher.Builder(httpTransport, jsonFactory, credential).setApplicationName("aika").build()
        val purchases = publisher.purchases()
        StaticLog.info("===============CheckGooglePayReq:{}", JSONUtil.toJsonStr(req))
//        val request = purchases.products().get(packageName, "${PRODUCT_PREFIX}${req.productId}", req.purchaseToken)
        val request = purchases.products().get(packageName, req.productId, req.purchaseToken)
        StaticLog.info("===============$request================")
        val purchase = request.execute()
        StaticLog.info("google check resp:{}", JSONUtil.toJsonStr(purchase))
        //判断交易单号或支付凭证是否已兑换
        paymentService.checkInAppPayReceipt(purchase.orderId, req.purchaseToken!!)
        //校验购买信息
        //The purchase state of the order. Possible values are: 0. Purchased 1. Canceled 2. Pending
        Assert.state(purchase.purchaseState == 0, "The purchase state of the order is not Purchased")
        //The consumption state of the inapp product. Possible values are: 0. Yet to be consumed 1. Consumed
        Assert.state(
            purchase.consumptionState == 0, "The consumption state of the inapp product is not Yet to be consumed"
        )
        //查询订单信息
        val order = orderService.getOrderInfoByOrderNo(payment.orderNo)
            ?: throw BusinessException("Payment initiation failed, order information cannot be queried")
        Assert.state(
            order.packageId.toString() == req.productId, "Voucher verification failed, product ID verification failed"
        )
        //获取订单号
        payment = paymentService.paySuccess(
            req.payNo!!,
            LocalDateTime.ofInstant(Instant.ofEpochMilli(purchase.purchaseTimeMillis), ZoneId.systemDefault()),
            purchase.orderId,
            req.purchaseToken
        )
        return paymentService.getAppPaymentResult(payment.orderNo!!)
    }


}