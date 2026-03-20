package com.parsec.aika.common.model.vo

/**
 * 分页参数,凡需要分页的VO参数类可继承此类
 */
open class PageVo {
    var pageNo: Int? = 1
    var pageSize: Int? = 10
}
