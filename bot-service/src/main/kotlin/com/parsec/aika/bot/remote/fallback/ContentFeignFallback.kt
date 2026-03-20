package com.parsec.aika.bot.remote.fallback

import cn.hutool.log.StaticLog
import com.parsec.aika.bot.remote.ContentFeignClient
import com.parsec.aika.common.model.bo.StoryRecommendBO
import com.parsec.aika.common.model.em.RecommendStrategy
import com.parsec.aika.common.model.vo.req.BotPostReq
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.stereotype.Component

@Component
class ContentFeignFallback : ContentFeignClient {

    override fun storyRecommend(userId: Long, tags: String, recommendStrategy: RecommendStrategy): StoryRecommendBO? {
        StaticLog.error("查询故事推荐异常")
        return null
    }

    override fun translateLanguage(text: String, language: String): String? {
        StaticLog.error("翻译文本异常.....,language:${language},text：$text")
        return text
    }

    override fun createBotPost(botPostReq: BotPostReq): BaseResult<Void> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR)
    }
}