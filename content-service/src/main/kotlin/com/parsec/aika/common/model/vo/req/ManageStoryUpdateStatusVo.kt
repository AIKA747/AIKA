package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.em.StoryStatus
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

class ManageStoryUpdateStatusVo {

    // 故事id
    @NotNull(message = "故事id不能为空")
    var id: Long? = null

    // 故事状态
    @NotBlank(message = "故事状态不能为空")
    var status: StoryStatus? = null
}
