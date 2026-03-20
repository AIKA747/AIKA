package com.parsec.aika.user.model.entity

import com.parsec.aika.common.model.entity.BaseDomain
import com.parsec.aika.user.model.em.ImageType

class UserImage : BaseDomain() {

    var userId: Long? = null

    var type: ImageType? = null

    var imageUrl: String? = null

    var remark: String? = null
} 