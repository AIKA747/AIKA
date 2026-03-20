package com.parsec.aika.common.utils

import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.trantor.common.response.PageResult

/**
 * @author RainLin
 * @since 2023/12/28 15:51
 */
class PageUtil<T> {
    fun page(page: Page<T>): PageResult<T> {
        return PageResult<T>().apply {
            this.list = page.records
            this.pageNum = page.current
            this.pageSize = page.size
            this.pages = page.pages
            this.total = page.total
        }
    }

    fun page(list: List<T>, pageNum: Int, pageSize: Int, total: Int): PageResult<T> {
        return PageResult<T>().apply {
            this.list = list
            this.pageNum = pageNum.toLong()
            this.pageSize = pageSize.toLong()
            this.pages = if (total % pageSize == 0) {
                total / pageSize
            } else {
                total / pageSize + 1
            }.toLong()
            this.total = total.toLong()
        }
    }
}