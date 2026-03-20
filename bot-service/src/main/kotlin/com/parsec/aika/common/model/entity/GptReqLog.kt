package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import java.io.Serializable
import java.time.LocalDateTime

@TableName("gpt_req_log")
class GptReqLog : Serializable {

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    var id: Long? = null

    //    `url`        varchar(200) NOT NULL COMMENT '请求链接',
    var url: String? = null

    //    `method`     varchar(100) NOT NULL COMMENT '请求方式：post,get,put....',
    var method: String? = null

    //    reqParams text NOT NULL发起请求参数
    var reqParams: String? = null

    //respStatusint NULL响应状态码
    var respStatus: Int? = null

    //    respResult text NOT NULL响应结果
    var respResult: String? = null

    //    times int NOT NULL请求耗时，单位:毫秒
    var times: Long? = null

    //    createdAt datetime NOT NULL创建时间
    var createdAt: LocalDateTime? = null

}