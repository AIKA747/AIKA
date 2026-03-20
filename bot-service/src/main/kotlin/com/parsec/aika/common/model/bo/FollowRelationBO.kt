package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.entity.BotImage

class FollowRelationBO {

    // 创建人ID
    var creator: Long? = null

    // 关注对象的ID（可以是机器人或人类的ID）
    var followingId: Long? = null

    // 机器人的形象相关信息，包含封面和头像地址等
    var botImage: BotImage? = null
}
