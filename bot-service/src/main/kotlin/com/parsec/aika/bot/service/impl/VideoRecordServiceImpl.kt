package com.parsec.aika.bot.service.impl

import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONObject
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.GetManageBotDigitalHumanVideoRecordsReq
import com.parsec.aika.bot.model.vo.req.PostManageBotDigitalHumanIdleAnimationReq
import com.parsec.aika.bot.model.vo.req.PostManageBotDigitalHumanSalutationReq
import com.parsec.aika.bot.model.vo.resp.GetManageBotDigitalHumanVideoRecordsResp
import com.parsec.aika.bot.service.DidService
import com.parsec.aika.bot.service.FileUploadService
import com.parsec.aika.bot.service.VideoRecordService
import com.parsec.aika.common.mapper.DigitalHumanProfileMapper
import com.parsec.aika.common.mapper.VideoRecordMapper
import com.parsec.aika.common.model.em.VideoRecordEnum
import com.parsec.aika.common.model.entity.DigitalHumanProfile
import com.parsec.aika.common.model.entity.VideoRecord
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.annotation.PreDestroy
import javax.annotation.Resource

@Service
class VideoRecordServiceImpl : VideoRecordService {

    @Resource
    private lateinit var videoRecordMapper: VideoRecordMapper

    @Resource
    private lateinit var didService: DidService

    @Resource
    private lateinit var digitalHumanProfileMapper: DigitalHumanProfileMapper

    @Resource
    private lateinit var fileUploadService: FileUploadService

    private val executorService = ThreadUtil.newExecutor(5, 10)

    @PreDestroy
    fun destroy() {
        executorService.shutdown()
    }

    override fun getManageBotDigitalHumanVideoRecords(req: GetManageBotDigitalHumanVideoRecordsReq): PageResult<GetManageBotDigitalHumanVideoRecordsResp> {
        PageHelper.startPage<GetManageBotDigitalHumanVideoRecordsResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetManageBotDigitalHumanVideoRecordsResp>().page(
            videoRecordMapper.getManageBotDigitalHumanVideoRecords(req)
        )
    }

    // 生成打招呼视频
    override fun postManageBotDigitalHumanSalutation(req: PostManageBotDigitalHumanSalutationReq): JSONObject {
        val profile = digitalHumanProfileMapper.selectById(req.profileId)
            ?: throw BusinessException("The configuration information does not exist")
        //下载语音文件
        val bytes = HttpUtil.createGet(req.audioUrl!!).execute().bodyBytes()
        //上传到d-did
        val audioUrl = didService.uploadFile(bytes)
        //生成视频
        val generateVideo =
            didService.generateVideo(profile.sourceImage!!, audioUrl, profile.expression!!, profile.intensity!!)

        videoRecordMapper.insert(VideoRecord().apply {
            id = generateVideo.getStr("id")
            status = generateVideo.getStr("status")
            createdAt = LocalDateTime.now()
            type = VideoRecordEnum.talk
            language = req.language
            voiceName = req.voiceName
            content = req.content
            profileId = req.profileId
        })
        return generateVideo
    }

    // 获取打招呼视频的链接
    override fun getManageBotDigitalHumanSalutationId(id: String): JSONObject {
        val queryVideoTask = didService.queryVideoTask(id)
        if (null != queryVideoTask) {
            val status = queryVideoTask.getStr("status")
            val videoUrl = queryVideoTask.getStr("result_url", "")
            if (status == "done" && StrUtil.isNotBlank(videoUrl)) {
                val videoRecord = videoRecordMapper.selectById(id)
                if (videoRecord.status != "done") {
                    videoRecord.status = status
                    videoRecord.videoUrl = fileUploadService.uploadFile(videoUrl, "mp4", "video/mp4", "videos")
                    videoRecord.updatedAt = LocalDateTime.now()
                    videoRecordMapper.updateById(videoRecord)
                }
            }
            if (status == "fail") {
                val videoRecord = videoRecordMapper.selectById(id)
                videoRecord.status = status
                videoRecord.updatedAt = LocalDateTime.now()
                videoRecordMapper.updateById(videoRecord)
            }
            return queryVideoTask
        } else {
            val videoRecord = videoRecordMapper.selectById(id)
            return if (Objects.isNull(videoRecord)) {
                JSONObject("""{"id":"$id","status":"fail"}""")
            } else {
                JSONObject("""{"id":"$id","status":"${videoRecord.status}","result_url":"${videoRecord.videoUrl}"}""")
            }
        }
    }

