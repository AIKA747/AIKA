package com.parsec.aika.common.model.bo

class FollowRelationBO {

    // 创建人ID
    var creator: Long? = null

    // 关注对象的ID（可以是机器人或人类的ID）
    var followingId: Long? = null
}
