package com.parsec.aika.user.service.impl

import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.bo.FollowRelationBO
import com.parsec.aika.common.model.bo.GorseFeedbackType
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.utils.PageUtil
import com.parsec.aika.user.config.FollowRelationMqConst
import com.parsec.aika.user.config.RabbitmqConst
import com.parsec.aika.user.gorse.GorseService
import com.parsec.aika.user.mapper.FollowerMapper
import com.parsec.aika.user.model.em.AppFriendFollowStatus
import com.parsec.aika.user.model.em.FollowMethod
import com.parsec.aika.user.model.entity.AppFriendInfo
import com.parsec.aika.user.model.entity.Follower
import com.parsec.aika.user.model.vo.req.*
import com.parsec.aika.user.model.vo.resp.UserAppFollowerResp
import com.parsec.aika.user.model.vo.resp.UserAppFollowingResp
import com.parsec.aika.user.service.FollowerService
import com.parsec.aika.user.service.UserService
import com.parsec.trantor.common.response.PageResult
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource

@Service
class FollowerServiceImpl : FollowerService {

    @Autowired
    private lateinit var gorseService: GorseService

    @Resource
    private lateinit var followerMapper: FollowerMapper

    @Resource
    private lateinit var userService: UserService

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    override fun appFollower(req: UserAppFollowerReq, userInfo: LoginUserInfo): PageResult<UserAppFollowerResp> {
        req.userId = userInfo.userId!!.toLong()
        val page = Page<UserAppFollowerResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<UserAppFollowerResp>().page(followerMapper.appFollower(page, req))
    }

    override fun appFollowing(req: UserAppFollowingReq, userInfo: LoginUserInfo): PageResult<UserAppFollowingResp> {
        req.userId = userInfo.userId!!.toLong()
        val page = Page<UserAppFollowingResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<UserAppFollowingResp>().page(followerMapper.appFollowing(page, req))
    }

    override fun appFollowerLastReadTime(req: UserAppFollowerLastReadTimeReq, userInfo: LoginUserInfo) {
        followerMapper.selectOne(
            KtQueryWrapper(Follower::class.java).eq(Follower::followingId, req.followingId)
                .eq(Follower::userId, userInfo.userId)
        )?.let {
            it.lastReadTime = LocalDateTime.now()
            followerMapper.updateById(it)
        }
    }

    override fun appFollowing(req: AppFollowingReq) {
        val follower = followerMapper.selectOne(
            KtQueryWrapper(Follower::class.java).eq(Follower::userId, req.userId)
                .eq(Follower::followingId, req.followingId)
        )
        // 防止重复关注
        if (follower == null) {
            followerMapper.insert(Follower().apply {
                this.userId = req.userId
                this.followingId = req.followingId
                this.deleted = false
            })
            // 关注成功后需要发送用户订阅消息到rabbitmq队列中，更新被关注用户的粉丝数量
            val jsonObject = JSONObject()
            jsonObject.putOpt("userId", req.followingId)
            jsonObject.putOpt("count", userService.queryFansCount(req.followingId!!))
            jsonObject.putOpt("updateAt", LocalDateTime.now())
            rabbitTemplate.convertAndSend(
                RabbitmqConst.USER_COUNT_DIRECT_EXCHANGE, RabbitmqConst.USER_FANS_COUNT_ROUTE_KEY, jsonObject
            )
        }
    }


