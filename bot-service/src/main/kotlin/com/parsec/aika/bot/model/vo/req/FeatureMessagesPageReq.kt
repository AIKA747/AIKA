package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

/**
 *
 * @author Zijian Liao
 * @since 1.0.0
 */
class FeatureMessagesPageReq : PageVo() {
  // 群聊ID
  var roomId: String? = null
}
