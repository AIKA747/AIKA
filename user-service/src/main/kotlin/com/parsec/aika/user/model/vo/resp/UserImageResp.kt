package com.parsec.aika.user.model.vo.resp

import com.parsec.aika.user.model.em.ImageType
import java.time.LocalDateTime

class UserImageResp {
    var id: Long? = null
    var createdAt: LocalDateTime? = null
    var type: ImageType? = null
    var imageUrl: String? = null
    var remark: String? = null
    var checked: Boolean? = null
} 