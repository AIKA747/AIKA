package com.parsec.aika.common.model.vo.req

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

class ManageGiftCreateVo {

    // 礼物名称
    @NotBlank(message = "礼物名称不能为空")
    var giftName: String? = null

    // 每个礼物增加的友好分
    @NotNull(message = "礼物友好分不能为空")
    var friendDegree: Int? = null

    // 每个礼物增加的情节分
    @NotNull(message = "礼物情节分不能为空")
    var storyDegree: Int? = null

    // 故事id，可以为空，为空表示全局通用
    var storyId: Long? = null

    // 章节id，可以为空，为空表示故事通用
    var chapterId: Long? = null

    @NotBlank(message = "礼物图片不能为空")
    var image: String? = null

}
