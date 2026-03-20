package com.parsec.aika.content.controller.api

import cn.hutool.core.collection.CollUtil
import cn.hutool.crypto.digest.DigestUtil
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.util.SignatureUtil
import com.parsec.aika.content.ContentServiceApplicationTests
import com.parsec.aika.common.model.vo.req.ApiEstimatedWeightReq
import com.parsec.aika.common.model.vo.req.ApiTranslateReq
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import java.util.*

class ApiControllerTest : ContentServiceApplicationTests() {

    @Autowired
    private lateinit var apiController: ApiController

    @Value("\${api.key:4c72e95e97c0419f80a8bd70824dc34f}")
    private lateinit var apiKey: String

//    @Test
    fun translate() {
        //构造参数
        val translateReq = ApiTranslateReq().apply {
            text = "您好，很高兴认识您"
            timestamp = System.currentTimeMillis()
        }
        StaticLog.info("req:{}", JSONUtil.toJsonStr(translateReq))
        //参数签名
        val signature = SignatureUtil.signature(
            listOf(
                translateReq.timestamp.toString(), translateReq.text, translateReq.language, apiKey
            )
        )
        StaticLog.info("signature:{}", signature)
        val baseResult = apiController.translate(signature, translateReq)
        StaticLog.info(JSONUtil.toJsonStr(baseResult))
    }

    //    @Test
    fun estimatedWeight() {
        //构造参数
        val req = com.parsec.aika.common.model.vo.req.ApiEstimatedWeightReq().apply {
            productDescription = "一箩筐的诺基亚手机"
            timestamp = System.currentTimeMillis()
        }
        //参数签名
        val signature = SignatureUtil.signature(
            listOf(
                req.timestamp.toString(), req.productDescription, apiKey
            )
        )
        StaticLog.info("signature:{}", signature)
        val baseResult = apiController.estimatedWeight(signature, req)
        StaticLog.info(JSONUtil.toJsonStr(baseResult))
    }

    @Test
    fun translate2() {
        val url = "https://api-test.aikavision.com/content/public/api/translate"
        val apiKey = "4c72e95e97c0419f80a8bd70824dc34f"
        //构造参数
        val translateReq = ApiTranslateReq().apply {
            text = "Continue"
            timestamp = System.currentTimeMillis()
            language = "ru"
        }
        //将请求参数和apikey放入一个list
        val list = listOfNotNull(translateReq.timestamp.toString(), translateReq.text, translateReq.language, apiKey)
        StaticLog.info("list1:{}", JSONUtil.toJsonStr(list))
        //自然顺序排序
        Collections.sort(list)
        StaticLog.info("list2:{}", JSONUtil.toJsonStr(list))
        //拼接字符串
        val listStr = CollUtil.join(list, ",")
        StaticLog.info("listStr:{}", listStr)
        //签名，计算32位MD5摘要值，并转为16进制字符串
        val signature = DigestUtil.md5Hex(listStr)
        StaticLog.info("signature:{}", signature)
        //发起请求
        val resp = HttpUtil.createPost(url).header("signature", signature).contentType("application/json")
            .body(JSONUtil.toJsonStr(translateReq)).execute().body()
        StaticLog.info("请求响应：{}", resp)
    }

}
