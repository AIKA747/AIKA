package com.parsec.aika.admin.controller

import cn.hutool.core.lang.Assert
import com.parsec.aika.admin.model.vo.resp.VerifyCodeResp
import com.parsec.aika.admin.service.ValidateImageCodeService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.redis.util.RedisUtil
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource
import javax.imageio.ImageIO
import javax.servlet.http.HttpServletResponse

@RestController
class PublicController {

    @Resource
    private lateinit var validateImageCodeService: ValidateImageCodeService

    /**
     * 获取图形验证码
     */
    @GetMapping("/public/verify-code")
    fun verifyCode(): BaseResult<VerifyCodeResp> {
        return BaseResult.success(validateImageCodeService.getAuthCode())
    }

    /**
     * 获得图形验证码图片
     * 通过此请求获得验证码图片的流
     */
    @GetMapping("/public/verify-code/image/{clientCode}")
    fun captchaImage(@PathVariable clientCode: String, response: HttpServletResponse) {
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
        val imageCode = RedisUtil.get<String?>(clientCode)
        Assert.notNull(imageCode, "clientCode不存在或者已过期")
        val image = validateImageCodeService.createImage(imageCode!!)
        ImageIO.write(image, "jpg", response.outputStream)
        response.flushBuffer()
        response.outputStream.close()
    }

    @GetMapping("/public/health")
    fun health(): BaseResult<*> {
        return BaseResult.success()
    }

}