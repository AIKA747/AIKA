package com.parsec.aika.user.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONObject
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.user.mapper.AppUserMapper
import com.parsec.aika.user.model.em.RedisKeyPrefix
import com.parsec.aika.user.model.entity.AppUserInfo
import com.parsec.aika.user.service.AuthService
import com.parsec.aika.user.service.EmailService
import com.parsec.aika.user.service.GoogleDelService
import com.parsec.aika.user.service.UserEmailService
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit
import javax.annotation.Resource

@RefreshScope
@Service
class GoogleDelServiceImpl : GoogleDelService {

    @Autowired
    private lateinit var authService: AuthService

    @Autowired
    private lateinit var userEmailService: UserEmailService

    @Autowired
    private lateinit var emailService: EmailService

    @Autowired
    private lateinit var userMapper: AppUserMapper

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    /**
     * 注册验证邮件中按钮对应链接
     */
    @Value("\${mail.url.deleteUser:}")
    private lateinit var deleteUserUrl: String

    private final val DELETE_USER_TITLE = "Account deletion in progress"

    override fun googleDelUser(email: String) {
        val userInfo = userMapper.selectOne(
            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, email).orderByDesc(AppUserInfo::id)
                .last("limit 1")
        ) ?: throw BusinessException("This email isn’t linked to any account")
        // 得到传入的email的hash值
        val emailHash = userEmailService.emailHashCode(userInfo.email!!)
        // 随机一个六位数
        val verifyCode = ((Math.random() * 9 + 1) * 100000).toInt()
        val map = HashMap<String, Any?>()
        map["email"] = userInfo.email!!
        map["url"] = "${deleteUserUrl}?clientCode=$emailHash&verifyCode=$verifyCode"
        emailService.sendMail(userInfo.email!!, DELETE_USER_TITLE, map, "deleteUser")
        val jsonObject = JSONObject()
        jsonObject.set("userId", userInfo.id)
        jsonObject.set("email", userInfo.email)
        jsonObject.set("verifyCode", verifyCode)
        stringRedisTemplate.opsForValue()
            .set("${RedisKeyPrefix.deleteUserValidation}$emailHash", jsonObject.toString(), 1, TimeUnit.DAYS)
    }

    override fun googleDelUserData(clientCode: String, verifyCode: String) {
        val cacheJson = stringRedisTemplate.opsForValue().get("${RedisKeyPrefix.deleteUserValidation}$clientCode")
        Assert.notBlank(cacheJson, "The email verification code has expired")
        val jsonObject = JSONObject(cacheJson)
        Assert.state(
            jsonObject.getStr("verifyCode") == verifyCode, "The verification code is incorrect"
        )
        val userId = jsonObject.getLong("userId")
        val email = jsonObject.getStr("email")
        val userInfo =
            userMapper.selectById(userId) ?: throw BusinessException("This email isn’t linked to any account")
        Assert.state(userInfo.email == email, "The email verification code has expired")
        authService.deleteUser(userId)
        stringRedisTemplate.delete("${RedisKeyPrefix.deleteUserValidation}$clientCode")
    }
}