package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.VideoRecordEnum
import java.time.LocalDateTime

/**
 * @author RainLin
 * @since 2024/1/29 11:49
 */
class GetManageBotDigitalHumanVideoRecordsResp {

    /**
     * id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: String? = null

    /**
     * 机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var profileId: Long? = null

    /**
     * 视频链接
     */
    var videoUrl: String? = null

    /**
     * 视频类型：talk，animations
     */
    var type: VideoRecordEnum? = null

    /**
     * 0视频记录，1打招呼视频，2空闲视频
     */
    var flag: Int? = null


    var createdAt: LocalDateTime? = null

    var voiceName: String? = null

    var language: String? = null
}