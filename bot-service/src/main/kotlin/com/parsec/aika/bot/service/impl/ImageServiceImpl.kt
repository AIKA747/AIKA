package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.gpt.OpenaiRestHandler
import com.parsec.aika.bot.service.ImageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ImageServiceImpl : ImageService {

    @Autowired
    private lateinit var openaiRestHandler: OpenaiRestHandler

    override fun imageToText(describe: String?, imageUrl: String): String {
        val postResp = openaiRestHandler.imageToText(
            if (StrUtil.isBlank(describe)) "Understand this image and provide your evaluation in a sentence." else describe!!, imageUrl
        )
        val jsonObject = JSONObject(postResp)
        val error = jsonObject.getStr("error")
        Assert.isNull(error, "chatgpt消息异常，异常信息：{}", error)

        val jsonArray = jsonObject.getJSONArray("choices")
        val jsonObject1 = jsonArray.getJSONObject(0)
        val message = jsonObject1.getJSONObject("message")
        return message.getStr("content")
    }

    override fun textToImage(describe: String): String {
        try {
            val postResp = openaiRestHandler.textToImage(describe)
            val jsonObject = JSONObject(postResp)
            val error = jsonObject.getStr("error")
            Assert.isNull(error, "chatgpt消息异常，异常信息：{}", error)
            return JSONUtil.getByPath(jsonObject, "data[0].url", "")
        } catch (e: Exception) {
            StaticLog.error(e)
        }
        return ""
    }


}