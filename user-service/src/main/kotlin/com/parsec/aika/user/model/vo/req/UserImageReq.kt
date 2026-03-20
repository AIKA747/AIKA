package com.parsec.aika.user.model.vo.req

import com.parsec.aika.user.model.em.ImageType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

class UserImageReq {

    @NotNull(message = "Type cannot be empty")
    var type: ImageType? = null

    @NotBlank(message = "ImageUrl cannot be empty")
    var imageUrl: String? = null

    var remark: String? = null
} 
