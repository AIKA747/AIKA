package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

class ManageGameListResp {

    /**
     * id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 游戏名称
     */
    var gameName: String? = null

    /**
     * 列表封面URL
     */
    var listCover: String? = null

    /**
     * 头像图片URL
     */
    var avatar: String? = null

    /**
     * 列表描述文字
     */
    var listDesc: String? = null

    /**
     * 排序
     */
    var orderNum: Int? = null

    /**
     * 上线/下线标志
     */
    var enable: Boolean? = null

    var coverDark:String? = null

    var listCoverDark:String? = null

    var free:Boolean? = null


}
