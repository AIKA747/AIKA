package com.parsec.aika.content.controller.manage

import com.parsec.aika.common.model.entity.Gift
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.service.GiftService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import jakarta.annotation.Resource

@RestController
class ManageGiftController {

    @Resource
    private lateinit var giftService: GiftService

    /**
     * 礼物列表
     */
    @GetMapping("/manage/gift")
    fun getGiftList(queryVo: com.parsec.aika.common.model.vo.req.ManageGiftQueryVo, user: LoginUserInfo): BaseResult<PageResult<Gift>> {
        return BaseResult.success(giftService.manageGiftList(queryVo, user))
    }

    /**
     * 礼物详情
     */
    @GetMapping("/manage/gift/{id}")
    fun getGiftDetail(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Gift> {
        return BaseResult.success(giftService.manageGiftDetail(id))
    }

    /**
     * 新建礼物
     */
    @PostMapping("/manage/gift")
    fun createGift(@Validated @RequestBody vo: com.parsec.aika.common.model.vo.req.ManageGiftCreateVo, user: LoginUserInfo): BaseResult<Long> {
        return BaseResult.success(giftService.manageGiftCreate(vo, user))
    }

    /**
     * 修改礼物
     */
    @PutMapping("/manage/gift")
    fun updateGift(@Validated @RequestBody vo: com.parsec.aika.common.model.vo.req.ManageGiftUpdateVo, user: LoginUserInfo): BaseResult<Gift> {
        return BaseResult.success(giftService.manageGiftUpdate(vo))
    }

    /**
     * 删除礼物
     */
    @DeleteMapping("/manage/gift/{id}")
    fun deleteGift(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Void> {
        giftService.manageGiftDelete(id)
        return BaseResult.success()
    }


}
