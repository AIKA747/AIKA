package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.*
import software.amazon.awssdk.services.rekognition.model.VideoJobStatus
import java.io.Serializable
import java.time.LocalDateTime

@TableName("video_rekognition_job")
class VideoRekognitionJob : Serializable {

    @TableId(value = "jobId", type = IdType.INPUT)
    var jobId: String? = null

    @TableField("`status`")
    var status: VideoJobStatus? = null

    @TableField("`bucket`")
    var bucket: String? = null

    @TableField("`key`")
    var key: String? = null

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    var endAt: LocalDateTime? = null


}