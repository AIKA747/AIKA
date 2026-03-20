package com.parsec.aika.content.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.model.vo.req.PostAppUserCollectStoryReq
import com.parsec.aika.common.model.vo.resp.GetAppUserCollectStoryResp
import com.parsec.trantor.common.response.PageResult

interface CollectStoryService {

    fun postAppUserCollectStory(req: PostAppUserCollectStoryReq, loginUserInfo: LoginUserInfo): Long?

    fun deleteAppUserCollectStoryId(storyId: Long, loginUserInfo: LoginUserInfo)

    fun getAppUserCollectStory(req: PageVo, loginUserInfo: LoginUserInfo): PageResult<GetAppUserCollectStoryResp>
}
