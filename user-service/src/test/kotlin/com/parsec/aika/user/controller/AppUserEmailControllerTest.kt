//package com.parsec.aika.user.controller
//
//import cn.hutool.crypto.digest.DigestUtil
//import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
//import com.parsec.aika.common.model.em.UserStatus
//import com.parsec.aika.user.UserServiceApplicationTests
//import com.parsec.aika.user.mapper.AppUserMapper
//import com.parsec.aika.user.model.em.RedisKeyPrefix
//import com.parsec.aika.user.model.entity.AppUserInfo
//import com.parsec.aika.user.model.vo.req.AppEmailVerifyReq
//import com.parsec.aika.user.model.vo.req.ResetPasswordReq
//import com.parsec.aika.user.model.vo.req.VerifyNewEmailReq
//import com.parsec.aika.user.service.EmailService
//import org.junit.jupiter.api.Assertions
//import org.junit.jupiter.api.Test
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
//
//@SpringBootTest
//internal class AppUserEmailControllerTest : UserServiceApplicationTests() {
//
//    @Resource
//    private lateinit var appUserEmailController: AppUserEmailController
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
////    @Test
////    @Rollback
////    @Transactional
////    @Sql("/sql/change_verify_new_email.sql")
////    fun verifyNewEmail() {
////        doNothing().`when`(emailService).sendMail(anyString(), anyString(), anyMap(), anyString())
////
////        val loginUser = LoginUserInfo().apply {
////            this.userId = 100001
////            this.username = "cee"
////            this.userType = UserTypeEnum.APPUSER
////        }
////        // 传入其他用户的绑定邮箱。报错
////        val req = VerifyNewEmailReq().apply {
////            this.email = "123452@qq.com"
////        }
////        try {
////            appUserEmailController.verifyNewEmail(req, loginUser)
////            Assertions.fail()
////        } catch (_: Exception) {
////        }
////    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/change_verify_new_email.sql")
//    fun forgotPasswordSendEmail() {
//        doNothing().`when`(emailService).sendMail(anyString(), anyString(), anyMap(), anyString())
//
//        // 传入不存在的邮箱，报错
//        try {
//            appUserEmailController.forgotPasswordSendEmail(VerifyNewEmailReq().apply {
//                this.email = "12341110000@qq.com"
//            })
//            Assertions.fail()
//        } catch (_: Exception) {
//        }
//        // 传入正确的邮箱
//        val result = appUserEmailController.forgotPasswordSendEmail(VerifyNewEmailReq().apply {
//            this.email = "123451@qq.com"
//        })
//        Assertions.assertEquals(result.code, 0)
//    }
//
////    @Test
////    @Rollback
////    @Transactional
////    @Sql("/sql/change_verify_new_email.sql")
//    fun resetPassword() {
//        doNothing().`when`(emailService).sendMail(anyString(), anyString(), anyMap(), anyString())
//
//        // 传入错误的clientCode，报错
//        try {
//            appUserEmailController.resetPassword(ResetPasswordReq().apply {
//                this.clientCode = "234"
//                this.password = "12"
//            })
//            Assertions.fail()
//        } catch (_: Exception) {
//        }
//        // 为测试重置密码接口，先调用密切相关的前置接口”忘记密码——发送邮件“
//        // 发送忘记密码重置密码邮箱链接
//        appUserEmailController.forgotPasswordSendEmail(VerifyNewEmailReq().apply {
//            this.email = "123451@qq.com"
//        })
//        // 得到当前传入的email对应的对象
//        var userInfo = appUserMapper.selectOne(
//            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, "123451@qq.com").last("limit 1")
//        )
//        // 删除该对象
//        appUserMapper.deleteById(userInfo.id)
//        // 传入正确的clientCode，但该数据已不存在，报错
//        try {
//            val emailHash =
//                (Math.abs("${userInfo.email}+${userInfo.lastLoginAt}".hashCode()) % Long.MAX_VALUE).toString()
//            appUserEmailController.resetPassword(ResetPasswordReq().apply {
//                this.clientCode = "$emailHash"
//                this.password = "43323"
//            })
//            Assertions.fail()
//        } catch (_: Exception) {
//        }
//
//        // 发送忘记密码重置密码邮箱链接
//        appUserEmailController.forgotPasswordSendEmail(VerifyNewEmailReq().apply {
//            this.email = "123453@qq.com"
//        })
//        // 得到当前传入的email对应的对象
//        userInfo = appUserMapper.selectOne(
//            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, "123453@qq.com").last("limit 1")
//        )
//        val emailHash = (Math.abs("${userInfo.email}+${userInfo.lastLoginAt}".hashCode()) % Long.MAX_VALUE).toString()
//        appUserEmailController.resetPassword(ResetPasswordReq().apply {
//            this.clientCode = "$emailHash"
//            this.password = "345678"
//        })
//        // 查询修改密码后的用户信息
//        userInfo = appUserMapper.selectById(userInfo.id)
//        Assertions.assertEquals(userInfo.password, DigestUtil.sha256Hex("345678"))
//    }
//
//
//    @Test
//    @Rollback
//    @Transactional
//    fun useTerms() {
//        val result = appUserEmailController.useTerms()
//        Assertions.assertEquals(result.code, 0)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    fun confidentialityPolicy() {
//        val result = appUserEmailController.confidentialityPolicy()
//        Assertions.assertEquals(result.code, 0)
//    }
//
////    @Test
////    @Rollback
////    @Transactional
////    @Sql("/sql/register_verify_email.sql")
//    fun registerEmailVerifyTest() {
//        val vo = AppEmailVerifyReq()
//        // 不传入clientCode，报错
//        try {
//            appUserEmailController.registerEmailVerify(vo)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "clientCode不能为空")
//        }
//
//        // 传入错误的clientCode
//        vo.clientCode = "sdf443"
//        try {
//            appUserEmailController.registerEmailVerify(vo)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "无效的clientCode")
//        }
//
//        // 传入正确的clientCode，但是里面的用户id对应数据不存在
//        try {
//            val testEmail = "1234567821@qq.com"
//            // 生成email的hash值，再保存到redis中，确保通过clientCode，能从redis中获取到值，不会报“clientCode无效”，但该redis中保存的值中userId没对应的值，会报错
//            val emailHash = (Math.abs(testEmail.hashCode()) % Long.MAX_VALUE).toString()
//            // 将用户校验码与用户ID作为值，以邮箱hash作为键，存储到Redis中，并设置5分钟的过期时间
//            stringRedisTemplate.opsForValue()
//                .set("${RedisKeyPrefix.verifyEmail}$emailHash", "21212121:${testEmail}", 5, TimeUnit.MINUTES)
//            vo.clientCode = emailHash
//            appUserEmailController.registerEmailVerify(vo)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "user does not exist")
//        }
//
//        // 传入正确的clientCode，修改其状态为uncompleted，并设置邮箱注册验证时间
//        val testEmail = "123456321@qq.com"
//        val testUserId = 100001
//        // 修改前，通过id得到数据
//        val appUser = appUserMapper.selectById(testUserId)
//        Assertions.assertNull(appUser.registerTime)
//        Assertions.assertNotEquals(appUser.status, UserStatus.uncompleted)
//        // 设置clientCode并保存到redis中
//        val emailHash = (Math.abs(testEmail.hashCode()) % Long.MAX_VALUE).toString()
//        // 将用户校验码与用户ID作为值，以邮箱hash作为键，存储到Redis中，并设置5分钟的过期时间
//        val verifyCode = ((Math.random() * 9 + 1) * 100000).toInt()
//        stringRedisTemplate.opsForValue().set(
//            "${RedisKeyPrefix.verifyEmail}$emailHash", "${testUserId}:${testEmail}:${verifyCode}", 5, TimeUnit.MINUTES
//        )
//        vo.clientCode = emailHash
//        vo.verifyCode = verifyCode.toString()
//        // 调用接口成功
//        val result = appUserEmailController.registerEmailVerify(vo)
//        Assertions.assertEquals(result.code, 0)
//        // 查询修改后的数据
//        val appUserAfter = appUserMapper.selectById(testUserId)
//        Assertions.assertEquals(appUserAfter.status, UserStatus.uncompleted)
//        Assertions.assertNotNull(appUserAfter.registerTime)
//    }
//}