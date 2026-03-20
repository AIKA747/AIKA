package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.handler.LanguageVoiceTypeHandler
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.ProfileType

@TableName("digital_human_profile", autoResultMap = true)
class DigitalHumanProfile {

    /**
     * 主键id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 配置类型
     */
    var profileType: ProfileType? = null

    /**
     * 机器人或助手id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var objectId: Long? = null

    /**
     * 数字人图片
     */
    var sourceImage: String? = null

    /**
     * 表情neutral,happy,serious,surprise
     */
    var expression: String? = null

    /**
     * 强度
     */
    var intensity: Double? = null

    /**
     * 支持的语言
     */
    @TableField(typeHandler = LanguageVoiceTypeHandler::class)
    var language: List<LanguageVoice>? = null

    /**
     * 空闲视频
     */
    var idleVideo: String? = null

    /**
     * 空闲视频id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var idleVideoId: String? = null

    /**
     * 欢迎视频
     */
    var greetVideo: String? = null

    /**
     * 欢迎视频id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var greetVideoId: String? = null

    /**
     * 性别
     */
    var gender: Gender? = null

    var voiceName: String? = null
}

class LanguageVoice {

    var language: String? = null
    var voice: String? = null

}