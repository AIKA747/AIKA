package com.parsec.aika.bot.controller.manage

import cn.hutool.json.JSONObject
import com.parsec.aika.bot.model.vo.req.GetManageBotDigitalHumanVideoRecordsReq
import com.parsec.aika.bot.model.vo.req.PostManageBotDigitalHumanIdleAnimationReq
import com.parsec.aika.bot.model.vo.req.PostManageBotDigitalHumanSalutationReq
import com.parsec.aika.bot.model.vo.req.PutVideoReq
import com.parsec.aika.bot.model.vo.resp.GetManageBotDigitalHumanVideoRecordsResp
import com.parsec.aika.bot.service.VideoRecordService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageBotDigitalHumanVideoController {

    @Resource
    private lateinit var videoRecordService: VideoRecordService

    /**
     * 视频记录列表
     */
    @GetMapping("/manage/bot/digital-human/video/records")
    fun getManageBotDigitalHumanVideoRecords(
        @Validated req: GetManageBotDigitalHumanVideoRecordsReq, loginUser: LoginUserInfo
    ): BaseResult<PageResult<GetManageBotDigitalHumanVideoRecordsResp>> {
        return BaseResult.success(videoRecordService.getManageBotDigitalHumanVideoRecords(req))
    }

    /**
     * 打招呼视频生成
     */
    @PostMapping("/manage/bot/digital-human/salutation")
    fun postManageBotDigitalHumanSalutation(@RequestBody req: PostManageBotDigitalHumanSalutationReq): BaseResult<JSONObject> {
        return BaseResult.success(videoRecordService.postManageBotDigitalHumanSalutation(req))
    }

    /**
     * 获取打招呼视频链接
     */
    @GetMapping("/manage/bot/digital-human/salutation/{id}")
    fun getManageBotDigitalHumanSalutationId(@PathVariable id: String): BaseResult<JSONObject> {
        return BaseResult.success(videoRecordService.getManageBotDigitalHumanSalutationId(id))
    }

    /**
     * 空闲动画生成
     */
    @PostMapping("/manage/bot/digita-human/idle-animation")
    fun postManageBotDigitalHumanIdleAnimation(@RequestBody req: PostManageBotDigitalHumanIdleAnimationReq): BaseResult<JSONObject> {
        return BaseResult.success(videoRecordService.postManageBotDigitalHumanIdleAnimation(req))
    }

    /**
     * 获取打招呼视频链接
     */
    @GetMapping("/manage/bot/digita-human/idle-animation/{id}")
    fun getManageBotDigitalHumanIdleAnimationId(@PathVariable id: String): BaseResult<JSONObject> {
        return BaseResult.success(videoRecordService.getManageBotDigitalHumanIdleAnimationId(id))
    }

    @PutMapping("/manage/assistant/digital-human/salutation")
    fun putSalutationVideo(@RequestBody @Validated req: PutVideoReq): BaseResult<Any> {
        return BaseResult.success(videoRecordService.putSalutationVideo(req.profileId, req.videoId))
    }

    @PutMapping("/manage/assistant/digita-human/idle-animation")
    fun putIdleVideo(@RequestBody @Validated req: PutVideoReq): BaseResult<Any> {
        return BaseResult.success(videoRecordService.putIdleVideo(req.profileId, req.videoId))
    }

    @DeleteMapping("/manage/assistant/digita-human/video/{videoId}")
    fun deleteVideo(@PathVariable videoId: String): BaseResult<Any> {
        return BaseResult.success(videoRecordService.deleteVideo(videoId))
    }
}