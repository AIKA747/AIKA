package com.parsec.aika.user.service

import com.baomidou.mybatisplus.extension.service.IService
import com.parsec.aika.common.model.bo.NotifyBO
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.domain.Notification
import com.parsec.aika.user.model.vo.resp.AppNotifyResp
import com.parsec.trantor.common.response.PageResult

/**
 * @author 77923
 * @description 针对表【notification(用户通知表)】的数据库操作Service
 * @createDate 2025-01-24 18:44:26
 */
interface NotificationService : IService<Notification> {
    /**
     * 保存用户通知
     */
    fun saveNotification(notifyBO: NotifyBO)

    /**
     *通知列表
     */
    fun notificationList(pageNo: Int, pageSize: Int, lastTime: String?, userId: String?): PageResult<AppNotifyResp>?

    /**
     * 通知已读标识
     */
    fun readNotification(notificationIds: String, user: LoginUserInfo)

    /**
     * 未读通知数量
     */
    fun unreadNotificationCount(userId: Long): Int
}
