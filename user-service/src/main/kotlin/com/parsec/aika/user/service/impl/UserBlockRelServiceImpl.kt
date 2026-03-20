package com.parsec.aika.user.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.utils.PageUtil
import com.parsec.aika.user.mapper.UserBlockRelMapper
import com.parsec.aika.user.model.em.FollowMethod
import com.parsec.aika.user.model.entity.UserBlockRel
import com.parsec.aika.user.model.vo.req.AppFollowOrCancelReq
import com.parsec.aika.user.model.vo.req.ListBlockedUserReq
import com.parsec.aika.user.model.vo.resp.ListBlockedUserResp
import com.parsec.aika.user.service.FollowerService
import com.parsec.aika.user.service.UserBlockRelService
import com.parsec.trantor.common.response.PageResult
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource

@RefreshScope
@Service
class UserBlockRelServiceImpl : UserBlockRelService {

    @Resource
    lateinit var userBlockRelMapper: UserBlockRelMapper

    @Resource
    private lateinit var followerService: FollowerService


    /**
     * 获取指定用户被屏蔽用户列表
     */
    override fun listBlockedUser(req: ListBlockedUserReq): PageResult<ListBlockedUserResp> {
        val page = Page<ListBlockedUserResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<ListBlockedUserResp>().page(userBlockRelMapper.listBlockedUser(page, req.userId!!))
    }

    /**
     * 获取指定用户被屏蔽用户ID集合
     */
    override fun getBlockedUserIdList(userId: Long): List<Long> {
        return userBlockRelMapper.selectList(KtQueryWrapper(UserBlockRel::class.java).eq(UserBlockRel::userId, userId))
            .map { it.blockedUserId!! }
    }

    /**
     * 屏蔽用户
     */
    override fun block(userId: Long, blockedUserId: Long) {
        // 不能屏蔽自己
        if (userId == blockedUserId) throw RuntimeException("You can't block yourself")
        val blocked = userBlockRelMapper.selectCount(
            KtQueryWrapper(UserBlockRel::class.java).eq(UserBlockRel::userId, userId)
                .eq(UserBlockRel::blockedUserId, blockedUserId)
        ) > 0
        if (!blocked) {
            userBlockRelMapper.insert(UserBlockRel().apply {
                this.userId = userId
                this.blockedUserId = blockedUserId
                this.blockAt = LocalDateTime.now()
            })
            //移除粉丝关系
            followerService.appFollowOrCancel(AppFollowOrCancelReq().apply {
                this.method = FollowMethod.CANCEL
                this.userId = userId
                this.followingId = blockedUserId
            })
            //移除粉丝关系
            followerService.appFollowOrCancel(AppFollowOrCancelReq().apply {
                this.method = FollowMethod.CANCEL
                this.userId = blockedUserId
                this.followingId = userId
            })
        }
    }

    /**
     * 解除屏蔽
     */
    override fun unBlock(userId: Long, blockedUserId: Long) {
        userBlockRelMapper.delete(
            KtQueryWrapper(UserBlockRel::class.java).eq(UserBlockRel::userId, userId)
                .eq(UserBlockRel::blockedUserId, blockedUserId)
        )
    }

}