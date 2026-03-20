package com.parsec.aika.content.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.CollectStoryMapper
import com.parsec.aika.common.model.entity.CollectStory
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.model.vo.req.PostAppUserCollectStoryReq
import com.parsec.aika.common.model.vo.resp.GetAppUserCollectStoryResp
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.service.CollectStoryService
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import jakarta.annotation.Resource

@Service
class CollectStoryServiceImpl: CollectStoryService {

    @Resource
    private lateinit var collectStoryMapper: CollectStoryMapper

    // 新增收藏
    override fun postAppUserCollectStory(req: PostAppUserCollectStoryReq, loginUserInfo: LoginUserInfo): Long? {
        var collectStory = collectStoryMapper.selectOne(KtQueryWrapper(CollectStory::class.java).eq(CollectStory::storyId, req.storyId).eq(CollectStory::creator, loginUserInfo.userId))
        if (collectStory == null){
            collectStory = CollectStory().apply {
                this.storyId = req.storyId
                this.creator = loginUserInfo.userId
            }
            collectStoryMapper.insert(collectStory)
        }
        return collectStory.id
    }

    // 取消收藏
    override fun deleteAppUserCollectStoryId(storyId: Long, loginUserInfo: LoginUserInfo) {
        collectStoryMapper.delete(KtQueryWrapper(CollectStory::class.java).eq(CollectStory::storyId, storyId).eq(CollectStory::creator, loginUserInfo.userId))
    }

    // 获得用户收藏的故事
    override fun getAppUserCollectStory(
        req: PageVo,
        loginUserInfo: LoginUserInfo,
    ): PageResult<GetAppUserCollectStoryResp> {
        // 由于自定义SQL查询不支持直接分页，这里先获取所有数据，然后手动分页
        // 注意：对于大数据量，这种方式性能不好，建议修改SQL查询支持分页
        val allData = collectStoryMapper.getAppUserCollectStory(loginUserInfo.userId!!)

        val pageNo = req.pageNo!!.toLong()
        val pageSize = req.pageSize!!.toLong()
        val startIndex = ((pageNo - 1) * pageSize).toInt()
        val endIndex = minOf(startIndex + pageSize.toInt(), allData.size)

        val pageData = if (startIndex >= allData.size) {
            emptyList()
        } else {
            allData.subList(startIndex, endIndex)
        }

        return PageResult<GetAppUserCollectStoryResp>().apply {
            this.list = pageData.toList()
            this.pageNum = pageNo
            this.pageSize = pageSize
            this.total = allData.size.toLong()
            this.pages = if (allData.isEmpty()) 0L else (allData.size + pageSize - 1) / pageSize
        }
    }
}
