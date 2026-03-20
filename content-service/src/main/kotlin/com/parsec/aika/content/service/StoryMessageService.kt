package com.parsec.aika.content.service

import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.entity.StoryRecorder
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult
import java.time.LocalDateTime

interface StoryMessageService {

    fun handlerChatMsg(user: String, baseMessageDTO: BaseMessageDTO)

    fun handlerReadMsg(user: String, baseMessageDTO: BaseMessageDTO)
    fun queryChatLogs(req: com.parsec.aika.common.model.vo.req.AppChatLogReq, loginUserInfo: LoginUserInfo): PageResult<com.parsec.aika.common.model.vo.resp.AppChatRecordListVo>
    fun handlerRespMsg(user: String, baseMessageDTO: BaseMessageDTO)
    fun chatNum(userId: Long, minTime: LocalDateTime?, maxTime: LocalDateTime?, storyId: Long?): Long
    fun sendStoryMessageToUser(
        storyRecorder: StoryRecorder,
        language: String?,
        message: String?,
        username: String?,
        jobId: Long?,
        operator: String?
    )

    fun getUserChatMinutes(chapterId: Long, userId: Long): Int
}
