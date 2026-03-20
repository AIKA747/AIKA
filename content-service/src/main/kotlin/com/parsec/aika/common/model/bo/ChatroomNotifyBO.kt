package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.dto.BaseNotifyContent
import com.parsec.aika.common.model.em.ChatroomNotifyType

class ChatroomNotifyBO {
    /**
     * 通知用户id
     */
    var userIds: List<Long>? = null

    /**
     * 通知标题
     */
    var title: String? = null

    /**
     * 通知内容
     */
    var content: String? = null

    /**
     * 通知内容,需按json包含
     */
    var body: BaseNotifyContent? = null

}