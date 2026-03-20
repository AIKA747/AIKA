package com.parsec.aika.order.service

import cn.hutool.core.thread.ThreadUtil
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.order.OrderServiceApplicationTests
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.nio.charset.Charset

class OrderNoGeneratorServiceTest : OrderServiceApplicationTests() {

    @Autowired
    private lateinit var orderNoGeneratorService: OrderNoGeneratorService

    @Autowired
    private lateinit var freedompayService: FreedompayService


    @Test
    fun generateOrderNumber() {
        val executor = ThreadUtil.createScheduledExecutor(5)
        for (i in 0..101) {
            executor.execute {
                StaticLog.info("orderNo:{}", orderNoGeneratorService.generateOrderNumber())
            }
        }
        executor.shutdown()
    }

    @Test
    fun orderPay() {
        //成功回调
        val parmas =
            "pg_order_id=ORD202403161615160001&pg_payment_id=1177638447&pg_amount=0.5&pg_currency=USD&pg_net_amount=217.79&pg_ps_amount=224.29&pg_ps_full_amount=224.29&pg_ps_currency=KZT&pg_description=3+day+due&pg_result=1&pg_payment_date=2024-03-16+13%3A50%3A42&pg_can_reject=1&pg_user_phone=77017777777&pg_need_phone_notification=0&pg_user_contact_email=123%40qq.com&pg_need_email_notification=1&pg_testing_mode=1&pg_payment_method=bankcard&pg_reference=240316085042&pg_captured=1&pg_card_pan=4111-11XX-XXXX-1111&pg_card_exp=12%2F24&pg_card_owner=Daniyar+limton&pg_card_brand=VI&pg_auth_code=955417&pg_salt=EwdtI8MEP9U2DiZ5&pg_sig=b8512a6f01539c9478f4a7d638fdf414"
        //pg_order_id=ORD202403161744390002&pg_payment_id=1177701891&pg_amount=0.5&pg_currency=USD&pg_net_amount=217.79&pg_ps_amount=224.29&pg_ps_full_amount=224.29&pg_ps_currency=KZT&pg_description=3+day+due&pg_result=0&pg_can_reject=0&pg_user_phone=8613256324231&pg_need_phone_notification=0&pg_user_contact_email=123456%40qq.com&pg_need_email_notification=1&pg_testing_mode=1&pg_payment_method=bankcard&pg_reference=240316095442&pg_captured=0&pg_failure_description=%D0%9E%D1%88%D0%B8%D0%B1%D0%BA%D0%B0+%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D1%8B.+%D0%9F%D0%BE%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D1%82%D0%B5+%D0%BF%D0%BE%D0%BF%D1%8B%D1%82%D0%BA%D1%83+%D0%BF%D0%BE%D0%B7%D0%B6%D0%B5.&pg_failure_code=10000&pg_salt=h8JIdD1ppy1kE08L&pg_sig=0af99389d3ca062be86a97a8b9287825

        val params = HttpUtil.decodeParamMap(parmas, Charset.defaultCharset())
        StaticLog.info("params:{}", JSONUtil.toJsonStr(params))
        val pg_sig = params.get("pg_sig")
//        params.remove(pg_sig)
        val generateSignature = freedompayService.generateSignature(
            "https://753ab629.r22.cpolar.top/order/public/freedompay/result", params
        )
        StaticLog.info("pg_sig:{}", pg_sig)
        StaticLog.info("generateSignature:{}", generateSignature)
        StaticLog.info("result:{}", pg_sig == generateSignature)
    }


}