package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.BotImage

class FollowRelationBO {

    // 创建人ID
    var creator: Long? = null

    // 关注对象的ID（可以是机器人或人类的ID）
    var followingId: Long? = null

    // 类型（BOT和USER的枚举情况，这里暂用字符串表示，可按需优化为枚举类）
    var type: AuthorType? = null

    // 机器人的形象相关信息，包含封面和头像地址等
    var botImage: BotImage? = null
}
