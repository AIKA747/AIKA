//package com.parsec.aika.user.controller
//
//import cn.hutool.crypto.digest.DigestUtil
//import cn.hutool.json.JSONObject
//import cn.hutool.json.JSONUtil
//import cn.hutool.jwt.JWTUtil
//import cn.hutool.log.StaticLog
//import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
//import com.parsec.aika.common.model.vo.LoginUserInfo
//import com.parsec.aika.user.mapper.AppUserMapper
//import com.parsec.aika.user.model.entity.AppUserInfo
//import com.parsec.aika.user.model.vo.req.AppEmailVerifyReq
//import com.parsec.aika.user.model.vo.req.AppVerifyEmailReq
//import com.parsec.aika.user.model.vo.req.VerifyNewEmailReq
//import org.junit.jupiter.api.Test
//import org.springframework.beans.factory.annotation.Autowired
//import org.springframework.beans.factory.annotation.Value
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
//import org.springframework.boot.test.context.SpringBootTest
//import org.springframework.http.MediaType
//import org.springframework.test.annotation.Rollback
//import org.springframework.test.context.jdbc.Sql
//import org.springframework.test.web.servlet.MockMvc
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
//import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
//import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
//import org.springframework.transaction.annotation.Transactional
//import javax.annotation.Resource
//import kotlin.test.assertEquals
//
//@AutoConfigureMockMvc  // 确保MockMvc可用
//@SpringBootTest
//class EmailVerifyTest {
//
//    @Autowired
//    private lateinit var mockMvc: MockMvc
//
//    @Resource
//    private lateinit var appUserMapper: AppUserMapper
//
//    @Value("\${jwt.key}")
//    private lateinit var jwtKey: String
//
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql(scripts = ["classpath:sql/register_verify_email.sql"])
//    fun verifyRegisterEmail() {
//        val req = AppVerifyEmailReq().apply {
//            this.email = "123456@qq.com"
//            this.password = "abc123456."
//            this.country = ""
//            this.language = ""
//        }
//        // 已注册用户发送验证码
//        mockMvc.perform(
//            post("/public/v2/verify-email").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
//        ).andExpect(status().isOk).andExpect(jsonPath("$.msg").value("An account with this email already exists"))
//        //已存在但未验证邮箱发送验证码
//        req.email = "123456321@qq.com"
//        val mvcResult = mockMvc.perform(
//            post("/public/v2/verify-email").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
//        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0")).andReturn()
//        val resultBody = mvcResult.response.contentAsString
//        val clientCode = JSONObject(resultBody).getJSONObject("data").getStr("clientCode")
//        //注册验证
//        val verifyReq = AppEmailVerifyReq().apply {
//            this.clientCode = clientCode
//            this.verifyCode = "123456"
//        }
//        //验证码错误的情况
//        mockMvc.perform(
//            put("/public/register-email-verify").contentType(MediaType.APPLICATION_JSON)
//                .content(JSONUtil.toJsonStr(verifyReq))
//        ).andExpect(status().isOk)
//            .andExpect(jsonPath("$.msg").value("The verification code is incorrect"))
//        //正确的验证码
//        verifyReq.verifyCode = "666666"
//        val result = mockMvc.perform(
//            put("/public/register-email-verify").contentType(MediaType.APPLICATION_JSON)
//                .content(JSONUtil.toJsonStr(verifyReq))
//        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0")).andReturn()
//        val resultBody1 = result.response.contentAsString
//        //校验token有效性
//        val token = JSONUtil.parseObj(resultBody1).getStr("data")
//        assert(JWTUtil.verify(token, jwtKey.toByteArray()))
//        //校验数据库email唯一
//        val count = appUserMapper.selectCount(KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, req.email))
//        assertEquals(count, 1)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql(scripts = ["classpath:sql/update_email_verify.sql"])
//    fun verifyUpdateEmail() {
//        val userInfo = LoginUserInfo().apply {
//            userId = 100003
//            email = "123453@qq.com"
//        }
//        val req = VerifyNewEmailReq().apply {
//            //未使用的邮箱
//            email = "779231374@qq.com"
//        }
//        //参数缺失验证
////        mockMvc.perform(
////            post("/app/user-email/verify").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
////                .header("userInfo", JSONUtil.toJsonStr(userInfo))
////        ).andExpect(status().isOk).andExpect(jsonPath("$.msg").value("password can not empty")).andReturn()
//
//        //密码错误验证
////        req.password = "3215646798"
////        mockMvc.perform(
////            post("/app/user-email/verify").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
////                .header("userInfo", JSONUtil.toJsonStr(userInfo))
////        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("-1"))
////            .andExpect(jsonPath("$.msg").value("Invalid password")).andReturn()
//
//        //正确的验证
//        req.password = "asdfjs234@erou"
//        val mvcResult = mockMvc.perform(
//            post("/app/user-email/verify").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
//                .header("userInfo", JSONUtil.toJsonStr(userInfo))
//        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0")).andReturn()
//        val clientCode = JSONObject(mvcResult.response.contentAsString).getStr("data")
//        //验证邮箱
//        val verifyReq = AppEmailVerifyReq().apply {
//            this.clientCode = clientCode
//            this.verifyCode = "123456"
//        }
//        //验证码错误的情况
//        mockMvc.perform(
//            put("/public/register-email-verify").contentType(MediaType.APPLICATION_JSON)
//                .content(JSONUtil.toJsonStr(verifyReq))
//        ).andExpect(status().isOk)
//            .andExpect(jsonPath("$.msg").value("The verification code is incorrect"))
//        //正确的验证码
//        verifyReq.verifyCode = "666666"
//        val result = mockMvc.perform(
//            put("/public/register-email-verify").contentType(MediaType.APPLICATION_JSON)
//                .content(JSONUtil.toJsonStr(verifyReq))
//        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0")).andReturn()
//
//        val resultBody = result.response.contentAsString
//        //校验token有效性
//        val token = JSONUtil.parseObj(resultBody).getStr("data")
//        assert(JWTUtil.verify(token, jwtKey.toByteArray()))
//        //校验邮箱是否已修改
//        val appUserInfo = appUserMapper.selectById(userInfo.userId)
//        assertEquals(appUserInfo.email, req.email)
//        //已被使用的邮箱
//        req.email = "123454@qq.com"
//        mockMvc.perform(
//            post("/app/user-email/verify").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
//                .header("userInfo", JSONUtil.toJsonStr(userInfo))
//        ).andExpect(status().isOk)
//            .andExpect(jsonPath("$.msg").value("This email has already been registered and cannot be duplicated"))
//
//        //更换为已存在但是未验证通过的邮箱
//        req.email = "123451@qq.com"
//        val mvcResult1 = mockMvc.perform(
//            post("/app/user-email/verify").contentType(MediaType.APPLICATION_JSON).content(JSONUtil.toJsonStr(req))
//                .header("userInfo", JSONUtil.toJsonStr(userInfo))
//        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0")).andReturn()
//        val clientCode1 = JSONObject(mvcResult1.response.contentAsString).getStr("data")
//        //验证新邮箱
//        verifyReq.clientCode = clientCode1
//        val result1 = mockMvc.perform(
//            put("/public/register-email-verify").contentType(MediaType.APPLICATION_JSON)
//                .content(JSONUtil.toJsonStr(verifyReq))
//        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0")).andReturn()
//        val resultBody1 = result1.response.contentAsString
//        //校验token有效性
//        val token1 = JSONUtil.parseObj(resultBody1).getStr("data")
//        assert(JWTUtil.verify(token1, jwtKey.toByteArray()))
//        //校验邮箱是否已修改
//        val appUserInfo1 = appUserMapper.selectById(userInfo.userId)
//        assertEquals(appUserInfo1.email, req.email)
//        //校验数据库email唯一
//        val count = appUserMapper.selectCount(KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::email, req.email))
//        assertEquals(count, 1)
//    }
//
//    @Test
//    fun userPwd() {
//        val password = "asdfjs234@erou"
//        StaticLog.info(DigestUtil.sha256Hex(password))
//    }
//}
