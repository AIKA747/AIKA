package com.parsec.aika.common.model.const

object RedisConst {

    val botMsgRecordListKey = "chat:bot:msgRecordList"

    val assistantMsgRecordListKey = "chat:assistant:msgRecordList"

    val chatVideKey = "chat:video"

    val chatImageKey = "chat:image"

    /**
     * 用户数字人聊天的次数
     */
    val userVideoGenerateNum = "chat:user:videoGenerateNum"

    /**
     * 用户在线标识
     * arg0:用户id
     */
    const val CHAT_USER_ONLINE_FLAG = "user:online:{}"

    /**
     * 群聊消息列表key
     */
    const val CHATROOM_KEY_PREFIX = "chatroom:records:"

    /**
     * 聊天消息 key
     */
    const val MESSAGE_KEY = "chatroom:message:"


    const val RECALL_MESSAGE_FLAG = "chatroom:meesage:recall:"

}