package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotBlank

class PutVideoReq {

    @NotBlank
    var profileId: String? = null

    @NotBlank
    var videoId: String? = null


}