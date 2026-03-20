package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.vo.PageVo


/** 查询入群申请分页请求对象 */
class ChatroomJoinRequestPageReq : PageVo() {
  /** 群聊ID */
  var roomId: Int? = null
}
