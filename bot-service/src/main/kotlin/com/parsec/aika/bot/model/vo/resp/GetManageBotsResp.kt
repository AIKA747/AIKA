package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.BotStatusEnum
import java.time.LocalDateTime


class GetManageBotsResp {

    /**
     * 机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 机器人名称
     */
    var botName: String? = null

    var chatTotal: Int? = null

    /**
     * 创建人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 创建人id
     */
    var creatorName: String? = null

    /**
     * 状态
     */
    var botStatus: BotStatusEnum? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null

    /**
     * 分类机器人
     */
    var categoryName: String? = null

    /**
     * 是否推荐
     */
    var recommend: Boolean? = null

    var visibled: Boolean? = null
}