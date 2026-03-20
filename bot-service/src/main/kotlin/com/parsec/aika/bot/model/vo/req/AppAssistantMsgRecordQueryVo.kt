package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

class AppAssistantMsgRecordQueryVo : PageVo() {

    /**
     * 若传入值，则只查询记录时间大于该事件的消息记录
     */
    var lastTime: String? = null

}