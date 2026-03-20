package com.parsec.aika.common.model.vo.resp

/**
 * @author Zhao YinPing
 * @version 1.0
 * @date 2025/01/16
 */
open class GetFollowCountResp {
    // 被关注数量
    var followers: Long? = null
    // 关注数量
    var following: Long? = null
}
