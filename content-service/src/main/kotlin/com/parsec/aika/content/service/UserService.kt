package com.parsec.aika.content.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.resp.AppUserStatisticsResp
import com.parsec.aika.common.model.vo.resp.FollowUserResp
import com.parsec.trantor.common.response.PageResult

interface UserService {

    /**
     * 获取用户统计数据
     */
    fun getUserStatistics(userId: Long): AppUserStatisticsResp

    /**
     * 获取用户关注列表
     */
    fun followUsers(
        pageNo: Int?, pagerSize: Int?, type: Int?, userId: Long?,searchName: String?, loginUserInfo: LoginUserInfo
    ): PageResult<FollowUserResp>?
}