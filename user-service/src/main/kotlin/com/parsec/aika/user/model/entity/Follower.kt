package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.parsec.aika.common.model.entity.BaseDomain
import java.time.LocalDateTime


@TableName("follower")
class Follower : BaseDomain() {

    /**
     * 用户id
     */
    var userId: Long? = null

    /**
     * 被关注用户id
     */
    var followingId: Long? = null

    /**
     * 1: userId 关注了followingId, 0: 没关注
     */
    var uf: Int? = null

    /**
     * 1: followingId 关注了userId, 0: 没关注
     */
    var fu: Int? = null


    /**
     * 最后一次读取时间
     */
    var lastReadTime: LocalDateTime? = null

    /**
     * 创建人
     */
    var creator: String? = null

    /**
     * 更新人
     */
    var updater: String? = null
}
