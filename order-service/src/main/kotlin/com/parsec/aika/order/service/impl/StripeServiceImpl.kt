package com.parsec.aika.order.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.em.PayStatusEnum
import com.parsec.aika.common.model.em.PayTypeEnum
import com.parsec.aika.common.model.entity.Payment
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.resp.CreatePaymentIntentResp
import com.parsec.aika.order.service.OrderService
import com.parsec.aika.order.service.PaymentService
import com.parsec.aika.order.service.StripeService
import com.parsec.trantor.exception.core.BusinessException
import com.stripe.Stripe
import com.stripe.model.Customer
import com.stripe.model.EphemeralKey
import com.stripe.model.PaymentIntent
import com.stripe.model.StripeObject
import com.stripe.net.Webhook
import com.stripe.param.CustomerCreateParams
import com.stripe.param.EphemeralKeyCreateParams
import com.stripe.param.PaymentIntentCreateParams
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.LocalDateTime


@Service
class StripeServiceImpl : StripeService {

    @Autowired
    private lateinit var orderService: OrderService

    @Autowired
    private lateinit var paymentService: PaymentService

    @Value("\${stripe.publicKey}")
    private val stripePublicKey: String? = null

    @Value("\${stripe.secretKey}")
    private val stripeSecretKey: String? = null

    @Value("\${stripe.endpointSecret}")
    private val endpointSecret: String? = null

    private val stripeVersion = "2023-10-16"

    override fun createPaymentIntent(user: LoginUserInfo, orderNo: String?): CreatePaymentIntentResp? {
        //查询订单信息
        val order = orderService.getOrderInfoByOrderNo(orderNo)
            ?: throw BusinessException("Payment initiation failed, order information cannot be queried")
        Assert.state(order.status != OrderStatusEnum.Cancelled, "Order cancelled")
        Assert.state(order.status != OrderStatusEnum.Success, "Order paid")
        //Create a Customer (skip this and get the existing Customer ID if this is a returning customer)
        Stripe.apiKey = stripeSecretKey
        val customer =
            Customer.create(CustomerCreateParams.builder().setName(user.username).setEmail(user.email).build())
        Assert.notNull(customer, "Failed to create customer")
        //Create an Ephemeral Key for the Customer
        val ephemeralKey = EphemeralKey.create(
            EphemeralKeyCreateParams.builder().setCustomer(customer.id).setStripeVersion(stripeVersion).build()
        )
        Assert.notNull(ephemeralKey, "Failed to create ephemeralKey")
        //Create a PaymentIntent
        val paymentIntent = PaymentIntent.create(
            PaymentIntentCreateParams.builder().setAmount(order.amount).setCurrency("usd")
                .putMetadata("orderNo", orderNo).setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                ).build()
        )
        Assert.notNull(paymentIntent, "Failed to create paymentIntent")
        //生成订单支付信息
        paymentService.savePaymentInfo(Payment().apply {
            this.orderNo = orderNo
            this.amount = order.amount
            this.payNo = paymentIntent.id
            this.status = PayStatusEnum.default
            this.creator = user.userId
            this.creatorName = user.username
            this.type = PayTypeEnum.Payment
            this.payMethod = PayMethodEnum.Stripe
        })
        //返回参数给app，由app跳转stripe页面进行支付
        return CreatePaymentIntentResp(paymentIntent.clientSecret, customer.id, ephemeralKey.secret, stripePublicKey!!)
    }

    override fun retrievePaymentIntent(id: String): PaymentIntent? {
        Stripe.apiKey = stripeSecretKey
        return PaymentIntent.retrieve(id)
    }

    override fun stripeWebhook(stripeSignature: String, payload: String) {
        Stripe.apiKey = stripeSecretKey

        val event = Webhook.constructEvent(payload, stripeSignature, endpointSecret);
//         ApiResource.GSON.fromJson(payload, Event::class.java)

        val dataObjectDeserializer = event.dataObjectDeserializer
        var stripeObject: StripeObject? = null
        if (dataObjectDeserializer.getObject().isPresent) {
            stripeObject = dataObjectDeserializer.getObject().get()
        } else {
            // Deserialization failed, probably due to an API version mismatch.
            // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
            // instructions on how to handle this case, or return an error here.
        }

        // Handle the event
        when (event.type) {
            "payment_intent.succeeded" -> {
                val paymentIntent = stripeObject as PaymentIntent
                StaticLog.info("开始处理支付成功回调事件,paymentIntent:{}", JSONUtil.toJsonStr(paymentIntent))
                paymentService.paySuccess(paymentIntent.id, LocalDateTime.now())
            }

            "payment_intent.payment_failed" -> {
                val paymentIntent = stripeObject as PaymentIntent
                StaticLog.info("开始处理支付失败回调事件,paymentIntent:{}", JSONUtil.toJsonStr(paymentIntent))
                paymentService.payFailed(paymentIntent.id, paymentIntent.description)
            }

            else -> StaticLog.warn("Unhandled event type: " + event.type)
        }

    }

}