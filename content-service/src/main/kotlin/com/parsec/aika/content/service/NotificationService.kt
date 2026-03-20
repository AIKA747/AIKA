package com.parsec.aika.content.service

import com.parsec.aika.common.model.bo.NotifyBO
import com.parsec.aika.common.model.dto.BaseNotifyContent

interface NotificationService {
    fun sendNotification(notifyBO: NotifyBO)

    fun chatMessageNotify(userIds: List<Long>, title: String, content: String, notifyContent: BaseNotifyContent)
}