package com.parsec.aika.common.util

import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.PageResult

class PageUtil<T> {
    fun page(pageResult: Page<T>): PageResult<T> {
        return PageResult<T>().apply {
            this.list = pageResult.records.toList()
            this.pageNum = pageResult.current
            this.pageSize = pageResult.size
            this.pages = pageResult.pages
            this.total = pageResult.total
        }
    }

    fun page(page: PageVo, list: List<T>, total: Long): PageResult<T> {
        return PageResult<T>().apply {
            this.list = list.toList()
            this.pageNum = page.pageNo!!.toLong()
            this.pageSize = page.pageSize!!.toLong()
            this.total = total
            this.pages = if (total == 0L) 0L else (total + page.pageSize!! - 1) / page.pageSize!!
        }
    }
}
