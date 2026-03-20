package com.parsec.aika.common.model.em

/**
 * 消息内容类型
 */
enum class ContentType {
    /**
     * 文本
     */
    TEXT,

    /**
     * 语音
     */
    VOICE,

    /**
     * 图片
     */
    IMAGE,

    /**
     * 视频
     */
    VIDEO,

    /**
     * 机器人推荐
     */
    botRecommend,

    /**
     * 故事推荐
     */
    storyRecommend,

    /**
     * 发送礼物
     */
    gift,

    /**
     * markdown格式文本
     */
    md,

    /**
     * 游戏结果
     */
    gameResult,

    /**
     * 任务
     */
    task,

    /**
     * 成员变更
     */
    memberChange
}