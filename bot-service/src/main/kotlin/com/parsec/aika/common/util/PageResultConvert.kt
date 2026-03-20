package com.parsec.aika.common.util

import com.parsec.trantor.common.response.PageResult

object PageResultConvert {
    inline fun <T, reified R> PageResult<T>.convert(mapper: (T) -> R): PageResult<R> {
        val transformedList = this.list.map(mapper)
        return PageResult<R>().apply {
            this.list = transformedList
            this.pageNum = this@convert.pageNum
            this.pageSize = this@convert.pageSize
            this.pages = this@convert.pages
            this.total = this@convert.total
        }
    }
}