    // 生成空闲动画
    override fun postManageBotDigitalHumanIdleAnimation(req: PostManageBotDigitalHumanIdleAnimationReq): JSONObject {
        val profile = digitalHumanProfileMapper.selectById(req.profileId)
            ?: throw BusinessException("The configuration information does not exist")
        val generateAnimation = didService.generateAnimation(profile.sourceImage!!, req.driverUrl)
        videoRecordMapper.insert(VideoRecord().apply {
            id = generateAnimation.getStr("id")
            status = generateAnimation.getStr("status")
            createdAt = LocalDateTime.now()
            type = VideoRecordEnum.animations
            profileId = req.profileId
        })
        return generateAnimation
    }

    // 获取动画链接
    override fun getManageBotDigitalHumanIdleAnimationId(id: String?): JSONObject {
        val queryAnimationTask = didService.queryAnimationTask(id)
        if (null != queryAnimationTask) {
            val status = queryAnimationTask.getStr("status")
            val videoUrl = queryAnimationTask.getStr("result_url", "")
            if (status == "done" && StrUtil.isNotBlank(videoUrl)) {
                val videoRecord = videoRecordMapper.selectById(id)
                if (videoRecord.status != "done") {
                    videoRecord.status = status
                    videoRecord.videoUrl = fileUploadService.uploadFile(videoUrl, "mp4", "video/mp4", "videos")
                    videoRecord.updatedAt = LocalDateTime.now()
                    videoRecordMapper.updateById(videoRecord)
                }
            }
            if (status == "fail") {
                val videoRecord = videoRecordMapper.selectById(id)
                videoRecord.status = status
                videoRecord.updatedAt = LocalDateTime.now()
                videoRecordMapper.updateById(videoRecord)
            }
            return queryAnimationTask
        } else {
            val videoRecord = videoRecordMapper.selectById(id)
            return if (Objects.isNull(videoRecord)) {
                JSONObject("""{"id":"$id","status":"fail"}""")
            } else {
                JSONObject("""{"id":"$id","status":"${videoRecord.status}","result_url":"${videoRecord.videoUrl}"}""")
            }
        }
    }

    override fun putSalutationVideo(profileId: String?, videoId: String?): DigitalHumanProfile? {
        val profile = digitalHumanProfileMapper.selectById(profileId)
            ?: throw BusinessException("The configuration information does not exist")
        val videoRecord =
            videoRecordMapper.selectById(videoId) ?: throw BusinessException("The video information does not exist")
        profile.greetVideoId = videoId
        profile.greetVideo = videoRecord.videoUrl
        digitalHumanProfileMapper.updateById(profile)
        return profile
    }

    override fun putIdleVideo(profileId: String?, videoId: String?): DigitalHumanProfile? {
        val profile = digitalHumanProfileMapper.selectById(profileId)
            ?: throw BusinessException("The configuration information does not exist")
        val videoRecord =
            videoRecordMapper.selectById(videoId) ?: throw BusinessException("The video information does not exist")
        profile.idleVideoId = videoId
        profile.idleVideo = videoRecord.videoUrl
        digitalHumanProfileMapper.updateById(profile)
        return profile
    }

    override fun deleteVideo(videoId: String): Int? {
        return videoRecordMapper.deleteById(videoId)
    }

    private fun updateVideoUrl(video: VideoRecord) {
        executorService.execute {

            videoRecordMapper.updateById(video)
        }
    }
}