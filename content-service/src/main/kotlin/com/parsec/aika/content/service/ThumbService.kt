package com.parsec.aika.content.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.resp.AppThumbListResp
import com.parsec.trantor.common.response.PageResult

interface ThumbService {

    /**
     * 获取帖子点赞列表
     */
    fun getPostThumbList(pageNo: Int?, pageSize: Int?, postId: Int, user: LoginUserInfo): PageResult<AppThumbListResp>?
}