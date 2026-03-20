package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.GetAppRateReq
import com.parsec.aika.bot.model.vo.req.PostAppRateReq
import com.parsec.aika.bot.model.vo.resp.GetAppRateResp
import com.parsec.aika.bot.service.BotRateService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.BotRateMapper
import com.parsec.aika.common.mapper.MessageRecordMapper
import com.parsec.aika.common.model.entity.BotRate
import com.parsec.aika.common.model.entity.MessageRecord
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.PreDestroy
import javax.annotation.Resource

@Service
class BotRateServiceImpl : BotRateService {
    @Resource
    private lateinit var botRateMapper: BotRateMapper

    @Resource
    private lateinit var botMapper: BotMapper

    @Resource
    private lateinit var messageRecordMapper: MessageRecordMapper

    private val executorService = ThreadUtil.newExecutor(5, 10)

    @PreDestroy
    fun destroy() {
        executorService.shutdown()
    }

    override fun getAppRate(req: GetAppRateReq): PageResult<GetAppRateResp> {
        PageHelper.startPage<GetAppRateResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetAppRateResp>().page(botRateMapper.getAppRate(req))
    }

    override fun postAppRate(req: PostAppRateReq, loginUserInfo: LoginUserInfo) {
        botMapper.selectById(req.botId) ?: throw BusinessException("bot information does not exist")
        Assert.state(req.rating!! in 0.0..5.0, "Please enter a rating between 0 and 5")
        Assert.state(
            this.canCommented(req.botId!!, loginUserInfo.userId!!), "Please subscribe to this robot first"
        )
        val botRate = BotRate()
        botRate.apply {
            this.botId = req.botId
            this.userId = loginUserInfo.userId
            this.username = loginUserInfo.username ?: ""
            this.content = req.content
            this.rating = req.rating
            this.creator = loginUserInfo.userId.toString()
            this.creatorName = loginUserInfo.username ?: ""
            this.commentAt = LocalDateTime.now()
        }
        botRateMapper.insert(botRate)
        // 更新机器人评分
        avgRate(req.botId!!)
    }

    override fun canCommented(botId: Long, userId: Long): Boolean {
        return messageRecordMapper.selectCount(
            KtQueryWrapper(MessageRecord::class.java)
                .eq(MessageRecord::botId, botId)
                .eq(MessageRecord::userId, userId)
        ) > 0
    }

    fun avgRate(id: Long) {
        executorService.execute {
            botMapper.selectById(id)?.let {
                it.rating = botRateMapper.avgRateByBotId(id)
                botMapper.updateById(it)
            }
        }
    }

}