    override fun appFollowOrCancel(req: AppFollowOrCancelReq) {
        val userId = req.userId
        val followingId = req.followingId
        val existingFollower = followerMapper.selectByUidAndFollowingId(userId!!, followingId!!)

        if (existingFollower == null) {
            // 如果记录不存在，则插入新的记录，设置 uf=1
            val follower = Follower().apply {
                this.userId = userId
                this.followingId = followingId
//                this.uf = if (req.method ==  FollowMethod.FOLLOW) 1 else 0;
                this.uf = req.method?.value ?: 0
                this.fu = 0
                this.createdAt = LocalDateTime.now()
                this.creator = "system"
                this.updatedAt = LocalDateTime.now()
                this.updater = "system"
                this.dataVersion = 1
                this.deleted = false
            }
            followerMapper.insert(follower)
        } else {
            // 如果记录存在，判断当前用户是 userId 还是 followingId
            if (existingFollower.userId == userId) {
                // 当前 userId 是 userId，操作 uf
                followerMapper.updateById(Follower().apply {
                    this.id = existingFollower.id
//                    this.uf = if (req.method ==  FollowMethod.FOLLOW) 1 else 0
                    this.uf = req.method?.value ?: 0
                    this.updatedAt = LocalDateTime.now()
                })
//                followerMapper.updateFollowStatus(userId, followingId, uf = if (req.method == "FOLLOW") 1 else 0, fu = existingFollower.fu, updatedAt = Date())
            } else if (existingFollower.followingId == userId) {
                // 当前 userId 是 followingId，操作 fu
                followerMapper.updateById(Follower().apply {
                    this.id = existingFollower.id
//                    this.fu = if (req.method ==  FollowMethod.FOLLOW) 1 else 0
                    this.fu = req.method?.value ?: 0
                    this.updatedAt = LocalDateTime.now()
                })
            }
        }
        //异步消息同步通知
        val relationBO = FollowRelationBO().apply {
            this.creator = req.userId
            this.followingId = req.followingId
        }
        rabbitTemplate.convertAndSend(
            FollowRelationMqConst.FOLLOW_RELATION_EXCHANGE,
            if (req.method == FollowMethod.FOLLOW) FollowRelationMqConst.FOLLOW_USER_RELATION_ROUTE_KEY else FollowRelationMqConst.UNFOLLOW_USER_RELATION_ROUTE_KEY,
            JSONUtil.toJsonStr(relationBO)
        )

        if (req.method == FollowMethod.FOLLOW) {
            // 添加关注成功后，同步用户信息到Gorse
            gorseService.saveFeedback(userId.toString(), followingId.toString(), "关注", GorseFeedbackType.star)
        } else {
            gorseService.deleteFeedback(userId.toString(), followingId.toString(), GorseFeedbackType.star)
        }
    }

    override fun appFollowFriends(req: AppFollowFriendsReq): PageResult<AppFriendInfo> {
        val pageNo = req.pageNo ?: 1
        val pageSize = req.pageSize ?: 10
        val page = Page<AppFriendInfo>(pageNo.toLong(), pageSize.toLong())
        val followStatus = try {
            AppFriendFollowStatus.valueOf(req.followStatus.orEmpty().uppercase())
        } catch (e: IllegalArgumentException) {
            return PageUtil<AppFriendInfo>().page(page)
        }

        if (req.userId == null) {
            return PageUtil<AppFriendInfo>().page(page)
        }

        if (StrUtil.isNotBlank(req.username) && StrUtil.startWith(req.username, "@")) {
            req.username = StrUtil.replaceFirst(req.username, "@", "")
        } else {
            req.nickname = req.username
            req.username = null
        }

        return when (followStatus) {
            AppFriendFollowStatus.FOLLOWED_BY -> {
                PageUtil<AppFriendInfo>().page(
                    followerMapper.appFollowerWhoFollowMe(
                        page, req.userId!!, req.username, req.nickname
                    )
                )
            }

            AppFriendFollowStatus.FOLLOWING -> {
                PageUtil<AppFriendInfo>().page(
                    followerMapper.appFollowerMyFollowing(
                        page, req.userId!!, req.username, req.nickname
                    )
                )
            }

            AppFriendFollowStatus.MUTUAL -> {
                PageUtil<AppFriendInfo>().page(
                    followerMapper.appFollowerFriendsMutual(
                        page, req.userId!!, req.username, req.nickname
                    )
                )
            }
        }
    }

    override fun getFollowingIdList(id: Long): List<String> {
        return followerMapper.getFollowingIdList(id)
    }


}
