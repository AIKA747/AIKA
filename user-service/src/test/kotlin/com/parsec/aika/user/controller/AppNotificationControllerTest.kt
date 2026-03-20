package com.parsec.aika.user.controller

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import javax.annotation.Resource

@SpringBootTest
class AppNotificationControllerTest {

    @Resource
    private lateinit var appNotificationController: AppNotificationController

    @Test
    fun getNotificationList() {
        val baseResult = appNotificationController.getNotificationList(1, 10, null, LoginUserInfo().apply {
            userId = 1
        })
        StaticLog.info(JSONUtil.toJsonStr(baseResult))
    }

    @Test
    fun readNotification() {
        val baseResult = appNotificationController.readNotification("ALL", LoginUserInfo().apply {
            userId = 1
        })
        StaticLog.info(JSONUtil.toJsonStr(baseResult))
    }

    @Test
    fun unreadNotificationNum() {
        val baseResult = appNotificationController.unreadNotificationCount(LoginUserInfo().apply {
            userId = 1
        })
        StaticLog.info(JSONUtil.toJsonStr(baseResult))
    }


}