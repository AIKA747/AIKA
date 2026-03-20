package com.parsec.aika.user.service.impl

import cn.hutool.core.lang.Assert
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.utils.PageUtil
import com.parsec.aika.user.mapper.InterestTagsMapper
import com.parsec.aika.user.model.entity.InterestTags
import com.parsec.aika.user.model.vo.req.ManageTagsCreateVo
import com.parsec.aika.user.model.vo.req.ManageTagsQueryVo
import com.parsec.aika.user.model.vo.req.ManageTagsUpdateSortNoVo
import com.parsec.aika.user.model.vo.req.ManageTagsUpdateVo
import com.parsec.aika.user.model.vo.resp.ManageTagsListVo
import com.parsec.aika.user.service.InterestTagsService
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource

@Service
class InterestTagsServiceImpl : InterestTagsService {

    @Resource
    private lateinit var interestTagsMapper: InterestTagsMapper

    override fun tagNameList(pageVo: PageVo): PageResult<String> {
        val page = Page<String>(pageVo.pageNo!!.toLong(), pageVo.pageSize!!.toLong())
        return PageUtil<String>().page(interestTagsMapper.tagNameList(page))
    }

    override fun manageTagsList(req: ManageTagsQueryVo): PageResult<ManageTagsListVo> {
        val page = Page<ManageTagsListVo>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<ManageTagsListVo>().page(interestTagsMapper.manageTagsList(page, req))
    }

    override fun manageTagCreate(vo: ManageTagsCreateVo, user: LoginUserInfo): Long? {
        Assert.isFalse(interestTagsMapper.manageCheckTagName(vo.tagName!!, null), "标签名称已存在")
        val tag = InterestTags().apply {
            this.tagName = vo.tagName
            this.sortNo = vo.sortNo
            this.creator = user.userId
            this.createdAt = LocalDateTime.now()
            this.deleted = false
            this.dataVersion = 0
        }
        interestTagsMapper.insert(tag)
        return tag.id
    }

    override fun manageTagUpdate(vo: ManageTagsUpdateVo, user: LoginUserInfo): InterestTags {
        val tag = this.checkTag(vo.id!!)
        Assert.isFalse(interestTagsMapper.manageCheckTagName(vo.tagName!!, vo.id), "标签名称已存在")
        tag.tagName = vo.tagName
        tag.sortNo = vo.sortNo
        tag.updater = user.userId
        tag.updatedAt = LocalDateTime.now()
        interestTagsMapper.updateById(tag)
        return tag
    }

    override fun manageTagUpdateSortNo(vo: ManageTagsUpdateSortNoVo, user: LoginUserInfo) {
        this.checkTag(vo.id!!)
        interestTagsMapper.updateById(InterestTags().apply {
            this.id = vo.id
            this.sortNo = vo.sortNo
        })
    }

    override fun manageTagDelete(id: Long, user: LoginUserInfo) {
        this.checkTag(id)
        interestTagsMapper.deleteById(id)
    }

    private fun checkTag(id: Long): InterestTags {
        val tag = interestTagsMapper.selectById(id)
        Assert.notNull(tag, "该标签信息不存在")
        return tag
    }
}