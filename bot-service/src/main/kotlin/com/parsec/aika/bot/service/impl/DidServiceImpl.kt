package com.parsec.aika.bot.service.impl

import cn.hutool.core.io.FileUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.http.HttpRequest
import cn.hutool.http.HttpStatus
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.parsec.aika.bot.service.DidService
import com.parsec.aika.common.mapper.DidReqLogMapper
import com.parsec.aika.common.model.entity.DidReqLog
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit
import javax.annotation.PreDestroy

@RefreshScope
@Service
class DidServiceImpl : DidService {

    @Autowired
    private lateinit var stringRedisTemplate: StringRedisTemplate

    @Autowired
    private lateinit var didReqLogMapper: DidReqLogMapper

    @Value("\${did.api-key}")
    private val apiKey: String? = null

    @Value("\${did.talks.stitch:false}")
    private val talksStitch: Boolean? = null

    @Value("\${did.animation.stitch:false}")
    private val animationStitch: Boolean? = null

    @Value("\${webhook.server-domian}")
    private val serverDomian: String? = null

    private val didTalkHookUrl = "/bot/public/did/talk/webhook"
    private val didAnimationHookUrl = "/bot/public/did/animation/webhook"

    private val talkTaskRedisKey = "did:task:talk:{}"
    private val animationTaskRedisKey = "did:task:animation:{}"

    private val executorService = ThreadUtil.newExecutor(5, 10)

    @PreDestroy
    fun destroy() {
        executorService.shutdown()
    }

    override fun generateVideo(
        imageUrl: String, audioUrl: String, expression: String, intensity: Double, metadata: String
    ): JSONObject {
        var intensityTemp: Double = intensity
        if (intensityTemp > 1.0) intensityTemp = 1.0
        if (intensityTemp < 0.0) intensityTemp = 0.0
        val req = JSONObject(
            """
                {"script":{"type":"audio","subtitles":"false","reduce_noise": true,"audio_url":"$audioUrl"},"config":{"fluent":"false","pad_audio":"0.0","driver_expressions":{"expressions":[{"expression":"$expression","start_frame":0,"intensity":$intensityTemp}]},"stitch":$talksStitch,"result_format":"mp4"},"source_url":"$imageUrl","webhook":"$serverDomian$didTalkHookUrl","metadata": "$metadata"}
                """
        )
        val reqBody = JSONUtil.toJsonStr(req)
        StaticLog.debug("generateVideo.reqBody:{}", reqBody)

        val url = "https://api.d-id.com/talks"

        val startTime = System.currentTimeMillis()

        val httpResponse = HttpUtil.createPost(url).header("accept", "application/json").header("authorization", apiKey)
            .body(reqBody, "application/json").execute()

        val endTime = System.currentTimeMillis()

        val body = httpResponse.body()
        StaticLog.debug("generateVideo.resp:{}", body)

        //记录日志
        this.reqLog(url, "POST", reqBody, body, endTime - startTime)

        Assert.state(
            httpResponse.status == HttpStatus.HTTP_ACCEPTED || httpResponse.status == HttpStatus.HTTP_CREATED || httpResponse.status == HttpStatus.HTTP_OK,
            "errorCode:{},body:{}",
            httpResponse.status,
            body
        )
        return JSONObject(body)
    }

    override fun talkWebhook(id: String?, resp: String) {
        stringRedisTemplate.opsForValue().set(StrUtil.format(talkTaskRedisKey, id), resp, 1, TimeUnit.HOURS)
        this.webhookLogUpdate(id, resp)
    }

    override fun queryVideoTask(id: String): JSONObject? {
        var json = stringRedisTemplate.opsForValue().get(StrUtil.format(talkTaskRedisKey, id))
        if (null == json) {
            val url = "https://api.d-id.com/talks/${id}"
            val startTime = System.currentTimeMillis()
            val httpResponse =
                HttpUtil.createGet(url).header("accept", "application/json").header("authorization", apiKey).execute()
            val endTime = System.currentTimeMillis()
            json = httpResponse.body()
            StaticLog.debug("queryVideoTask.resp:{}", json)
            //记录日志
            this.reqLog(url, "GET", "id=${id}", json, endTime - startTime)
            Assert.state(
                httpResponse.status == HttpStatus.HTTP_ACCEPTED || httpResponse.status == HttpStatus.HTTP_CREATED || httpResponse.status == HttpStatus.HTTP_OK,
                "errorCode:{}",
                httpResponse.status
            )
        }
        val jsonObject = JSONObject(json)
        if (jsonObject.getStr("status") == "done") {
            stringRedisTemplate.opsForValue().set(StrUtil.format(talkTaskRedisKey, id), json!!, 1, TimeUnit.HOURS)
        }

        return JSONObject().apply {
            this.set("id", jsonObject.getStr("id", id))
            this.set("status", jsonObject.getStr("status", "started"))
            this.set("result_url", jsonObject.getStr("result_url", ""))
        }
    }

