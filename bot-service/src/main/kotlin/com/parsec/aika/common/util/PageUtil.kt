package com.parsec.aika.common.util

import com.github.pagehelper.Page
import com.parsec.trantor.common.response.PageResult

class PageUtil<T> {
    fun page(list: List<T>): PageResult<T> {
        val page = list as Page
        return PageResult<T>().apply {
            this.list = page.result.toList()
            this.pageNum = page.pageNum.toLong()
            this.pageSize = page.pageSize.toLong()
            this.pages = page.pages.toLong()
            this.total = page.total
        }
    }
}