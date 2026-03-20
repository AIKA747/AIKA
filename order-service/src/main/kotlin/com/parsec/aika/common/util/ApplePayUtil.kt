package com.parsec.aika.common.util

import cn.hutool.core.date.LocalDateTimeUtil
import cn.hutool.core.io.IoUtil
import cn.hutool.core.lang.Assert
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.jwt.JWTUtil
import cn.hutool.log.StaticLog
import com.apple.itunes.storekit.client.APIException
import com.apple.itunes.storekit.client.AppStoreServerAPIClient
import com.apple.itunes.storekit.model.Environment
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.core.io.DefaultResourceLoader
import java.time.LocalDateTime
import java.util.*
import javax.net.ssl.*


object ApplePayUtil {
    private const val urlSandbox = "https://sandbox.itunes.apple.com/verifyReceipt"
    private const val urlVerify = "https://buy.itunes.apple.com/verifyReceipt"

    /**
     * 苹果服务器验证
     *
     * @param receipt 账单
     * @return null 或返回结果 沙盒 https://sandbox.itunes.apple.com/verifyReceipt
     * @url 要验证的地址
     */
    @Throws(Exception::class)
    fun buyAppVerify(
        receipt: String, password: String, test: Boolean, transactionId: String
    ): IapReceipt? {
        //环境判断 线上/开发环境用不同的请求链接
        val url = if (test) {
            urlSandbox //沙盒测试
        } else {
            urlVerify //线上
        }
        val body = """{"receipt-data":"$receipt","password":"$password"}"""
        StaticLog.info("url:{}", url)
        StaticLog.info("reqBody:{}", body)
        var result = HttpUtil.post(url, body)
        var res = JSONObject(result)
        /**
         * 苹果支付检验返回状态码 描述
         * 21000 App Store无法读取你提供的JSON数据
         * 21002 收据数据不符合格式
         * 21003 收据无法被验证
         * 21004 你提供的共享密钥和账户的共享密钥不一致
         * 21005 收据服务器当前不可用
         * 21006 收据是有效的，但订阅服务已经过期。当收到这个信息时，解码后的收据信息也包含在返回内容中
         * 21007 收据信息是测试用（sandbox），但却被发送到产品环境中验证
         * 21008 收据信息是产品环境中使用，但却被发送到测试环境中验证
         */
        if (res.getInt("status") == 21007) {
            result = HttpUtil.post(urlSandbox, body)
            StaticLog.info("校验苹果内购凭证返回[21007],重新发起沙箱验证返回：$result")
            res = JSONObject(result)
        }
        if (res.getInt("status") == 21008) {
            result = HttpUtil.post(urlVerify, body)
            StaticLog.info("校验苹果内购凭证返回[21008],重新发起生产验证返回：$result")
            res = JSONObject(result)
        }
        StaticLog.info("校验苹果内购凭证最终返回：$result")
        Assert.state(res.getInt("status") == 0, "Voucher verification failed with status code：${res.getInt("status")}")
        val jsonObject = res.getJSONObject("receipt")
        val jsonObject1 =
            jsonObject.getJSONArray("in_app").jsonIter().firstOrNull { it.getStr("transaction_id") == transactionId }
        return if (jsonObject1 != null) {
            IapReceipt(
                jsonObject1.getStr("product_id"), jsonObject1.getLocalDateTime("purchase_date_pst", LocalDateTime.now())
            )
        } else {
            null
        }
    }

    val issuerId = "c24d8cf3-ac91-4197-9de1-666dbcee1b8a"
    val keyId = "SRUR23362H"
    val bundleId = "com.umaylab.aisa"
    val pathResource = DefaultResourceLoader().getResource("classpath:apple/SubscriptionKey_SRUR23362H.p8")
    val encodedKey = IoUtil.read(pathResource.inputStream, "UTF-8")

    fun buyAppVerifyV2(test: Boolean, transactionId: String): IapReceipt {
        val environment = if (test) Environment.SANDBOX else Environment.PRODUCTION
        val client = AppStoreServerAPIClient(encodedKey, keyId, issuerId, bundleId, environment)
        try {
            val transactionInfoResponse = client.getTransactionInfo(transactionId)
            StaticLog.info("transactionInfoResponse: $transactionInfoResponse")
            val transactionInfo = transactionInfoResponse.signedTransactionInfo
            val parseToken = JWTUtil.parseToken(transactionInfo)
            val payloads = parseToken.payloads
            StaticLog.info("payload: {}", JSONUtil.toJsonStr(payloads))
            return IapReceipt(
                payloads.getStr("productId"),
                LocalDateTimeUtil.of(payloads.getLong("purchaseDate", System.currentTimeMillis()))
            )
        } catch (e: APIException) {
            throw BusinessException(e.apiErrorMessage)
        } catch (e: Exception) {
            throw BusinessException(e.message ?: "The verification of the in-app purchase transaction failed")
        }
    }

}

data class IapReceipt(
    val productId: String, val purchaseDatePst: LocalDateTime
)