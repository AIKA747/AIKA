package com.parsec.aika.bot.service

import com.parsec.aika.common.model.bo.BotRecommendBO
import com.parsec.aika.common.model.bo.StoryRecommendBO
import com.parsec.aika.common.model.em.RecommendStrategy

/**
 * 助手推荐接口
 */
interface AssistantRecommendService {

    /**
     * 查询推荐机器人
     * 标签集合
     */
    fun botRecommend(userId: Long, tags: List<String>, recommendStrategy: RecommendStrategy): BotRecommendBO?

    /**
     * 查询推荐故事
     * 标签集合
     */
    fun storyRecommend(userId: Long, tags: String, recommendStrategy: RecommendStrategy): StoryRecommendBO?


}