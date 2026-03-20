package com.parsec.aika.common.model.em

/**
 * 消息类型枚举
 */
enum class MsgType {

    /**
     * 会话消息-用户
     */
    CHAT_MSG,

    /**
     * 已读消息
     */
    READ_MSG,

    /**
     * 确认收到消息
     */
    RESP_MSG,

    /**
     * 图片生成进度
     */
    IMAGE_RESP,

    /**
     * 重新生成消息
     */
    CHAT_MSG_REGENERATE,

    /**
     * 撤回消息
     */
    RECALL

}