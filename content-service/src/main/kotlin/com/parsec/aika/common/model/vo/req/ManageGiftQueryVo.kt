package com.parsec.aika.common.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.vo.PageVo

class ManageGiftQueryVo : PageVo() {

    // 故事id
    @JsonSerialize(using = ToStringSerializer::class)
    var storyId: Long? = null

    // 章节id
    @JsonSerialize(using = ToStringSerializer::class)
    var chapterId: Long? = null

    // 故事名称
    var giftName: String? = null

}
