package com.parsec.aika.content.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.parsec.aika.common.mapper.FollowRelationMapper
import com.parsec.aika.common.model.bo.FollowRelationBO
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.BotImage
import com.parsec.aika.common.model.entity.FollowRelation
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.BotImageUpdateReq
import com.parsec.aika.content.remote.BotFeignClient
import com.parsec.aika.content.service.FollowRelationService
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.util.Assert
import jakarta.annotation.Resource

/**
 * @author Zhao YinPing
 * @version 1.0
 * @date 2024/12/24.
 */
@Service
class FollowRelationServiceImpl : FollowRelationService {

    @Resource
    private lateinit var followRelationMapper: FollowRelationMapper

    @Resource
    private lateinit var botFeignClient: BotFeignClient

    override fun updateBotImage(botId: Long, botImage: BotImage, user: LoginUserInfo): Int {
        Assert.isTrue(botImage.cover != null && botImage.avatar != null, "cover and avatar not null")
        val followBot = followRelationMapper.selectOne(
            KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::type, AuthorType.BOT)
                .eq(FollowRelation::deleted, false).eq(FollowRelation::creator, user.userId)
                .eq(FollowRelation::followingId, botId)
        ) ?: throw BusinessException("You haven't follow this robot yet")
        followBot.botImage = botImage
        //同步更新信息到bot库
        val baseResult = botFeignClient.updateBotImage(BotImageUpdateReq().apply {
            this.botId = followBot.followingId
            this.userId = user.userId
            this.botImage = botImage
        })
        Assert.state(baseResult.isSuccess, baseResult.msg)

        return followRelationMapper.updateById(followBot)
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun followRelation(relationBO: FollowRelationBO) {
        val count = followRelationMapper.selectCount(
            KtUpdateWrapper(FollowRelation::class.java).eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId).eq(FollowRelation::type, relationBO.type)
        )
        if (count == 0L) {
            followRelationMapper.insert(FollowRelation().apply {
                this.creator = relationBO.creator
                this.followingId = relationBO.followingId
                this.type = relationBO.type
                this.botImage = relationBO.botImage
                this.agreed = true
            })
        }
    }

    override fun unfollowRelation(relationBO: FollowRelationBO) {
        followRelationMapper.delete(
            KtUpdateWrapper(FollowRelation::class.java)
                .eq(FollowRelation::creator, relationBO.creator)
                .eq(FollowRelation::followingId, relationBO.followingId)
                .eq(FollowRelation::type, relationBO.type)
        )
    }
}
