package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime


class GetAppRateResp {


    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 被评价机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * 用户姓名
     */
    var username: String? = null

    /**
     * 评价内容
     */
    var content: String? = null

    /**
     * 评分
     */
    var rating: Double? = null

    /**
     * 提交时间
     */
    var commentAt: LocalDateTime? = null
}