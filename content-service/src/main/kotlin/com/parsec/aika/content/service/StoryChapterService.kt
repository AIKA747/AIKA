package com.parsec.aika.content.service

import com.parsec.aika.common.model.vo.LoginUserInfo

interface StoryChapterService {

    /**
     * 章节管理列表
     */
    fun manageStoryChapterList(storyId: Long?): List<com.parsec.aika.common.model.vo.resp.ManageChapterVo>

    /**
     * 章节详情
     */
    fun manageStoryChapterDetail(id: Long): com.parsec.aika.common.model.vo.resp.ManageChapterVo

    /**
     * 创建章节
     */
    fun manageStoryChapterCreate(vo: com.parsec.aika.common.model.vo.req.ManageChapterCreateVo, user: LoginUserInfo): Long

    /**
     * 修改章节
     */
    fun manageStoryChapterUpdate(vo: com.parsec.aika.common.model.vo.req.ManageChapterUpdateVo, user: LoginUserInfo): com.parsec.aika.common.model.vo.resp.ManageChapterVo

    /**
     * 批量修改章节顺序
     */
    fun manageStoryChapterUpdateOrderBatch(chapterOrderList: List<com.parsec.aika.common.model.vo.req.ManageChapterUpdateOrderVo>, user: LoginUserInfo)

    /**
     * 删除章节
     * 硬删除。需要查询游戏记录 StoryRecorder,如果有状态为 Playing 并且章节id为当前章节的，该章节不可删除
     */
    fun manageStoryChapterDelete(id: Long, user: LoginUserInfo)

}
