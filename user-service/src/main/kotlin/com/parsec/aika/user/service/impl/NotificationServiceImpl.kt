package com.parsec.aika.user.service.impl

import cn.hutool.core.date.DateUtil
import cn.hutool.core.date.LocalDateTimeUtil
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.IdUtil
import cn.hutool.json.JSONArray
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import com.parsec.aika.common.model.bo.NotifyBO
import com.parsec.aika.common.model.bo.NotifyType
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.utils.PageUtil
import com.parsec.aika.user.domain.Notification
import com.parsec.aika.user.domain.NotifyReadUserId
import com.parsec.aika.user.mapper.NotificationMapper
import com.parsec.aika.user.model.em.Gender
import com.parsec.aika.user.model.vo.resp.AppNotifyResp
import com.parsec.aika.user.remote.BotFeignClient
import com.parsec.aika.user.service.NotificationService
import com.parsec.aika.user.service.PushListService
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.annotation.Resource

/**
 * @author 77923
 * @description 针对表【notification(用户通知表)】的数据库操作Service实现
 * @createDate 2025-01-24 18:44:26
 */
@Service
class NotificationServiceImpl : ServiceImpl<NotificationMapper, Notification>(), NotificationService {

    @Resource
    private lateinit var pushListService: PushListService

    @Resource
    private lateinit var botFeignClient: BotFeignClient

    private val excuteService = ThreadUtil.newSingleExecutor()

    override fun saveNotification(notifyBO: NotifyBO) {
        val notification = Notification().apply {
            this.type = notifyBO.type
            this.userIds = notifyBO.userIds
            this.authorId = notifyBO.authorId
            this.avatar = notifyBO.avatar
            this.nickname = notifyBO.nickname
            this.username = notifyBO.username
            this.gender = notifyBO.gender ?: Gender.HIDE
            this.cover = notifyBO.cover
            this.metadata = notifyBO.metadata
            this.createdAt = notifyBO.createdAt
        }
        //生成一下groupById，将需要合并在一起显示的消息groupById生成一样的
        if (notification.type == NotifyType.thumb || notification.type == NotifyType.comment) {
            //根据postId和日期合并为一条
            val dayId = LocalDateTimeUtil.format(LocalDateTime.now(), "yyyyMMdd")
            notification.groupById = "${notification.type}_${notification.metadata?.postId}_$dayId"
        } else {
            notification.groupById = "${notification.type}_${IdUtil.simpleUUID()}"
        }
        this.save(notification)

        //异步推送firebase消息
        excuteService.execute {
            val pair = when (notification.type) {
                NotifyType.thumb -> {
                    Pair("+1 Likes on your post", "@${notification.username}")
                }

                NotifyType.post -> {
                    Pair("New post by", "${notification.nickname} @${notification.username}")
                }

                NotifyType.at -> {
                    Pair("${notification.username}@you", notification.metadata?.content)
                }

                NotifyType.comment -> {
                    Pair("Received a new comment", notification.metadata?.content)
                }

                else -> null
            }
            if (null != pair) {
                StaticLog.info("=============开始推送发贴通知的firebase消息:{}=============", notifyBO.userIds?.size)
                val data = mutableMapOf<String, String?>()
                data["type"] = notification.type!!.name.uppercase(Locale.getDefault())
                data["id"] = notification.metadata!!.postId
                data["notificationId"] = notification.id.toString()
                data["authorId"] = notification.authorId.toString()
                data["avatar"] = notification.avatar
                val parseObj = JSONUtil.parseObj(notification.metadata)
                parseObj.entries.filter { null != it.value }.forEach {
                    data[it.key] = it.value.toString()
                }
                StaticLog.info(
                    "=============给用户[{}]推送通知的firebase消息:{} - {}   消息数据：{}=============",
                    JSONUtil.toJsonStr(notifyBO.userIds),
                    pair.first,
                    pair.second,
                    JSONUtil.toJsonStr(data)
                )
                //推送firebase消息
                pushListService.pushChatroomNotify(
                    notifyBO.userIds!!, pair.first, pair.second, data
                )
                StaticLog.info("=============完成推送发贴通知的firebase消息=============")
            }
        }
    }

    override fun notificationList(
        pageNo: Int, pageSize: Int, lastTime: String?, userId: String?
    ): PageResult<AppNotifyResp>? {
        //查询分页总数
        val total = this.baseMapper.selectNotifyCount(userId, lastTime)
        val notifyList = if (total > 0) {
            this.baseMapper.selectNotifyList(userId, lastTime, (pageNo - 1) * pageSize, pageSize)
        } else {
            emptyList()
        }
        notifyList.filter { it.type == NotifyType.thumb || it.type == NotifyType.comment }.forEach {
            var authors = it.authors!!.map(JSONUtil::parseObj).distinctBy { author ->
                author.getLong("authorId")
            }
            if (authors.size > 10) {
                //查询点赞消息对应的帖子信息
                authors = authors.subList(0, 10)
            }
            it.authors = JSONArray(authors)
        }
        return PageUtil<AppNotifyResp>().page(notifyList, pageNo, pageSize, total)
    }

    override fun readNotification(notificationIds: String, user: LoginUserInfo) {
        if (notificationIds == "ALL") {
            this.baseMapper.readAllNotification(user.userId)
            return
        }
        val notificationIdList = notificationIds.trim().split(",")
        for (notificationId in notificationIdList) {
            //更新通知为已读状态
            val notification = this.baseMapper.selectById(notificationId) ?: continue
            val readUserId = NotifyReadUserId().apply {
                this.userId = user.userId
                this.readAt = DateUtil.now()
            }
            if (notification.type == NotifyType.thumb) {
                //标记该用户所有该帖子的点赞消息为已读
                this.ktUpdate().eq(Notification::groupById, notification.groupById)
                    .set(Notification::readUserIds, JSONUtil.toJsonStr(listOf(readUserId))).update()
            } else {
                val readUserIds = (notification.readUserIds ?: ArrayList()).plus(readUserId)
                notification.readUserIds = readUserIds
                this.updateById(notification)
            }
        }
    }

    override fun unreadNotificationCount(userId: Long): Int {
        val unreadNotificationCount = this.baseMapper.unreadNotificationCount(userId.toString())
        return unreadNotificationCount + botFeignClient.getChatroomMemberNotifycationCount(userId)
    }
}




