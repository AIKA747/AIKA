package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

/**
 * @author husu
 * @version 1.0
 * @date 2025/1/17.
 */
class GameResultListRespDTO {

    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    var createdAt: LocalDateTime? = null // 创建时间

    var updatedAt: LocalDateTime? = null // 修改时间

    /**
     * 游戏ID
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var gameId: Long? = null

    /**
     * 摘要
     */
    var summary: String? = null

    /**
     * 描述
     */
    var description: String? = null

    /**
     * 图片URL
     */
    var cover: String? = null
}
