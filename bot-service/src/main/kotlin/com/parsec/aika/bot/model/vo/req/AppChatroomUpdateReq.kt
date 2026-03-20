package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.dto.PermissionVo
import com.parsec.aika.common.model.em.ChatroomGroupTypeEnum

class AppChatroomUpdateReq {
    var id: Long? = null
    var roomName: String? = null

    /** 群聊类型：PUBLIC、PRIVATE*/
    var groupType: ChatroomGroupTypeEnum? = null
    var roomAvatar: String? = null
    var description: String? = null
    var permissions: List<PermissionVo>? = null
    var historyMsgVisibility: Boolean? = null
//    var theme: String? = null
}
