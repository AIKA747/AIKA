package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.AppChatQueryVo
import com.parsec.aika.bot.model.vo.req.AppChatRecordQueryVo
import com.parsec.aika.bot.model.vo.resp.AppChatListVo
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.bot.service.BotMessageService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppChatController {

    @Resource
    private lateinit var botMessageService: BotMessageService

    /**
     * 会话列表
     */
    @GetMapping("/app/chats")
    fun getChatList(queryVo: AppChatQueryVo, user: LoginUserInfo): BaseResult<PageResult<AppChatListVo>> {
        return BaseResult.success(botMessageService.appChatList(queryVo, user))
    }

    /**
     * 删除会话
     * 传入的是机器人id。根据botId和userId删除会话
     */
    @DeleteMapping("/app/chat/bot/{id}")
    fun deleteAppChatBotId(@PathVariable id: Long, user: LoginUserInfo): BaseResult<Void> {
        botMessageService.deleteAppChatBotId(id, user)
        return BaseResult.success()
    }

    /**
     * 会话记录
     * 按照消息记录的时间，越新越靠前 进行排序
     */
    @GetMapping("/app/chat/records")
    fun getChatRecords(
        queryVo: AppChatRecordQueryVo, user: LoginUserInfo
    ): BaseResult<PageResult<AppChatRecordListVo>> {
        // 查询当前登录用户与传入的机器人之间的聊天记录
        return BaseResult.success(botMessageService.appChatRecords(queryVo, user))
    }

    @DeleteMapping("/app/chat/msg/{msgId}")
    fun deleteChatMsg(@PathVariable("msgId") msgId: Long, user: LoginUserInfo): BaseResult<List<String>> {
        return BaseResult.success(botMessageService.deleteChatMsg(msgId, user))
    }


}