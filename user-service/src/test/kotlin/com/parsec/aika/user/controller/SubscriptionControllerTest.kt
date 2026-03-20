package com.parsec.aika.user.controller

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.UserServiceApplicationTests
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class SubscriptionControllerTest : UserServiceApplicationTests() {

    @Autowired
    private val subscriptionController: SubscriptionController? = null

    @Test
    fun getUserSubscription() {
        val result = subscriptionController!!.getUserSubscription(LoginUserInfo().apply {
            userId = 100001
            userType = UserTypeEnum.APPUSER
            username = "test"
        })
        StaticLog.info(JSONUtil.toJsonStr(result))
    }

}