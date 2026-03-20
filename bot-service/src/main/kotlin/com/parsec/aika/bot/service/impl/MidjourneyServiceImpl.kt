package com.parsec.aika.bot.service.impl

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.util.ObjectUtil
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONObject
import com.parsec.aika.bot.service.MidjourneyService
import com.parsec.aika.common.model.em.GenerateType
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class MidjourneyServiceImpl : MidjourneyService {

    @Value("\${mj.server-url}")
    private val mjServerUrl: String? = null

    @Value("\${mj.api-secret}")
    private val apiSecret: String? = null

    @Value("\${webhook.server-domian}")
    private val serverDomian: String? = null

    private val header = "mj-api-secret"

    private val mjNotifyHookUrl = "/bot/public/mj/result"

    /**
     * 任务提交
     */
    override fun submitImagine(state: GenerateType, prompt: String, base64Array: List<String>?): String {
        val url = "${mjServerUrl}/mj/submit/imagine"
        val params = JSONObject()
        params.set("prompt", prompt)
        params.set("notifyHook", "$serverDomian$mjNotifyHookUrl")
        params.set("state", state.name)
        if (CollUtil.isNotEmpty(base64Array)) {
            params.set("base64Array", base64Array)
        }
        return this.doPost(url, params.toString())
    }

    /**
     * action: UPSCALE(放大); VARIATION(变换); REROLL(重新生成),可用值:UPSCALE,VARIATION,REROLL,示例值(UPSCALE)
     */
    override fun submitChange(taskId: String, action: String, index: Int?): String {
        val url = "${mjServerUrl}/mj/submit/change"
        val params = JSONObject()
        params.set("action", action)
        params.set("notifyHook", "$serverDomian$mjNotifyHookUrl")
        params.set("taskId", taskId)
        if (ObjectUtil.isNotNull(index)) {
            params.set("index", index)
        }
        return this.doPost(url, params.toString())
    }

    override fun taskFetchById(taskId: String): String {
        val url = "${mjServerUrl}/mj/task/${taskId}/fetch"
        return HttpUtil.createGet(url).header(header, apiSecret).execute().body()
    }

    private fun doPost(url: String, params: String): String {
        return HttpUtil.createPost(url).header(header, apiSecret).body(params).execute().body()
    }


}