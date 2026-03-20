package com.parsec.aika.common.model.dto

import com.parsec.aika.common.model.em.ChatroomNotifyType

abstract class BaseNotifyContent {

    /**
     * 通知类型
     */
    var type: ChatroomNotifyType? = null

    var id: String? = null
}