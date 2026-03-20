package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotBlank

class UserFeedbackSaveReq {

    /**
     * device varchar(255) NULL设备
     */
    @NotBlank
    var device: String? = null

    /**
     *systemVersion varchar(255) NULL系统版本
     */
    @NotBlank
    var systemVersion: String? = null

    /**
     * category varchar(255) NOT NULL反馈类型
     */
    @NotBlank
    var category: String? = null

    /**
     * title varchar(255) NOT NULL反馈标题
     */
    @NotBlank
    var title: String? = null

    //    @NotBlank
    var titleValue: String? = null

    /**
     * description text NOT NULL反馈详情
     */
    @NotBlank
    var description: String? = null

    /**
     * images text NULL图片列表
     */
    var images: List<String>? = null

    /**
     * video text NULL视频
     */
    var video: String? = null

}