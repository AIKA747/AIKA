package com.parsec.aika.user.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.user.model.entity.InterestTags
import com.parsec.aika.user.model.vo.req.ManageTagsCreateVo
import com.parsec.aika.user.model.vo.req.ManageTagsQueryVo
import com.parsec.aika.user.model.vo.req.ManageTagsUpdateSortNoVo
import com.parsec.aika.user.model.vo.req.ManageTagsUpdateVo
import com.parsec.aika.user.model.vo.resp.ManageTagsListVo
import com.parsec.trantor.common.response.PageResult

interface InterestTagsService {

    /**
     * 获取标签列表
     */
    fun tagNameList(pageVo: PageVo): PageResult<String>

    /**
     * 标签管理列表
     */
    fun manageTagsList(req: ManageTagsQueryVo): PageResult<ManageTagsListVo>

    /**
     * 新增标签
     */
    fun manageTagCreate(vo: ManageTagsCreateVo, user: LoginUserInfo): Long?

    /**
     * 修改标签
     */
    fun manageTagUpdate(vo: ManageTagsUpdateVo, user: LoginUserInfo): InterestTags

    /**
     * 修改标签排序
     */
    fun manageTagUpdateSortNo(vo: ManageTagsUpdateSortNoVo, user: LoginUserInfo)

    /**
     * 删除标签
     */
    fun manageTagDelete(id: Long, user: LoginUserInfo)

}