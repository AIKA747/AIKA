package com.parsec.aika.bot.consumer

import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.config.AuthorSyncMqConst
import com.parsec.aika.bot.service.ChatroomMemberService
import com.parsec.aika.bot.service.UserService
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.em.AuthorType
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component
import javax.annotation.Resource

@Component
class GroupMemeberSyncConsumer {

    @Resource
    private lateinit var chatroomMemberService: ChatroomMemberService

    @Resource
    private lateinit var userService: UserService

    @RabbitHandler
    @RabbitListener(queues = [AuthorSyncMqConst.GROUP_MEMBER_SYNC_USER_QUEUE])
    fun groupMemberSync(msg: String) {
        try {
            StaticLog.info("${AuthorSyncMqConst.GROUP_MEMBER_SYNC_USER_QUEUE},收到队列消息：$msg")
            val authorSyncBO = JSONUtil.toBean(JSONObject(msg), AuthorSyncBO::class.java)
            StaticLog.info("收到用户信息更新消息：{}", JSONUtil.toJsonStr(authorSyncBO))
            val b = chatroomMemberService.updateGroupMemberInfo(authorSyncBO)
            StaticLog.info("同步群成员信息结果：{}", b)
            if (authorSyncBO.type == AuthorType.USER) {
                userService.syncUserInfo(authorSyncBO)
                StaticLog.info("同步用户信息结果：{}", b)
            }
        } catch (e: Exception) {
            StaticLog.error("同步用户信息失败，错误信息：{}", e.message)
            e.printStackTrace()
        }
    }


}