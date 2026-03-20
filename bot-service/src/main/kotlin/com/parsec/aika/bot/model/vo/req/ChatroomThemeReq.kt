package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotNull


/**
{
    "type": "string",
    "color": "string",
    "gallery": "string",
    "roomId": 0
}
*/
class AppChatroomThemeReq {
  @NotNull
  var roomId: Long? = null
  var color: String? = null
  var type: String? = null
  var gallery: String? = null
}
