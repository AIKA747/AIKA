package com.parsec.aika.user.model.vo.req

import com.parsec.aika.common.model.vo.PageVo
import jakarta.validation.constraints.NotNull

/**
 * 我的好友列表
 */
class AppFollowFriendsReq : PageVo() {

    /**
     * 关注状态：我关注他(FOLLOWING)；他关注我(FOLLOWED_BY) ;互相关注（MUTUAL)
     */
    @NotNull(message = "关注状态不能为空")
    var followStatus: String? = null


    /**
     * 当前用户id
     */
    var userId: Long? = null

    /**
     * 模糊匹配，对方用户名
     */
    var username: String? = null

    /**
     * 模糊匹配，对方昵称
     */
    var nickname: String? = null
}
