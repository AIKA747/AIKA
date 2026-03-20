package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.FieldFill
import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.VideoRecordEnum
import java.time.LocalDateTime


@TableName("digital_human_video_record")
class VideoRecord {

    /**
     * id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: String? = null

    /**
     * 配置id
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

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null // 修改时间

    var voiceName: String? = null

    var content: String? = null

    var status: String? = null

    var language: String? = null

}