package com.parsec.aika.user.service

import com.parsec.aika.user.model.vo.req.GetManageGroupReq
import com.parsec.aika.user.model.vo.req.PostManageGroupReq
import com.parsec.aika.user.model.vo.req.PostManageUserGroupReq
import com.parsec.aika.user.model.vo.req.PutManageGroupReq
import com.parsec.aika.user.model.vo.resp.GetManageGroupResp
import com.parsec.aika.user.model.vo.resp.PostManageGroupUserReq
import com.parsec.trantor.common.response.PageResult

interface GroupService {

    /**
     * 新增
     */
    fun postManageGroup(req: PostManageGroupReq)

    /**
     * 编辑
     */
    fun putManageGroup(req: PutManageGroupReq)

    /**
     * 列表
     */
    fun getManageGroup(req: GetManageGroupReq): PageResult<GetManageGroupResp>

    /**
     * 加入
     */
    fun postManageGroupUser(req: PostManageGroupUserReq)

    /**
     * 删除
     */
    fun deleteManageGroupId(id: Long)
    fun postManageUserGroup(req: PostManageUserGroupReq)
    fun deleteGroupUser(req: PostManageGroupUserReq)
}