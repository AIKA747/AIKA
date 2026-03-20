package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.em.ActionType
import com.parsec.aika.common.model.entity.BotImage

class SyncRelationBO {

    /**
     * 用户id
     */
    var userId: Long? = null

    /**
     * 关注对象的ID（可以是机器人或人类的ID）
     */
    var followingId: Long? = null

    /**
     * ADD：关注
     * DELETE：取消关注
     */
    var actionType: ActionType? = null

    /**
     * 机器人的形象相关信息，包含封面和头像地址等
     */
    var botImage: BotImage? = null

}
