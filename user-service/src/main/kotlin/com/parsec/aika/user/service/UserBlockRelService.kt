package com.parsec.aika.user.service

import com.parsec.aika.user.model.vo.req.ListBlockedUserReq
import com.parsec.aika.user.model.vo.resp.ListBlockedUserResp
import com.parsec.trantor.common.response.PageResult

interface UserBlockRelService {

    /**
     * 获取指定用户被屏蔽用户列表
     */
    fun listBlockedUser(req: ListBlockedUserReq): PageResult<ListBlockedUserResp>

    /**
     * 获取指定用户被屏蔽用户ID集合
     */
    fun getBlockedUserIdList(userId: Long): List<Long>

    /**
     * 屏蔽用户
     */
    fun block(userId: Long, blockedUserId: Long)

    /**
     * 解除屏蔽
     */
    fun unBlock(userId: Long, blockedUserId: Long)
}