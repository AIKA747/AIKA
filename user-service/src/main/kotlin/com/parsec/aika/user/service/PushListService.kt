package com.parsec.aika.user.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.GetPushListsReq
import com.parsec.aika.user.model.vo.req.PostPushListReq
import com.parsec.aika.user.model.vo.resp.GetPushListIdResp
import com.parsec.aika.user.model.vo.resp.GetPushListsResp
import com.parsec.trantor.common.response.PageResult

interface PushListService {

    fun getPushListId(id: Long): GetPushListIdResp

    fun getPushLists(req: GetPushListsReq): PageResult<GetPushListsResp>

    fun postPushList(req: PostPushListReq, loginUserInfo: LoginUserInfo)

    fun pushUserNotify(userId: Long?, username: String?, title: String?, content: String?, jobId: Long? = null)


    fun pushChatroomNotify(
        userIds: List<Long>, title: String?, content: String?, data: Map<String, String?>?
    )
}