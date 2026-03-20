package com.parsec.aika.common.model.bo

class ChatroomNotifyBO {

    /**
     * 通知用户id
     */
    var userIds: List<Long>? = null

    /**
     * 通知标题
     */
    var title: String? = null

    /**
     * 通知内容
     */
    var content: String? = null

    /**
     * 通知内容,json对象
     */
    var body: Map<String, String?>? = null

}