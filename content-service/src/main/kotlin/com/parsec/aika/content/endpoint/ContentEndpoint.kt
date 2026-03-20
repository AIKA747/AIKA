package com.parsec.aika.content.endpoint

import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.common.mapper.FollowRelationMapper
import com.parsec.aika.common.model.bo.StoryRecommendBO
import com.parsec.aika.common.model.em.RecommendStrategy
import com.parsec.aika.common.model.entity.FollowRelation
import com.parsec.aika.content.service.AuthorService
import com.parsec.aika.content.service.StoryService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import jakarta.annotation.Resource

@RestController
class ContentEndpoint {

    @Autowired
    private lateinit var authorService: AuthorService

    @Resource
    private lateinit var storyService: StoryService

    @GetMapping("/feign/storyRecommend")
    fun storyRecommend(userId: Long, tags: String, recommendStrategy: RecommendStrategy): StoryRecommendBO? {
        return storyService.storyRecommend(userId, tags.split(","), recommendStrategy)
    }

    @PostMapping("/feign/user/notify")
    fun userNotify(userId: Long, username: String?, jobId: Long, operator: String?): Boolean {
        return storyService.userNotify(userId, username, jobId, operator)
    }

    @PostMapping("/feign/delete/followRelation/{userId}")
    fun deleteFollowRelation(@PathVariable userId: Long) {
        StaticLog.info("删除用户的关注和粉丝数据：{}", userId)
        authorService.deleteAuthor(userId)
    }
}