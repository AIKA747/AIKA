package com.parsec.aika.bot.service

import cn.hutool.json.JSONObject
import com.parsec.aika.common.model.em.GenerateType

interface DidService {


    /**
     * 生成视频，返回视频任务信息
     */
    fun generateVideo(
        imageUrl: String,
        audioUrl: String,
        expression: String,
        intensity: Double,
        metadata: String = GenerateType.default.name
    ): JSONObject

    /**
     * 查询视频任务生成结果
     */
    fun queryVideoTask(id: String): JSONObject?

    /**
     * 视频任务webhook
     */
    fun talkWebhook(id: String?, resp: String)

    /**
     *生成动画，返回动画任务信息
     */
    fun generateAnimation(imageUrl: String, driverUrl: String?): JSONObject

    /**
     * 查询视动画任务生成结果
     */
    fun queryAnimationTask(id: String?): JSONObject?

    /**
     * 动画webhook
     */
    fun animationWebhook(resp: String)

    /**
     * d-id上传文件
     */
    fun uploadFile(bytes: ByteArray): String
}