package com.parsec.aika.content.service.impl

import cn.hutool.core.lang.Assert
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.GiftMapper
import com.parsec.aika.common.mapper.StoryChapterMapper
import com.parsec.aika.common.mapper.StoryMapper
import com.parsec.aika.common.model.entity.Gift
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.service.GiftService
import com.parsec.aika.content.service.StoryService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.BeanUtils
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import jakarta.annotation.Resource

@Service
class GiftServiceImpl : GiftService {

    @Resource
    private lateinit var storyService: StoryService

    @Resource
    private lateinit var giftMapper: GiftMapper

    @Resource
    private lateinit var storyMapper: StoryMapper

    @Resource
    private lateinit var chapterMapper: StoryChapterMapper

    override fun getAppGift(
        req: com.parsec.aika.common.model.vo.req.GetAppGiftReq,
        loginUserInfo: LoginUserInfo
    ): PageResult<com.parsec.aika.common.model.vo.resp.GetAppGiftResp> {
        // 存档获取当前章节
        val storyAndRecorder = storyService.getStoryAndRecorder(req.storyId!!, loginUserInfo.userId!!, false)
        val storyRecorder = storyAndRecorder.second ?: throw BusinessException("Please start a new game")
        req.chapterId = storyRecorder.chapterId
        val page = Page<com.parsec.aika.common.model.vo.resp.GetAppGiftResp>()
        return PageUtil<com.parsec.aika.common.model.vo.resp.GetAppGiftResp>().page(giftMapper.getAppGift(page, req))
    }

    override fun manageGiftList(
        req: com.parsec.aika.common.model.vo.req.ManageGiftQueryVo,
        userInfo: LoginUserInfo
    ): PageResult<Gift> {
        val page = Page<Gift>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        // 如果没有storyId和chapterId，则筛选全局；有storyId，筛选storyId满足条件，且chapterId为空的（故事级）；有chapterId，则按chapterId筛选。（章节级）
        return PageUtil<Gift>().page(giftMapper.manageGiftList(page,req))
    }

    override fun manageGiftDetail(id: Long): Gift {
        val giftVo = giftMapper.selectById(id)
        Assert.notNull(giftVo, "该礼物信息不存在")
        return giftVo
    }

    override fun manageGiftCreate(
        vo: com.parsec.aika.common.model.vo.req.ManageGiftCreateVo,
        user: LoginUserInfo
    ): Long? {
        // 验证传入的storyId、chapterId，是否存在对应的数据
        this.checkStoryIdAndChapterId(vo.storyId, vo.chapterId)
        // 验证礼物名称是否已存在。若传入了storyId、chapterId，则判断对应数据下是否存在该礼物名称
        this.checkGiftName(vo.giftName!!, null)
        val giftVo = Gift()
        BeanUtils.copyProperties(vo, giftVo)
        giftVo.creator = user.userId
        giftVo.createdAt = LocalDateTime.now()
        giftMapper.insert(giftVo)
        return giftVo.id
    }

    override fun manageGiftUpdate(vo: com.parsec.aika.common.model.vo.req.ManageGiftUpdateVo): Gift {
        // 验证id是否存在
        val giftVo = giftMapper.selectById(vo.id)
        Assert.notNull(giftVo, "该礼物信息不存在")
        // 验证传入的storyId、chapterId，是否存在对应的数据
        this.checkStoryIdAndChapterId(vo.storyId, vo.chapterId)
        // 验证礼物名称是否已存在（除该id对应外）
        // 验证礼物名称是否已存在。若传入了storyId、chapterId，则判断对应数据下是否存在该礼物名称
        this.checkGiftName(vo.giftName!!, vo.id)
        val updateVo = Gift()
        BeanUtils.copyProperties(vo, updateVo)
        updateVo.updatedAt = LocalDateTime.now()
        giftMapper.updateById(updateVo)
        return updateVo
    }

    override fun manageGiftDelete(id: Long) {
        // 验证id是否存在
        val giftVo = giftMapper.selectById(id)
        Assert.notNull(giftVo, "该礼物信息不存在")
        giftMapper.deleteById(id)
    }

    /**
     * 验证传入的故事id、章节id，是否存在相应的数据，以及章节信息中的故事id是否为传入的数据
     */
    private fun checkStoryIdAndChapterId(storyId: Long?, chapterId: Long?) {
        if (storyId != null) {
            // 如果传入了故事id，验证该故事信息是否存在
            Assert.notNull(storyMapper.selectById(storyId), "The story information does not exist")
        }
        if (chapterId != null) {
            // 如果传入了章节id，验证该章节信息是否存在
            val chapterVo = chapterMapper.selectById(chapterId)
            Assert.notNull(chapterVo, "该章节信息不存在")
            if (storyId != null) {
                // 验证该章节id是否对应该故事id
                Assert.isFalse(chapterVo.storyId != storyId, "传入的故事id、章节id有误")
            }
        }
    }

    /**
     * 验证是否存在该礼物名称
     * id 不为空，除该id外是否存在该礼物名称
     */
    private fun checkGiftName(giftName: String, id: Long?) {
        val checkNameVo = giftMapper.checkNameVo(giftName, id)
        Assert.isNull(checkNameVo, "该礼物名称已存在")
    }
}
