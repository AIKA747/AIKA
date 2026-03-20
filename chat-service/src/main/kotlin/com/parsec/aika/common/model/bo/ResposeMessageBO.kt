package com.parsec.aika.common.model.bo

class ResposeMessageBO {
    /**
     * 当服务端响应客户端时为clientMsgId，客户端响应服务端端时，为msgId
     */
    var msgId: String? = null

    /**
     * 0接收成功，其他：接收失败
     */
    var code: Int? = null

    /**
     * 说明
     */
    var msg: String? = null

}