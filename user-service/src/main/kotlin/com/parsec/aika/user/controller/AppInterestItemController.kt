package com.parsec.aika.user.controller

import com.parsec.aika.common.aspect.TranslateResult
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.em.InterestItemType
import com.parsec.aika.user.model.entity.InterestItem
import com.parsec.aika.user.service.InterestItemService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppInterestItemController {

    @Resource
    private lateinit var interestItemService: InterestItemService

    /**
     * 获取兴趣列表
     */
    @TranslateResult
    @GetMapping("/app/interest-items")
    fun getInterestItemList(itemType: InterestItemType?, user: LoginUserInfo): BaseResult<List<InterestItem>> {
        return BaseResult.success(interestItemService.listByType(itemType))
    }

}
