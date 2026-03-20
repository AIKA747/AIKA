package com.parsec.aika.user.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONUtil
import com.parsec.aika.user.service.NsfwService
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Service
import java.io.File

@RefreshScope
@Service
class NsfwServiceImpl : NsfwService {

    @Value("\${nsfw.url:http://172.31.67.174:3333/check}")
    private var url: String? = null

    @Value("\${nsfw.username:}")
    private var username: String? = null

    @Value("\${nsfw.password:}")
    private var password: String? = null

    override fun contentCheck(file: File): Double {
        val postRequest = HttpUtil.createPost(url).form("file", file)
        if (StrUtil.isNotBlank(username)) {
            postRequest.basicAuth(username, password)
        }
        val response = postRequest.execute()
        Assert.state(response.isOk, "nsfw check error")
        val responseBody = response.body()
        val body = JSONUtil.parseObj(responseBody)
        val status = body.getStr("status")
        Assert.state("success" == status, "nsfw check error")
        val result = body.getJSONObject("result")
        return result.getDouble("nsfw")
    }
}