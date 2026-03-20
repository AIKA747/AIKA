package com.parsec.aika.common.model.em

enum class GroupMemberStatus {
    /**
     * (朋友邀请加入群聊，待用户审核)
     */
    FRIEND_INVITE,

    /**
     * （用户申请加入群里，待管理员审核）
     */
    USER_JOIN_REQUEST,

    /**
     * （已通过）
     */
    APPROVE,

    /**
     * 未加入群聊状态
     */
    NONE


}