package com.parsec.aika.content.service.impl

import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.content.gpt.OpenaiRestHandler
import com.parsec.aika.content.service.ModerationsService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ModerationsServiceImpl : ModerationsService {

    @Autowired
    private lateinit var openaiRestHandler: OpenaiRestHandler

    /**
     * 敏感性检查
     */
    override fun moderations(text: String): Pair<Boolean?, List<String>?>? {
        try {
            val moderationsResp = openaiRestHandler.moderations(text)
            StaticLog.debug("文本敏感性检查结果：{}", moderationsResp)
            val resp = JSONUtil.parseObj(moderationsResp)
            val result = JSONObject(resp.getJSONArray("results")[0])
            val flagged = result.getBool("flagged")
            if (flagged) {
                val categories = result.getJSONObject("categories")
                return Pair(flagged, categories.keys.filter { categories.getBool(it) }.toList())
            }
            return Pair(flagged, null)
        } catch (e: Exception) {
            StaticLog.error("moderations error")
            e.printStackTrace()
            return null
        }
    }
}