package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.resp.AppNotifyResp
import com.parsec.aika.user.service.NotificationService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppNotificationController {

    @Resource
    private lateinit var notificationService: NotificationService

    @GetMapping("/app/notification")
    fun getNotificationList(
        pageNo: Int?,
        pageSize: Int?,
        lastTime: String?,
        user: LoginUserInfo
    ): BaseResult<PageResult<AppNotifyResp>> {
        return BaseResult.success(
            notificationService.notificationList(
                pageNo ?: 1,
                pageSize ?: 10,
                lastTime,
                user.userId.toString()
            )
        )
    }

    /**
     * 支持批量标记已读
     */
    @PutMapping("/app/notification/read")
    fun readNotification(notificationId: String, user: LoginUserInfo): BaseResult<Void> {
        notificationService.readNotification(notificationId, user)
        return BaseResult.success()
    }

    @GetMapping("/app/notification/unread-num")
    fun unreadNotificationCount(user: LoginUserInfo): BaseResult<Int> {
        return BaseResult.success(notificationService.unreadNotificationCount(user.userId!!))
    }

}