package com.parsec.aika.common.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import jakarta.validation.constraints.NotNull

/**
 * @author RainLin
 * @since 2024/1/26 11:31
 */
class PostAppStoryRecorderReq {

    // 故事id
    @NotNull
    @JsonSerialize(using = ToStringSerializer::class)
    var storyId: Long? = null
}
