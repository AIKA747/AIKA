package com.parsec.aika.content.service

import com.parsec.aika.common.model.entity.Gift
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

/**
 * @author husu
 * @version 1.0
 * @date 2024/1/26.
 */
interface GiftService {

    // 获取当前章节的礼物
    fun getAppGift(req: com.parsec.aika.common.model.vo.req.GetAppGiftReq, loginUserInfo: LoginUserInfo): PageResult<com.parsec.aika.common.model.vo.resp.GetAppGiftResp>

    /**
     * 礼物管理列表
     */
    fun manageGiftList(req: com.parsec.aika.common.model.vo.req.ManageGiftQueryVo, userInfo: LoginUserInfo): PageResult<Gift>

    /**
     * 礼物详情
     */
    fun manageGiftDetail(id: Long): Gift

    /**
     * 创建礼物
     */
    fun manageGiftCreate(vo: com.parsec.aika.common.model.vo.req.ManageGiftCreateVo, user: LoginUserInfo): Long?

    /**
     * 修改礼物
     */
    fun manageGiftUpdate(vo: com.parsec.aika.common.model.vo.req.ManageGiftUpdateVo): Gift

    /**
     * 删除礼物
     */
    fun manageGiftDelete(id: Long)
}
