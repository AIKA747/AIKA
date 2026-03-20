package com.parsec.aika.user.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.utils.FirebaseUtils
import com.parsec.aika.common.utils.PageUtil
import com.parsec.aika.user.mapper.AppGroupMapper
import com.parsec.aika.user.mapper.FirebaseUserTokenMapper
import com.parsec.aika.user.mapper.PushListMapper
import com.parsec.aika.user.mapper.UserGroupRelMapper
import com.parsec.aika.user.model.entity.FirebaseUserToken
import com.parsec.aika.user.model.entity.PushList
import com.parsec.aika.user.model.vo.req.GetPushListsReq
import com.parsec.aika.user.model.vo.req.PostPushListReq
import com.parsec.aika.user.model.vo.resp.GetPushListIdResp
import com.parsec.aika.user.model.vo.resp.GetPushListsResp
import com.parsec.aika.user.service.PushListService
import com.parsec.aika.user.service.UserOnlineService
import com.parsec.trantor.common.response.PageResult
import org.springframework.beans.BeanUtils
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.concurrent.Executors
import javax.annotation.PreDestroy
import javax.annotation.Resource


@Service
class PushListServiceImpl : PushListService {

    @Resource
    private lateinit var pushListMapper: PushListMapper

    @Resource
    private lateinit var appGroupMapper: AppGroupMapper

    @Resource
    private lateinit var firebaseUserTokenMapper: FirebaseUserTokenMapper

    @Resource
    private lateinit var userGroupRelMapper: UserGroupRelMapper

    @Resource
    private lateinit var userOnlineService: UserOnlineService

    private final val executorService = Executors.newSingleThreadExecutor()

    @PreDestroy
    fun destroy() {
        executorService.shutdown()
    }

    /**
     * 详情
     */
    override fun getPushListId(id: Long): GetPushListIdResp {
        val pushList = pushListMapper.selectById(id)
        Assert.notNull(pushList, "推送记录不存在")
        val resp = GetPushListIdResp()
        BeanUtils.copyProperties(pushList, resp)
        return resp
    }

    /**
     * 分页查询
     */
    override fun getPushLists(req: GetPushListsReq): PageResult<GetPushListsResp> {
        val page = Page<GetPushListsResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<GetPushListsResp>().page(pushListMapper.getPushLists(page, req))
    }

    /**
     * 新增推送
     */
    override fun postPushList(req: PostPushListReq, loginUserInfo: LoginUserInfo) {
        executorService.execute {
            val pushTo: String?
            val tokenList = if (req.pushTo == "all") {
                pushTo = "user::all"
                firebaseUserTokenMapper.selectList(
                    KtQueryWrapper(FirebaseUserToken::class.java)
                ).map { it.token!! }
            } else {
                // 获取推送对象
                val pushGroups = req.pushTo!!.split(",").map { it.toLong() }
                Assert.notEmpty(pushGroups, "No groups to push")
                val groupList = appGroupMapper.selectBatchIds(pushGroups)
                Assert.notEmpty(groupList, "No groups to push")
                // 获取组别中的user并去重
                val userIdList = userGroupRelMapper.selectDistinctUserIdListByGroupIdList(groupList.map { it.id })
                if (userIdList.isEmpty()) {
                    return@execute
                }
                pushTo = "group::${req.pushTo}"
                // 根据user获取其firebase-token
                firebaseUserTokenMapper.selectList(
                    KtQueryWrapper(FirebaseUserToken::class.java).`in`(
                        FirebaseUserToken::userId, userIdList
                    )
                ).map { it.token!! }
            }
            val pushList = PushList().apply {
                this.title = req.title
                this.content = req.content
                this.pushTo = pushTo
                this.soundAlert = req.soundAlert
                this.operator = loginUserInfo.username
                this.pushTime = LocalDateTime.now()
                this.deleted = false
                this.received = 0
                this.pushTotal = 0
                this.createdAt = LocalDateTime.now()
                this.updatedAt = LocalDateTime.now()
                this.jobId = req.jobId
            }
            // 推送
            if (tokenList.isNotEmpty()) {
                pushList.received = FirebaseUtils.sendMsgToTokens(
                    tokenList, req.title!!, req.content!!, if (req.soundAlert!!) "default" else ""
                )
                pushList.pushTotal = tokenList.size
            }
            pushListMapper.insert(pushList)
        }
    }

    override fun pushUserNotify(userId: Long?, username: String?, title: String?, content: String?, jobId: Long?) {
        executorService.execute {
            val tokenList = firebaseUserTokenMapper.selectList(
                KtQueryWrapper(FirebaseUserToken::class.java).eq(
                    FirebaseUserToken::userId, userId
                )
            ).map { it.token!! }
            if (tokenList.isEmpty()) {
                StaticLog.warn("未查询到用户[{}]绑定firebase token，不推送消息", userId)
                return@execute
            }
            val pushList = PushList().apply {
                this.title = title
                this.content = content
                this.pushTo = "user::$userId"
                this.soundAlert = false
                this.operator = username
                this.pushTime = LocalDateTime.now()
                this.deleted = false
                this.received = 0
                this.pushTotal = 0
                this.createdAt = LocalDateTime.now()
                this.updatedAt = LocalDateTime.now()
                this.jobId = jobId
            }
            // 推送
            if (tokenList.isNotEmpty()) {
                pushList.received = FirebaseUtils.sendMsgToTokens(
                    tokenList, pushList.title!!, pushList.content!!, if (pushList.soundAlert!!) "default" else ""
                )
                pushList.pushTotal = tokenList.size
            }
            pushListMapper.insert(pushList)
        }
    }

    override fun pushChatroomNotify(
        userIds: List<Long>, title: String?, content: String?, data: Map<String, String?>?
    ) {
        executorService.execute {
            val tokenList = firebaseUserTokenMapper.selectList(
                KtQueryWrapper(FirebaseUserToken::class.java).`in`(FirebaseUserToken::userId, userIds)
            )
                // 过滤掉在线用户
                .filter {
                    !userOnlineService.online(it.userId!!)
                }.map { it.token!! }.distinct()
            if (tokenList.isEmpty()) {
                StaticLog.warn("未查询到用户[{}]绑定firebase token，不推送消息", JSONUtil.toJsonStr(userIds))
                return@execute
            }
            // 推送
            FirebaseUtils.sendMsgToTokens(tokenList, title!!, content!!, "default", data)
        }
    }


}