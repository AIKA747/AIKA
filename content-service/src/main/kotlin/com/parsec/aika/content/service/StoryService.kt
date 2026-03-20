package com.parsec.aika.content.service

import com.parsec.aika.common.model.bo.StoryRecommendBO
import com.parsec.aika.common.model.dto.ChapterProcess
import com.parsec.aika.common.model.dto.MsgDTO
import com.parsec.aika.common.model.em.GameStatus
import com.parsec.aika.common.model.em.RecommendStrategy
import com.parsec.aika.common.model.entity.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.ManageStoryQueryVo
import com.parsec.aika.common.model.vo.req.ManageStoryUpdateStatusVo
import com.parsec.aika.common.model.vo.req.PostAppStoryRecorderReq
import com.parsec.aika.common.model.vo.resp.GetAppStoryResp
import com.parsec.aika.content.model.vo.req.GetAppStoryReq
import com.parsec.aika.content.model.vo.req.ManageStoryCreateVo
import com.parsec.aika.content.model.vo.req.ManageStoryUpdateVo
import com.parsec.trantor.common.response.PageResult

/**
 * @author husu
 * @version 1.0
 * @date 2024/1/26.
 */
interface StoryService {

    /**
     * 接收用户的消息，经过ChatGPT处理以后，生成回复用户的消息，并完成故事的处理
     */
    fun replyToUser(userMessage: StoryChatLog, storyRecorder: StoryRecorder, locale: String? = "en"): MsgDTO

    /**
     * 根据当前的章节，生成提示词
     */
    fun generatePrompt(storyRecorder: StoryRecorder): String

    /**
     * 更新得分与游戏记录
     */
    fun updateScoreAndRecorder(
        storyRecorderId: Long, friendDegree: Int, storyDegree: Int, message: String, username: String?
    ): Pair<GameStatus, ChapterProcess>

    /**
     * 接收用户的礼物
     */
    fun receiveGift(
        storyRecorderId: Long, giftId: Long, username: String?
    ): Pair<Gift, Pair<GameStatus, ChapterProcess>>

    /**
     * 进入下一章节
     */
    fun changeChapter(
        storyRecorder: StoryRecorder, storyChapter: StoryChapter?, forward: Forward, username: String?
    ): Pair<GameStatus, ChapterProcess>

    /**
     * 更新用户通关故事获奖总分
     */
    fun updateUserRewards(userId: Long)

    enum class Forward {
        NEXT, PREVIOUS
    }


    // 故事列表
    fun getAppStory(req: GetAppStoryReq, loginUserInfo: LoginUserInfo): PageResult<GetAppStoryResp>

    // 故事详情
    fun getAppStoryId(id: Long, loginUserInfo: LoginUserInfo): com.parsec.aika.common.model.vo.resp.GetAppStoryIdResp

    // 查看过关/失败的信息
    fun getAppStoryIdChapter(
        id: Long,
        loginUserInfo: LoginUserInfo
    ): com.parsec.aika.common.model.vo.resp.GetAppStoryIdChapterResp

    // 开始一个新的游戏
    fun postAppStoryRecorder(
        req: PostAppStoryRecorderReq,
        loginUserInfo: LoginUserInfo
    ): com.parsec.aika.common.model.vo.resp.PostAppStoryRecorderResp

    // 获取故事和存档
    fun getStoryAndRecorder(storyId: Long, userId: Long, preview: Boolean): Pair<Story, StoryRecorder?>

    /**
     * 故事管理列表
     */
    fun manageStoryList(req: ManageStoryQueryVo): PageResult<com.parsec.aika.common.model.vo.resp.ManageStoryListVo>

    /**
     * 创建故事
     */
    fun manageStoryCreate(vo: ManageStoryCreateVo, user: LoginUserInfo): Long

    /**
     * 修改故事
     */
    fun manageStoryUpdate(vo: ManageStoryUpdateVo, user: LoginUserInfo): Story

    /**
     * 删除故事
     */
    fun manageStoryDelete(id: Long, user: LoginUserInfo)

    /**
     * 设置故事状态
     */
    fun manageStoryUpdateStatus(vo: ManageStoryUpdateStatusVo, user: LoginUserInfo)

    /**
     * 故事详情
     */
    fun manageStoryDetail(id: Long): Story

    fun storyRecommend(userId: Long, tags: List<String>, recommendStrategy: RecommendStrategy): StoryRecommendBO?
    fun storyPreview(storyId: Long?, chapterId: Long?, userId: Long?): StoryRecorder?
    fun calcStoryProcess(storyRecorder: StoryRecorder): Double?
    fun userNotify(userId: Long, username: String?, jobId: Long, operator: String?): Boolean

    /**
     * 导出故事用户数量
     */
    fun storyUserCount(): ByteArray?
}
