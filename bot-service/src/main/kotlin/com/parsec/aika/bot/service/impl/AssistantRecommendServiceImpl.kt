package com.parsec.aika.bot.service.impl

import com.parsec.aika.bot.remote.ContentFeignClient
import com.parsec.aika.bot.service.AssistantRecommendService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.model.bo.BotRecommendBO
import com.parsec.aika.common.model.bo.StoryRecommendBO
import com.parsec.aika.common.model.em.RecommendStrategy
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class AssistantRecommendServiceImpl : AssistantRecommendService {

    @Autowired
    private lateinit var botMapper: BotMapper

    @Autowired
    private lateinit var contentFeignClient: ContentFeignClient

    override fun botRecommend(userId: Long, tags: List<String>, recommendStrategy: RecommendStrategy): BotRecommendBO? {
        var botRecommend = botMapper.botRecommend(tags, recommendStrategy,userId)
        if (Objects.isNull(botRecommend)) {
            botRecommend = botMapper.botRecommend(null, recommendStrategy, userId)
        }
        return botRecommend
    }

    override fun storyRecommend(
        userId: Long, tags: String, recommendStrategy: RecommendStrategy
    ): StoryRecommendBO? {
        return contentFeignClient.storyRecommend(userId, tags, recommendStrategy)
    }
}