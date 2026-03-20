package com.parsec.aika.content.service

import com.parsec.aika.common.model.entity.PostReport
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.ManagePostReportReq
import com.parsec.aika.common.model.vo.resp.PostReportResp
import com.parsec.trantor.common.response.PageResult

interface PostReportService {

    /**
     * 获取举报列表
     */
    fun reportList(): List<PostReport>?

    /**
     * 举报帖子
     */
    fun reportPost(reportId: Int, postId: Int, user: LoginUserInfo)

    /**
     * 取消举报
     */
    fun cancelPostReport(postId: Int, user: LoginUserInfo): Int

    /**
     * 获取帖子举报列表
     */
    fun postReportList(req: ManagePostReportReq): PageResult<PostReportResp>?

}
