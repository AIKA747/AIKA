package com.parsec.aika.user.endpoint

import cn.hutool.core.date.LocalDateTimeUtil
import cn.hutool.core.lang.Assert
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.dto.CheckUserChatDTO
import com.parsec.aika.user.remote.BotFeignClient
import com.parsec.aika.user.remote.ContentFeignClient
import com.parsec.aika.user.remote.OrderFeignClient
import com.parsec.aika.user.service.UserChatNumService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import java.util.*
import javax.annotation.Resource

@RestController
class UserChatInfoController {

    @Resource
    private lateinit var orderFeignClient: OrderFeignClient

    @Resource
    private lateinit var botFeignClient: BotFeignClient

    @Resource
    private lateinit var contentFeignClient: ContentFeignClient

    @Resource
    private lateinit var userChatNumService: UserChatNumService


    @GetMapping("/fegin/check/chat/info")
    fun checkUserChatInfo(userId: Long, botId: Long?, storyId: Long?, country: String?): BaseResult<CheckUserChatDTO> {
        val result1 = orderFeignClient.getFeignUserSubscriptionExpiredTime(userId, country)
        Assert.state(result1.isSuccess, result1.msg)
        val userChatDTO = CheckUserChatDTO().apply {
            expiredDate = result1.data
        }
        //若不是订阅者
        if (Objects.isNull(result1.data) || result1.data!!.isBefore(LocalDateTime.now())) {
            val now = LocalDateTime.now()
            val minTime = LocalDateTimeUtil.formatNormal(LocalDateTimeUtil.beginOfDay(now))
            val maxTime = LocalDateTimeUtil.formatNormal(LocalDateTimeUtil.endOfDay(now))
            StaticLog.info("查询用户{}在{}至{}的聊天数据", userId, minTime, maxTime)

            val result2 = botFeignClient.chatNum(userId, minTime, maxTime, botId)
            Assert.state(result2.isSuccess, result2.msg)
            val result3 = contentFeignClient.chatNum(userId, minTime, maxTime, storyId)
            Assert.state(result3.isSuccess, result3.msg)
            userChatDTO.botChatNum = result2.data
            userChatDTO.storyChatNum = result3.data
            userChatDTO.totalChatNum = result2.data + result3.data
            userChatDTO.enableChatNum = userChatNumService.getUserEnableChatNum(userId)
        }

        return BaseResult.success(userChatDTO)
    }

}