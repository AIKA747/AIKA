package com.parsec.aika.chat.model.vo.req

class EmqxAuthReq {
    /**
     * 用户名，role+id
     */
    var username: String? = null

    /**
     * 主题
     */
    var topic: String? = null

    /**
     * 发布或订阅
     * publish or subscribe
     */
    var action: String? = null
}