package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName

@TableName("t_category")
class Category : BaseDomain() {

    var name: String? = null

    var weight: Int? = null

    var creator: Long? = null

    var updater: Long? = null

}