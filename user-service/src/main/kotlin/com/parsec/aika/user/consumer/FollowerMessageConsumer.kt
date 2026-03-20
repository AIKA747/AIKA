package com.parsec.aika.user.consumer

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.SyncRelationBO
import com.parsec.aika.common.model.em.ActionType
import com.parsec.aika.user.config.RabbitmqConst
import com.parsec.aika.user.config.SyncRelationMqConst
import com.parsec.aika.user.mapper.AppUserMapper
import com.parsec.aika.user.model.em.FollowMethod
import com.parsec.aika.user.model.vo.req.AppFollowOrCancelReq
import com.parsec.aika.user.service.FollowerService
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component
import javax.annotation.Resource

/**
 * 用户粉丝数量更新
 */
@Component
class FollowerMessageConsumer {

    @Resource
    private lateinit var appUserMapper: AppUserMapper

    @Resource
    private lateinit var followerService: FollowerService

    @RabbitHandler
    @RabbitListener(queues = [RabbitmqConst.USER_FANS_COUNT_QUEUE])
    fun userFansCountReceiver(msg: String) {
        try {
            val param = JSONUtil.parseObj(msg)
            val user = appUserMapper.selectById(param.getLong("userId"))
            if (param.containsKey("count")) {
                user.followerTotal = param.getInt("count")
                appUserMapper.updateById(user)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @RabbitListener(queues = [SyncRelationMqConst.USER_RELATION_QUEUE])
    fun followingMsgReceiver(msg: String) {
        StaticLog.info("收到user的关注消息:{}", msg)
        val syncRelationBO = JSONUtil.toBean(msg, SyncRelationBO::class.java)
        val req = AppFollowOrCancelReq().apply {
            this.userId = syncRelationBO.userId
            this.followingId = syncRelationBO.followingId
            this.method = if (syncRelationBO.actionType == ActionType.ADD) {
                FollowMethod.FOLLOW
            } else {
                FollowMethod.CANCEL
            }
        }
        //调用方法关注或取消关注
        followerService.appFollowOrCancel(req)
    }


}