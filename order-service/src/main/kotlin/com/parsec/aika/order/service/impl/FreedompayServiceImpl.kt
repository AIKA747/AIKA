package com.parsec.aika.order.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.RandomUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.core.util.XmlUtil
import cn.hutool.crypto.digest.DigestUtil
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.em.PayStatusEnum
import com.parsec.aika.common.model.em.PayTypeEnum
import com.parsec.aika.common.model.entity.Payment
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.props.FreedompayProps
import com.parsec.aika.order.service.FreedompayService
import com.parsec.aika.order.service.OrderService
import com.parsec.aika.order.service.PaymentService
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.nio.charset.Charset
import java.time.LocalDateTime

@Service
class FreedompayServiceImpl : FreedompayService {

    @Autowired
    private lateinit var orderService: OrderService

    @Autowired
    private lateinit var paymentService: PaymentService

    @Autowired
    private lateinit var props: FreedompayProps

    override fun initPayment(
        orderNo: String, successUrl: String?, failureUrl: String?, user: LoginUserInfo
    ): JSONObject {
        //查询订单信息
        val order = orderService.getOrderInfoByOrderNo(orderNo)
            ?: throw BusinessException("Payment initiation failed, order information cannot be queried")
        Assert.state(order.status != OrderStatusEnum.Cancelled, "Order cancelled")
        Assert.state(order.status != OrderStatusEnum.Success, "Order paid")

        val url = "${props.domain}/${props.initPayment}"
        val request = mutableMapOf(
            "pg_order_id" to order.orderNo!!,
            "pg_merchant_id" to props.merchantId!!,
            "pg_amount" to order.amount!! / 100.0,
            "pg_currency" to "USD",
            "pg_description" to order.packageName!!,
            "pg_user_id" to order.userId!!,
            "pg_salt" to createSalt(),
            "pg_result_url" to props.resultUrl!!,
            "pg_success_url" to if (StrUtil.isBlank(successUrl)) props.successUrl!! else successUrl!!,
            "pg_failure_url" to if (StrUtil.isBlank(failureUrl)) props.failureUrl!! else failureUrl!!
        )
        request["pg_sig"] = this.generateSignature(props.initPayment, request)
        val body = HttpUtil.createPost(url).form(request as Map<String, Any>?).execute().body()
        StaticLog.info("resp:{}", body)
        val map = JSONObject(XmlUtil.xmlToMap(body))
        StaticLog.info("map:{}", JSONUtil.toJsonStr(map))
        Assert.state("ok" == map.getStr("pg_status"), map.getStr("pg_description"))
        //生成订单支付信息
        paymentService.savePaymentInfo(Payment().apply {
            this.orderNo = orderNo
            this.amount = order.amount
            this.payNo = map.getStr("pg_payment_id")
            this.status = PayStatusEnum.default
            this.creator = user.userId
            this.creatorName = user.username
            this.type = PayTypeEnum.Payment
            this.payMethod = PayMethodEnum.Freedompay
        })
        StaticLog.info("map:{}", JSONUtil.toJsonStr(map))
        return map
    }

    override fun webhook(result: String) {
        val params = HttpUtil.decodeParamMap(result, Charset.defaultCharset())
        val resultObj = JSONObject(params)
        val paymentId = resultObj.getStr("pg_payment_id")
        StaticLog.info("paymentId:{}", paymentId)
        //付款结果。2 – 不完整。1 – 成功，0 – 失败。
        val result = resultObj.getInt("pg_result")
        StaticLog.info("pg_result:{}", result)
        if (result == 1) {
            paymentService.paySuccess(paymentId, resultObj.getLocalDateTime("pg_payment_date", LocalDateTime.now()))
        } else if (result == 0) {
            paymentService.payFailed(paymentId, resultObj.getStr("pg_failure_description"))
        }

    }

    override fun generateSignature(path: String?, request: Map<String, Any>): String {
        val requestForSignature = makeFlatParamsMap(request)
        val sortedRequest = requestForSignature.toSortedMap()
        val sortedMap = sortedMapOf<String, Any>()
        sortedMap[path] = path
        sortedMap.putAll(sortedRequest)
        sortedMap["secret_key"] = props.secretKey
        StaticLog.info("sortedMap:{}", JSONUtil.toJsonStr(sortedMap))
        return DigestUtil.md5Hex(sortedMap.values.joinToString(separator = ";")).toString()
    }

    fun makeFlatParamsMap(arrParams: Map<String, Any>, parentName: String = ""): Map<String, String> {
        val arrFlatParams = mutableMapOf<String, String>()
        var i = 0
        arrParams.forEach { (key, value) ->
            i++
            val name = parentName + key + "%03d".format(i)
            when (value) {
                is Map<*, *> -> {
                    arrFlatParams.putAll(makeFlatParamsMap(value as Map<String, Any>, name))
                }

                else -> arrFlatParams[name] = value.toString()
            }
        }
        return arrFlatParams
    }

    private fun createSalt(): String {
        return RandomUtil.randomString(10)
    }
}