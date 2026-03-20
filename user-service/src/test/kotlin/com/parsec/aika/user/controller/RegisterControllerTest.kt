//package com.parsec.aika.user.controller
//
//import cn.hutool.jwt.JWTUtil
//import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
//import com.parsec.aika.common.model.em.UserStatus
//import com.parsec.aika.common.model.em.UserTypeEnum
//import com.parsec.aika.user.UserServiceApplicationTests
//import com.parsec.aika.user.mapper.AppUserMapper
//import com.parsec.aika.user.model.em.RedisKeyPrefix
//import com.parsec.aika.user.model.entity.AppUserInfo
//import com.parsec.aika.user.model.vo.req.AppVerifyEmailReq
//import com.parsec.aika.user.service.EmailService
//import org.junit.jupiter.api.Assertions.*
//import org.mockito.ArgumentMatchers.anyMap
//import org.mockito.Mockito.anyString
//import org.mockito.Mockito.doNothing
//import org.springframework.boot.test.context.SpringBootTest
//import org.springframework.boot.test.mock.mockito.MockBean
//import org.springframework.data.redis.core.StringRedisTemplate
//import org.springframework.test.annotation.Rollback
//import org.springframework.test.context.jdbc.Sql
//import org.springframework.transaction.annotation.Transactional
//import java.util.concurrent.TimeUnit
//import javax.annotation.Resource
//import kotlin.math.ceil
//
//@SpringBootTest
//internal class RegisterControllerTest : UserServiceApplicationTests() {
//
//    @Resource
//    private lateinit var registerController: RegisterController
//
//    @MockBean
//    private lateinit var emailService: EmailService
//
//    @Resource
//    private lateinit var appUserMapper: AppUserMapper
//
//    @Resource
//    lateinit var stringRedisTemplate: StringRedisTemplate
//
//    //    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/register_verify_email.sql")
//    fun verifyEmail() {
//        doNothing().`when`(emailService).sendMail(anyString(), anyString(), anyMap(), anyString())
//        // 传入的邮箱已注册过，报错
//        val req = AppVerifyEmailReq().apply {
//            this.email = "123456@qq.com"
//            this.password = "123456@123"
//        }
//        try {
//            registerController.verifyEmail(req)
//            fail()
//        } catch (_: Exception) {
//        }
//        // 传入未注册过的邮箱
//        req.email = "12${ceil(Math.random() * 100)}2@qq.com"
//        val result = registerController.verifyEmail(req)
//        assertEquals(result.code, 0)
//        // 注册的用户状态为 unverified
//        val user = appUserMapper.selectOne(
//            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, req.email).last("limit 1")
//        )
//        assertEquals(user.status, UserStatus.unverified)
//    }
//
//    //    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/register_verify_email.sql")
//    fun refreshTokenTest() {
//        // 传入不存在的client
//        try {
//            registerController.refreshToken("124easf")
//            fail()
//        } catch (e: Exception) {
//            assertEquals(e.message, "无效的clientCode")
//        }
//        var testEmail = "1234567821@qq.com"
//        // 传入的clientCode，对应的user does not exist
//        try {
//            // 生成email的hash值，再保存到redis中，确保通过clientCode，能从redis中获取到值，不会报“clientCode无效”，但该redis中保存的值中userId没对应的值，会报错
//            val emailHash = (Math.abs(testEmail.hashCode()) % Long.MAX_VALUE).toString()
//            // 将用户校验码与用户ID作为值，以邮箱hash作为键，存储到Redis中，并设置5分钟的过期时间
//            stringRedisTemplate.opsForValue()
//                .set("${RedisKeyPrefix.verifyEmail}$emailHash", "21212121:${testEmail}", 5, TimeUnit.MINUTES)
//            registerController.refreshToken(emailHash)
//            fail()
//        } catch (e: Exception) {
//            assertEquals(e.message, "user does not exist")
//        }
//
//        // 对应的用户存在，但该用户还未验证通过，直接返回空字符串
//        // 生成email的hash值，再保存到redis中
//        testEmail = "123456321@qq.com"
//        var testUserId = 100001
//        var emailHash = (Math.abs(testEmail.hashCode()) % Long.MAX_VALUE).toString()
//        // 将用户校验码与用户ID作为值，以邮箱hash作为键，存储到Redis中，并设置5分钟的过期时间
//        stringRedisTemplate.opsForValue()
//            .set("${RedisKeyPrefix.verifyEmail}$emailHash", "${testUserId}:${testEmail}", 5, TimeUnit.MINUTES)
//        var result = registerController.refreshToken(emailHash)
//        assertEquals(result.code, 0)
//        assertEquals(result.data, "")
//
//        // 查询到的用户，状态为已验证，则得到token
//        testEmail = "1234333321@qq.com"
//        testUserId = 100002
//        emailHash = (Math.abs(testEmail.hashCode()) % Long.MAX_VALUE).toString()
//        // 将用户校验码与用户ID作为值，以邮箱hash作为键，存储到Redis中，并设置5分钟的过期时间
//        stringRedisTemplate.opsForValue()
//            .set("${RedisKeyPrefix.verifyEmail}$emailHash", "${testUserId}:${testEmail}", 5, TimeUnit.MINUTES)
//        result = registerController.refreshToken(emailHash)
//        assertEquals(result.code, 0)
//        assertNotEquals(result.data, "")
//        val user = appUserMapper.selectById(testUserId)
//        // 返回的token能解析到用户信息
//        val payload = JWTUtil.parseToken(result.data!!.token).payload
//        assertEquals(payload.getClaim("userId").toString(), user.id.toString())
//        assertEquals(payload.getClaim("username").toString(), user.username.toString())
//        assertEquals(payload.getClaim("userType").toString(), UserTypeEnum.APPUSER.name)
//        assertEquals(payload.getClaim("status").toString(), UserStatus.uncompleted.name)
//    }
//}