    override fun generateAnimation(imageUrl: String, driverUrl: String?): JSONObject {
        val req = JSONObject(
            """
                {"config":{"stitch":$animationStitch},"source_url":"$imageUrl","webhook":"$serverDomian$didAnimationHookUrl"}
                """
        )
        //加上driver_url参数后会403异常，暂时注释掉
//        if (StrUtil.isNotBlank(driverUrl)) {
//            req.set("driver_url", driverUrl)
//        }

        val reqBody = JSONUtil.toJsonStr(req)
        StaticLog.debug("generateAnimation.reqBody:{}", reqBody)

        val url = "https://api.d-id.com/animations"

        val startTime = System.currentTimeMillis()

        val httpResponse = HttpUtil.createPost(url).header("accept", "application/json").header("authorization", apiKey)
            .body(reqBody, "application/json").execute()

        val endTime = System.currentTimeMillis()

        val body = httpResponse.body()
        StaticLog.debug("generateAnimation.resp:{}", body)

        //记录日志
        this.reqLog(url, "POST", reqBody, body, endTime - startTime)
        Assert.state(
            httpResponse.status == HttpStatus.HTTP_ACCEPTED || httpResponse.status == HttpStatus.HTTP_CREATED || httpResponse.status == HttpStatus.HTTP_OK,
            "errorCode:{}",
            httpResponse.status
        )
        return JSONObject(body)
    }

    override fun animationWebhook(resp: String) {
        val id = JSONObject(resp).getStr("id")
        stringRedisTemplate.opsForValue().set(StrUtil.format(animationTaskRedisKey, id), resp, 1, TimeUnit.HOURS)
        this.webhookLogUpdate(id, resp)
    }

    override fun uploadFile(bytes: ByteArray): String {
        val startTime = System.currentTimeMillis()
        // 设置要上传的文件
        val file = FileUtil.writeBytes(bytes, FileUtil.createTempFile())
        // 设置请求URL
        val url = "https://api.d-id.com/audios"
        // 设置请求头
        val request = HttpRequest.post(url).header("accept", "application/json").header("authorization", apiKey)
            .header("content-type", "multipart/form-data")
        // 发起POST请求并上传文件
        val response = request.form("audio", file).execute()

        val endTime = System.currentTimeMillis()
        // 获取响应内容
        val body = response.body()
        StaticLog.info("did.uploadFile:{}", body)
        //记录日志
        this.reqLog(url, "POST", "", body, endTime - startTime)
        val jsonObject = JSONObject(body)
        return jsonObject.getStr("url")
    }

    override fun queryAnimationTask(id: String?): JSONObject? {
        var json = stringRedisTemplate.opsForValue().get(StrUtil.format(animationTaskRedisKey, id))
        if (null == json) {
            val url = "https://api.d-id.com/animations/${id}"
            val startTime = System.currentTimeMillis()
            val httpResponse =
                HttpUtil.createGet(url).header("accept", "application/json").header("authorization", apiKey).execute()
            val endTime = System.currentTimeMillis()
            json = httpResponse.body()
            StaticLog.debug("queryAnimationTask.resp:{}", json)
            //记录日志
            this.reqLog(url, "GET", "id=${id}", json, endTime - startTime)
            Assert.state(
                httpResponse.status == HttpStatus.HTTP_ACCEPTED || httpResponse.status == HttpStatus.HTTP_CREATED || httpResponse.status == HttpStatus.HTTP_OK,
                "errorCode:{}",
                httpResponse.status
            )
        }
        val jsonObject = JSONObject(json)
        if (jsonObject.getStr("status") == "done") {
            stringRedisTemplate.opsForValue().set(StrUtil.format(animationTaskRedisKey, id), json!!, 1, TimeUnit.HOURS)
        }
        return JSONObject().apply {
            this.set("id", jsonObject.getStr("id", id))
            this.set("status", jsonObject.getStr("status", "started"))
            this.set("result_url", jsonObject.getStr("result_url", ""))
        }
    }

    private fun reqLog(url: String, method: String, reqParams: String, respResult: String, times: Long) {
        executorService.execute {
            didReqLogMapper.insert(DidReqLog().apply {
                this.url = url
                this.method = method
                this.reqParams = reqParams
                this.respResult = respResult
                this.times = times
                this.createdAt = LocalDateTime.now()
            })
        }
    }

    private fun webhookLogUpdate(id: String?, resp: String) {
        executorService.execute {
            didReqLogMapper.update(
                DidReqLog().apply {
                    webhookAt = LocalDateTime.now()
                    webhookResult = resp
                }, KtUpdateWrapper(DidReqLog::class.java).apply("""JSON_VALUE(respResult,'$.id')='${id}'""")
            )
        }
    }

}