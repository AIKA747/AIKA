package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import java.time.LocalDateTime

@TableName("user_block_rel")
class UserBlockRel {

    /**
     * 用户id
     */
    var userId: Long? = null

    /**
     * 被屏蔽用户id
     */
    var blockedUserId: Long? = null

    /**
     * 屏蔽时间
     */
    var blockAt: LocalDateTime? = null

}