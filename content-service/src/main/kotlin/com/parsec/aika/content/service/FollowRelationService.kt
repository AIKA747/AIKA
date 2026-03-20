package com.parsec.aika.content.service

import com.parsec.aika.common.model.bo.FollowRelationBO
import com.parsec.aika.common.model.entity.BotImage
import com.parsec.aika.common.model.vo.LoginUserInfo

/**
 * @author Zhao YinPing
 * @version 1.0
 * @date 2024/12/24.
 */
interface FollowRelationService {
    fun updateBotImage(botId: Long, botImage: BotImage, user: LoginUserInfo): Int

    /**
     * 用户关注
     */
    fun followRelation(relationBO: FollowRelationBO)

    /**
     * 取消关注
     */
    fun unfollowRelation(relationBO: FollowRelationBO)
}
