package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.entity.InterestItem
import com.parsec.aika.user.model.vo.req.InterestItemCreateVo
import com.parsec.aika.user.model.vo.req.InterestItemQueryVo
import com.parsec.aika.user.model.vo.req.InterestItemUpdateVo
import com.parsec.aika.user.service.InterestItemService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageInterestItemController {

    @Resource
    private lateinit var interestItemService: InterestItemService

    /**
     * 兴趣管理列表
     */
    @GetMapping("/manage/interest-items")
    fun getItemList(queryVo: InterestItemQueryVo, user: LoginUserInfo): BaseResult<PageResult<InterestItem>> {
        return BaseResult.success(interestItemService.pageList(queryVo))
    }

    /**
     * 新增兴趣
     */
    @PostMapping("/manage/interest-item")
    fun createItem(@Validated @RequestBody vo: InterestItemCreateVo, user: LoginUserInfo): BaseResult<Int> {
        return BaseResult.success(interestItemService.create(vo, user))
    }

    /**
     * 修改兴趣
     */
    @PutMapping("/manage/interest-item")
    fun updateItem(@Validated @RequestBody vo: InterestItemUpdateVo, user: LoginUserInfo): BaseResult<InterestItem> {
        return BaseResult.success(interestItemService.update(vo, user))
    }

    /**
     * 删除兴趣
     */
    @DeleteMapping("/manage/interest-item/{id}")
    fun deleteItem(@PathVariable("id") id: Int, user: LoginUserInfo): BaseResult<Void> {
        interestItemService.delete(id, user)
        return BaseResult.success()
    }

}
