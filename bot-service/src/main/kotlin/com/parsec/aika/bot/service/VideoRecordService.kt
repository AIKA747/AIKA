package com.parsec.aika.bot.service

import cn.hutool.json.JSONObject
import com.parsec.aika.bot.model.vo.req.GetManageBotDigitalHumanVideoRecordsReq
import com.parsec.aika.bot.model.vo.req.PostManageBotDigitalHumanIdleAnimationReq
import com.parsec.aika.bot.model.vo.req.PostManageBotDigitalHumanSalutationReq
import com.parsec.aika.bot.model.vo.resp.GetManageBotDigitalHumanVideoRecordsResp
import com.parsec.aika.common.model.entity.DigitalHumanProfile
import com.parsec.trantor.common.response.PageResult

interface VideoRecordService {
    fun getManageBotDigitalHumanVideoRecords(req: GetManageBotDigitalHumanVideoRecordsReq): PageResult<GetManageBotDigitalHumanVideoRecordsResp>

    fun postManageBotDigitalHumanSalutation(req: PostManageBotDigitalHumanSalutationReq): JSONObject

    fun getManageBotDigitalHumanSalutationId(id: String): JSONObject

    fun postManageBotDigitalHumanIdleAnimation(req: PostManageBotDigitalHumanIdleAnimationReq): JSONObject

    fun getManageBotDigitalHumanIdleAnimationId(id: String?): JSONObject
    fun putSalutationVideo(profileId: String?, videoId: String?): DigitalHumanProfile?
    fun putIdleVideo(profileId: String?, videoId: String?): DigitalHumanProfile?
    fun deleteVideo(videoId: String): Int?
}