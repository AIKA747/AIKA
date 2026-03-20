package com.parsec.aika.common.model.dto

class PermissionVo {
    var memberRole: String? = null
    var linkChatToPosts: Boolean = false
    var approveNewMembers: Boolean = false
    var addOtherMembers: Boolean = false
    var changeGroupSettings: Boolean = false

    var changeGroupInfo: Boolean = false
    var changeGroupType: Boolean = false
    var changeShowHis: Boolean = false

}
