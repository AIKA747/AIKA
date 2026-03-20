package com.parsec.aika.content.service.impl

import cn.hutool.core.lang.Assert
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.common.mapper.GiftMapper
import com.parsec.aika.common.mapper.StoryChapterMapper
import com.parsec.aika.common.mapper.StoryRecorderMapper
import com.parsec.aika.common.model.em.GameStatus
import com.parsec.aika.common.model.entity.Gift
import com.parsec.aika.common.model.entity.StoryChapter
import com.parsec.aika.common.model.entity.StoryRecorder
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.ManageChapterCreateVo
import com.parsec.aika.content.service.StoryChapterService
import org.springframework.beans.BeanUtils
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import jakarta.annotation.Resource

@Service
class StoryChapterServiceImpl : StoryChapterService {

    @Resource
    private lateinit var storyChapterMapper: StoryChapterMapper

    @Resource
    private lateinit var giftMapper: GiftMapper

    @Resource
    private lateinit var storyRecorderMapper: StoryRecorderMapper

    override fun manageStoryChapterList(storyId: Long?): List<com.parsec.aika.common.model.vo.resp.ManageChapterVo> {
        val chapters = storyChapterMapper.selectList(
            KtQueryWrapper(StoryChapter::class.java).eq(
                storyId != null, StoryChapter::storyId, storyId
            ).orderByAsc(StoryChapter::chapterOrder)
        )
        val listVo = mutableListOf<com.parsec.aika.common.model.vo.resp.ManageChapterVo>()
        chapters.map {
            val vo = com.parsec.aika.common.model.vo.resp.ManageChapterVo()
            BeanUtils.copyProperties(it, vo)
            vo.chapterGifts = giftMapper.selectList(
                KtQueryWrapper(Gift::class.java).eq(Gift::storyId, it.storyId).eq(Gift::chapterId, it.id)
            )
            listVo.add(vo)
        }
        return listVo
    }

    override fun manageStoryChapterDetail(id: Long): com.parsec.aika.common.model.vo.resp.ManageChapterVo {
        val chapterVo = storyChapterMapper.selectById(id)
        Assert.notNull(chapterVo, "该章节信息不存在")
        val vo = com.parsec.aika.common.model.vo.resp.ManageChapterVo()
        BeanUtils.copyProperties(chapterVo, vo)
        vo.chapterGifts = giftMapper.selectList(
            KtQueryWrapper(Gift::class.java).eq(Gift::storyId, chapterVo.storyId).eq(Gift::chapterId, chapterVo.id)
        )
        return vo
    }

    override fun manageStoryChapterCreate(
        vo: ManageChapterCreateVo, user: LoginUserInfo
    ): Long {
        // 判断该故事下是否有该排序的该章节名称
        if (vo.chapterName != null && vo.chapterName!!.isNotEmpty()) {
            val checkNameVo = storyChapterMapper.selectOne(
                KtQueryWrapper(StoryChapter::class.java).eq(
                    StoryChapter::storyId, vo.storyId
                ).eq(StoryChapter::chapterName, vo.chapterName).eq(StoryChapter::chapterOrder, vo.chapterOrder)
                    .last("limit 1")
            )
            Assert.isNull(checkNameVo, "该故事下已经存在该排序的该章节名称")
        }
        val storyChapter = StoryChapter()
        BeanUtils.copyProperties(vo, storyChapter)
        storyChapter.listCover = vo.listCover ?: vo.listCoverDark
        storyChapter.listCoverDark = vo.listCoverDark ?: vo.listCover
        storyChapter.backgroundPicture = vo.backgroundPicture ?: vo.backgroundPictureDark
        storyChapter.backgroundPictureDark = vo.backgroundPictureDark ?: vo.backgroundPicture
        storyChapter.creator = user.userId
        storyChapter.createdAt = LocalDateTime.now()
        storyChapter.chapterRule = vo.chapterRule
        storyChapterMapper.insert(storyChapter)
        return storyChapter.id!!
    }

    override fun manageStoryChapterUpdate(
        vo: com.parsec.aika.common.model.vo.req.ManageChapterUpdateVo, user: LoginUserInfo
    ): com.parsec.aika.common.model.vo.resp.ManageChapterVo {
        // 验证章节id是否存在
        val chapterVo = storyChapterMapper.selectById(vo.id)
        Assert.notNull(chapterVo, "该章节信息不存在")
        val chapterUpdateVo = StoryChapter().apply {
            this.id = chapterVo.id
            this.chapterName = vo.chapterName
            this.summary = vo.summary
            this.chapterOrder = vo.chapterOrder
            this.cover = vo.cover
            this.coverDark = vo.coverDark
            this.listCover = vo.listCover ?: vo.listCoverDark
            this.listCoverDark = vo.listCoverDark ?: vo.listCover
            this.image = vo.image
            this.personality = vo.personality
            this.introduction = vo.introduction
            this.passedCopywriting = vo.passedCopywriting
            this.passedPicture = vo.passedPicture
            this.backgroundPrompt = vo.backgroundPrompt
            this.tonePrompt = vo.tonePrompt
            this.wordNumberPrompt = vo.wordNumberPrompt
            this.chapterScore = vo.chapterScore
            this.chapterRule = vo.chapterRule
            this.updatedAt = LocalDateTime.now()
            this.chatMinutes = vo.chatMinutes
            this.backgroundPicture = vo.backgroundPicture ?: vo.backgroundPictureDark
            this.backgroundPictureDark = vo.backgroundPictureDark ?: vo.backgroundPicture
            this.taskIntroduction = vo.taskIntroduction
        }
        storyChapterMapper.updateById(chapterUpdateVo)
        return this.manageStoryChapterDetail(vo.id!!)
    }

    @Transactional
    override fun manageStoryChapterUpdateOrderBatch(
        chapterOrderList: List<com.parsec.aika.common.model.vo.req.ManageChapterUpdateOrderVo>, user: LoginUserInfo
    ) {
        chapterOrderList.map {
            if (it.id != null) {
                storyChapterMapper.updateById(StoryChapter().apply {
                    this.id = it.id
                    this.chapterOrder = it.order
                })
            }
        }
    }

    override fun manageStoryChapterDelete(id: Long, user: LoginUserInfo) {
        // 章节采用硬删除，但是，需要查询游戏记录 StoryRecorder,如果有状态为 Playing 并且章节id为当前章节的，该章节不可删除。
        // 判断id是否存在
        val chapterVo = storyChapterMapper.manageChapterDetail(id)
        Assert.notNull(chapterVo, "该章节信息不存在")
        // 验证是否能删除。即查询StoryRecorder中是否存在章节id为该id且状态为Playing的数据
        val records = storyRecorderMapper.selectList(
            KtQueryWrapper(StoryRecorder::class.java).eq(StoryRecorder::chapterId, id)
                .eq(StoryRecorder::status, GameStatus.PLAYING)
        )
        Assert.isFalse(records.isNotEmpty(), "该章节信息暂时不能删除")
        storyChapterMapper.manageChapterDelete(id)
    }
}
