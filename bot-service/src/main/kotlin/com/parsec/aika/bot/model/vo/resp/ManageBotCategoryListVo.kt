package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

class ManageBotCategoryListVo {

    /**
     * 分类id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var categoryId: Long? = null

    /**
     * 分类名
     */
    var categoryName: String? = null
    
}