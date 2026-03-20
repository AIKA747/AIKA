package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.dto.ChatroomMemberVo
import com.parsec.aika.common.model.dto.PermissionVo
import com.parsec.aika.common.model.em.ChatroomGroupTypeEnum
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

class AppChatroomCreatReq {
    @NotBlank
    var roomName: String? = null

    /** 群聊类型：PUBLIC、PRIVATE*/
    @NotNull
    var groupType: ChatroomGroupTypeEnum? = null
    var roomAvatar: String? = null
    var description: String? = null
    var members: List<ChatroomMemberVo>? = null
    var permissions: List<PermissionVo>? = null
    var ownerId: Long? = null


}

