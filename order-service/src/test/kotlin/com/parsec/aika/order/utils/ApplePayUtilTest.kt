package com.parsec.aika.order.utils

import cn.hutool.json.JSONConfig
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.util.ApplePayUtil
import com.parsec.aika.order.OrderServiceApplicationTests
import org.junit.jupiter.api.Test

class ApplePayUtilTest : OrderServiceApplicationTests() {


    //    @Test
//    fun buyAppVerify() {
//        ApplePayUtil.buyAppVerify()
//    }
//    @Test
    fun buyAppVerifyV2() {
        val iapReceipt = ApplePayUtil.buyAppVerifyV2(true, "2000000978452058")
        StaticLog.info(JSONUtil.toJsonStr(iapReceipt, JSONConfig().apply {
            setDateFormat("yyyy-MM-dd HH:mm:ss")
        }))
    }


}