package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.em.ActionType

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


}
