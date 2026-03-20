package com.parsec.aika.order.service

import cn.hutool.json.JSONObject
import com.parsec.aika.common.model.vo.LoginUserInfo

interface FreedompayService {

    fun initPayment(orderNo: String, successUrl: String?, failureUrl: String?, user: LoginUserInfo): JSONObject

    fun webhook(result: String)

    fun generateSignature(path: String?, request: Map<String, Any>): String
}