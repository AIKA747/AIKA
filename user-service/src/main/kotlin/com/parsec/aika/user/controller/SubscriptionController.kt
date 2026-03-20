package com.parsec.aika.user.controller

import cn.hutool.core.collection.CollUtil
import com.parsec.aika.common.model.dto.SubscriptionList
import com.parsec.aika.common.model.dto.UserSubscription
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.ManageSubscriptionsQueryReq
import com.parsec.aika.user.remote.OrderFeignClient
import com.parsec.aika.user.service.UserService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class SubscriptionController {

    @Resource
    private lateinit var orderFeignClient: OrderFeignClient

    @Resource
    private lateinit var userService: UserService

    @GetMapping("/app/subscription")
    fun getUserSubscription(user: LoginUserInfo): BaseResult<List<UserSubscription?>?> {
        return orderFeignClient.userSubscription(user.userId!!)
    }

    // 获取用户订阅列表
    @GetMapping("/manage/subscription")
    fun getSubscriptionList(req: ManageSubscriptionsQueryReq): BaseResult<PageResult<SubscriptionList>> {
        if (null != req.groupId) {
            req.userIds = userService.queryUserIdsByGroupId(req.groupId)
        }
        if (null != req.groupId && CollUtil.isEmpty(req.userIds)) {
            return BaseResult.success(PageResult<SubscriptionList>().apply {
                this.pageNum = (req.pageNo ?: 1).toLong()
                this.pageSize = (req.pageSize ?: 10).toLong()
                this.pages = 0
                this.total = 0
                this.list = emptyList()
            })
        }
        return orderFeignClient.getSubscriptionList(req)
    }


}