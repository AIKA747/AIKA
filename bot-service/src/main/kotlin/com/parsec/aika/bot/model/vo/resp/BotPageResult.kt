package com.parsec.aika.bot.model.vo.resp

import com.parsec.trantor.common.response.PageResult

class BotPageResult<T> : PageResult<T>() {

    var tags: List<String>? = null
}