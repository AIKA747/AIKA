package com.parsec.aika.user.controller

import cn.hutool.log.StaticLog
import com.google.firebase.messaging.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.remote.OrderFeignClient
import com.parsec.aika.user.service.UserService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class TestController {

    @Resource
    private lateinit var orderFeignClient: OrderFeignClient

    @Resource
    private lateinit var userService: UserService

    @GetMapping("/test/feign")
    fun testFeign(param: String): BaseResult<String> {
        StaticLog.info("/test/feign:$param")
        return BaseResult.success(orderFeignClient.test(param))
    }

    @GetMapping("/test/auth/info")
    fun testGetAuthInfo1(param: String, userInfo: LoginUserInfo): BaseResult<LoginUserInfo> {
        StaticLog.info("param:{}", param)
        return BaseResult.success(userInfo)
    }

    @PostMapping("/test/auth/info")
    fun testPostAuthInfo(@RequestBody param: String, userInfo: LoginUserInfo): BaseResult<LoginUserInfo> {
        StaticLog.info("param:{}", param)
        return BaseResult.success(userInfo)
    }

    @GetMapping("/test/push/inactive/msg")
    fun testPushMsg(userId: Long): BaseResult<Boolean> {
        return BaseResult.success(userService.pushToUser(userId))
    }

    @PostMapping("/test/syncUserList")
    fun syncUserList(): BaseResult<*> {
        userService.syncUserList()
        return BaseResult.success()
    }

    @GetMapping("/test/firebase/token")
    fun testFireBaseToken(
        token: String, title: String, content: String
    ): BaseResult<*> {
        val message = MulticastMessage.builder().setNotification(
            Notification.builder().setTitle(title).setBody(content).build()
        )
            // 配置安卓和苹果的消息提示音
            .setAndroidConfig(
                AndroidConfig.builder().setNotification(
                    AndroidNotification.builder().setSound("default").build()
                ).build()
            ).setApnsConfig(
                ApnsConfig.builder().setAps(
                    Aps.builder().setSound("default").build()
                ).build()
            ).addAllTokens(listOf(token)).build()
        val response = FirebaseMessaging.getInstance().sendEachForMulticast(message)
        return BaseResult.success(response)
    }

    @GetMapping("/public/health")
    fun health(): BaseResult<*> {
        return BaseResult.success()
    }

    @GetMapping("/manage/inactiveUserEmails")
    fun inactiveUserEmails(date: String): BaseResult<*> {
        val inactiveUsers = userService.inactiveUserEmails(date)
        return BaseResult.success(inactiveUsers)
    }

}