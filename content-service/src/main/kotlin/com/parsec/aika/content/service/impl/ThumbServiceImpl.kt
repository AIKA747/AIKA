package com.parsec.aika.content.service.impl

import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.ThumbMapper
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.resp.AppThumbListResp
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.service.ThumbService
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import jakarta.annotation.Resource

@Service
class ThumbServiceImpl : ThumbService {

    @Resource
    private lateinit var thumbMapper: ThumbMapper

    override fun getPostThumbList(
        pageNo: Int?,
        pageSize: Int?,
        postId: Int,
        user: LoginUserInfo
    ): PageResult<AppThumbListResp>? {
        val page = Page<AppThumbListResp>((pageNo ?: 1).toLong(), (pageSize ?: 10).toLong())
        return PageUtil<AppThumbListResp>().page(thumbMapper.selectPostThumbList(page, postId, user.userId!!))
    }
}