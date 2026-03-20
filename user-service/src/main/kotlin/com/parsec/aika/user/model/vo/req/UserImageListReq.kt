package com.parsec.aika.user.model.vo.req

import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.user.model.em.ImageType

class UserImageListReq : PageVo() {
    var type: ImageType? = null
} 