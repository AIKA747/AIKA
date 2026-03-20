package com.parsec.aika.content.controller.api

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.ThumbMapper
import com.parsec.aika.common.model.entity.Thumb
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import jakarta.annotation.Resource
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController {

    @Resource
    private lateinit var thumbMapper: ThumbMapper

    @GetMapping("/public/test/thumb/count")
    fun queryCount(): BaseResult<Long> {
        return BaseResult.success(thumbMapper.selectCount(KtQueryWrapper(Thumb::class.java)))
    }

    @GetMapping("/public/test/thumb/list")
    fun queryList(): BaseResult<List<Thumb>> {
        return BaseResult.success(
            thumbMapper.selectList(KtQueryWrapper(Thumb::class.java).last("limit 10"))
        )
    }

    @GetMapping("/public/test/thumb/page")
    fun queryPage(): BaseResult<PageResult<Thumb>> {
        val page = Page<Thumb>(1, 10)
        val pageResult = thumbMapper.selectPage(page, KtQueryWrapper(Thumb::class.java))
        return BaseResult.success(
            PageUtil<Thumb>().page(pageResult)
        )
    }

    @GetMapping("/public/health")
    fun health(): BaseResult<*> {
        return BaseResult.success()
    }


}