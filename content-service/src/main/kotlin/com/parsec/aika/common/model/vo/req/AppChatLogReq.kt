package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.vo.PageVo
import jakarta.validation.constraints.NotNull

class AppChatLogReq : PageVo() {


    /**
     * 故事id
     */
    @NotNull
    var storyId: Long? = null

    /**
     * 若传入值，则只查询记录时间大于该事件的消息记录
     */
    var lastTime: String? = null


}
