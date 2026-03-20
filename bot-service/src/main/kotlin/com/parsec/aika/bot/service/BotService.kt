package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.model.vo.resp.*
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.entity.Bot
import com.parsec.aika.common.model.entity.MessageRecord
import com.parsec.aika.common.model.entity.RoleProfession
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.PageResult

interface BotService {

    /**
     * 查询机器人详情
     * ①非机器人作者访问此接口，则直接返回Bot的相关信息。如果机器人已下架（botStatus=offline），则返回此机器人已下架的提示即可。
     * ②机器人作者访问此接口，先取Bot_temp表里publishTime为空的记录，存在就返回之，如果不存在，则取Bot的记录返回之。
     */
    fun appBotDetail(botId: Long, botStatus: BotStatusEnum?, loginUser: LoginUserInfo): AppBotDetailVO

    /**
     * 新建机器人
     */
    fun postAppBot(req: PostAppBotReq, loginUser: LoginUserInfo): BotDetailVO

    /**
     * 发布机器人
     */
    fun putAppBotIdRelease(id: Long, loginUser: LoginUserInfo)

    /**
     * 机器人列表
     */
    fun getAppMyBots(req: GetAppMyBotsReq): PageResult<GetAppMyBotsResp>

    /**
     * 推荐机器人列表
     */
    fun getAppRecommendBots(req: GetAppRecommendBotsReq): PageResult<GetAppRecommendBotsResp>

    /**
     * 机器人栏目列表
     */
    fun getAppBotCategory(req: GetAppBotCategoryReq): PageResult<GetAppBotCategoryResp>

    /**
     * 编辑机器人
     */
    fun putAppBotId(id: Long, req: PutAppBotIdReq, loginUser: LoginUserInfo): BotDetailVO

    fun putManageBotId(id: Long, req: PutAppBotIdReq, loginUser: LoginUserInfo)

    //向用户主动推送消息
    fun sayHello(botId: Long, userId: Long, username: String?): MessageRecord?

    /**
     * 删除机器人
     */
    fun appDeleteBot(botId: Long, loginUser: LoginUserInfo)

    /**
     * 机器儿检索
     */
    fun getAppExploreBots(req: GetAppExploreBotsReq, loginUser: LoginUserInfo): PageResult<GetAppExploreBotsResp>

    /**
     * 管理端————机器人推荐详情
     */
    fun manageBotRecommendDetail(botId: Long, loginUser: LoginUserInfo): ManageBotRecommendDetail

    /**
     * 管理端————机器人详情
     */
    fun manageBotDetail(botId: Long, loginUser: LoginUserInfo): ManageBotDetailVO

    /**
     * 查询制定用户的机器人列表
     */
    fun getAppOwnerBots(req: GetAppOwnerBotsReq): PageResult<GetAppOwnerBotsResp>

    /**
     * 查询推荐机器人
     */
    fun getManageBotRecommend(
        req: GetManageBotRecommendReq, loginUser: LoginUserInfo
    ): PageResult<GetManageBotRecommendResp>

    /**
     * 管理端————取消推荐机器人
     */
    fun manageCancelRecommend(botId: Long, loginUser: LoginUserInfo)

    /**
     * 设置排序
     */
    fun putManageBotRecommendSort(req: PutManageBotRecommendSortReq, user: LoginUserInfo)

    /**
     * 推荐机器人
     */
    fun putManageBotRecommend(req: PutManageBotRecommendReq, user: LoginUserInfo)

    /**
     * 上线/下线
     */
    fun putManageBotStatus(req: PutManageBotStatusReq, user: LoginUserInfo)


    /**
     * 新增
     */
    fun postManageBot(req: PostManageBotReq, loginUser: LoginUserInfo): Long

    /**
     * 机器人列表
     */
    fun getManageBots(req: GetManageBotsReq, loginUser: LoginUserInfo): PageResult<GetManageBotsResp>

    /**
     * 管理端——栏目列表——查询机器人
     */
    fun manageCategorySearchBot(
        queryVo: ManageCategoryBotQueryVo, user: LoginUserInfo
    ): PageResult<ManageCategoryBotListVo>

    fun getBotPofessions(pageVo: PageVo): PageResult<RoleProfession>?

    /**
     * 生成机器prompt
     */
    fun generatePrompt(
        botId: Long, test: Boolean, username: String?
    ): Pair<Bot, String>

    fun updateBotChatNum(botId: Long?)
    fun deleteBot(id: Long): Int?
    fun manageCategorySelectBots(
        queryVo: ManageCategoryBotQueryVo, user: LoginUserInfo
    ): PageResult<ManageCategoryBotListVo>?

    fun countBotUpdateCate(categoryId: Long?, loginUser: LoginUserInfo)

    /**
     * 根据名称检查机器人是否存在
     * @param name 机器人名称
     * @return 如果存在返回true，否则返回false
     */
    fun existsByName(name: String): Boolean

    /**
     * 触发机器人发帖
     */
    fun createBotPost(botId: Long)

    /**
     * 同步机器人信息
     */
    fun syncBotList()

    /**
     * 机器人是否在线
     */
    fun onlineStatus(botId: Long): Boolean?

    /**
     * 回复群聊消息
     */
    fun replayAMsg(roomId: Int, botId: Long): String?

    /**
     * 导出机器人聊天统计
     */
    fun botConversationCount(): ByteArray?
}
