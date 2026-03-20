package com.parsec.aika.user.model.vo.req

import org.springframework.web.multipart.MultipartFile

class AppErrorLogsReq {
    /**
     * 用户id
     */
    var userId: String? = null

    /**
     * 设备
     */
    var device: String? = null

    /**
     *系统版本
     */
    var systemVersion: String? = null

    /**
     * 备注
     */
    var remark: String? = null

    /**
     * 日志文件
     */
    var file: MultipartFile? = null

}