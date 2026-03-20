//package com.parsec.aika.user.controller
//
//import com.parsec.aika.common.model.em.UserStatus
//import com.parsec.aika.common.model.em.UserTypeEnum
//import com.parsec.aika.common.model.vo.LoginUserInfo
//import com.parsec.aika.user.mapper.AppUserMapper
//import com.parsec.aika.user.model.em.Gender
//import com.parsec.aika.user.model.vo.req.AppLoginByPwdReq
//import com.parsec.aika.user.model.vo.req.EditUserInfoReq
//import com.parsec.aika.user.model.vo.req.EditUserLocationReq
//import com.parsec.trantor.common.response.BaseResultCode
//import org.junit.jupiter.api.Assertions.*
//import org.junit.jupiter.api.Test
//import org.springframework.boot.test.context.SpringBootTest
//import org.springframework.test.annotation.Rollback
//import org.springframework.test.context.jdbc.Sql
//import org.springframework.transaction.annotation.Transactional
//import java.time.LocalDate
//import javax.annotation.Resource
//
//@SpringBootTest
//internal class AuthControllerTest {
//
//    @Resource
//    private lateinit var authController: AuthController
//
//    @Resource
//    private lateinit var appUserMapper: AppUserMapper
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/auth_user_login.sql")
//    fun appLoginByPwd() {
//        // 账号密码登录，传入错误账号
//        val loginReq = AppLoginByPwdReq().apply {
//            this.account = "23425"
//            this.password = "111111111"
//        }
//        try {
//            authController.appLoginByPwd(loginReq)
//            fail()
//        } catch (_: Exception) {
//        }
//        // 传入被禁用的账号密码
//        loginReq.account = "123401@qq.com"
//        loginReq.password = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
//        try {
//            authController.appLoginByPwd(loginReq)
//            fail()
//        } catch (_: Exception) {
//        }
//        // 传入错误的密码，账号正确
//        loginReq.account = "123430@qq.com"
//        loginReq.password = "123433356"
//        try {
//            authController.appLoginByPwd(loginReq)
//            fail()
//        } catch (_: Exception) {
//        }
//        // 传入正确的账号密码
//        loginReq.account = "123430@qq.com"
//        loginReq.password = "123456"
//        val loginResult = authController.appLoginByPwd(loginReq)
//        assertEquals(loginResult.code, 0)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/auth_user_login.sql")
//    fun appCurrentUserInfo() {
//        val loginUser = LoginUserInfo().apply {
//            userId = 100002
//            username = "ces03"
//            userType = UserTypeEnum.APPUSER
//            status = UserStatus.unverified
//        }
//        // 传入错误的用户id
//        loginUser.userId = 10001111
//        try {
//            authController.appCurrentUserInfo(loginUser)
//            fail()
//        } catch (_: Exception) {
//        }
//        // 传入正确的用户id
//        loginUser.userId = 100002
//        val userInfoResult = authController.appCurrentUserInfo(loginUser)
//        assertEquals(userInfoResult.code, BaseResultCode.SUCCESS.code())
//
//        //验证用户的昵称和生日
//        assertEquals("ces03",userInfoResult.data!!.nickname, )
//        assertEquals(LocalDate.of(1980,2,7),userInfoResult.data!!.birthday)
//        assertEquals("testbio",userInfoResult.data!!.bio)
//
//
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/auth_user_login.sql")
//    fun editUserInfo__birthday_string_equal_localDate() {
////        arrange
//        val loginUser = LoginUserInfo().apply {
//            userId = 100001
//        }
//        var editVo = EditUserInfoReq().apply {
//            this.birthday = "2024-01-02"
//            this.bio = "testbio1111"
//        }
//
////        act
//        authController.editUserInfo(editVo, loginUser)
//
////        assert
//        var userInfo = appUserMapper.selectById(loginUser.userId)
//        assertEquals(userInfo.birthday!!.year, 2024)
//        assertEquals(userInfo.birthday!!.monthValue, 1)
//        assertEquals(userInfo.birthday!!.dayOfYear, 2)
//        assertEquals("testbio1111",userInfo.bio)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/auth_user_login.sql")
//    fun editUserInfo__when_birthday_update_with_null__then_do_not_update() {
////        update null， 不做任何事情
////        arrange
//        val loginUser = LoginUserInfo().apply {
//            userId = 100001
//        }
////        act
//        var editVo = EditUserInfoReq().apply {
//            this.birthday = "2024-01-02"
//        }
//        authController.editUserInfo(editVo, loginUser)
//
//        editVo = EditUserInfoReq().apply {
//            this.birthday = null
//        }
//        authController.editUserInfo(editVo, loginUser)
//
////        assert
//        var userInfo = appUserMapper.selectById(loginUser.userId)
//        assertEquals(userInfo.birthday!!.year, 2024)
//        assertEquals(userInfo.birthday!!.monthValue, 1)
//        assertEquals(userInfo.birthday!!.dayOfYear, 2)
//    }
//
//
//
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/auth_user_login.sql")
//    fun editUserInfo__update_interestGender_showGender() {
////        测试新加字段 interestGender, showGender
//        val loginUser = LoginUserInfo().apply {
//            userId = 100001
//        }
//        var editVo = EditUserInfoReq().apply {
//            this.interestGender = Gender.FEMALE
//            this.showGender = true
//            this.occupation = "钓鱼佬"
//        }
//        authController.editUserInfo(editVo, loginUser)
//
//        var userInfo = appUserMapper.selectById(loginUser.userId)
//        assertEquals(userInfo.interestGender, editVo.interestGender)
//        assertEquals(userInfo.showGender, editVo.showGender)
//        assertEquals(userInfo.occupation, editVo.occupation)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/auth_user_login.sql")
//    fun editUserInfo() {
//        val loginUser = LoginUserInfo().apply {
//            username = "ces03"
//            userType = UserTypeEnum.APPUSER
//            status = UserStatus.unverified
//        }
//        var editVo = EditUserInfoReq().apply {
//            this.username = "112"
//            this.gender = Gender.HIDE
//        }
//        // 传入错误的用户id，报错
//        try {
//            loginUser.userId = 10001111
//            authController.editUserInfo(editVo, loginUser)
//            fail()
//        } catch (_: Exception) {
//        }
//        // 传入的用户的邮箱未验证，报错
//        try {
//            loginUser.userId = 100002
//            authController.editUserInfo(editVo, loginUser)
//            fail()
//        } catch (_: Exception) {
//        }
//        // 传入正确的数据
//        loginUser.userId = 100001
//        // 未修改用户信息前，原本的信息与传入的信息不同
//        var userInfo = appUserMapper.selectById(loginUser.userId)
//        assertNotEquals(userInfo.username, editVo.username)
//        assertNotEquals(userInfo.gender, editVo.gender)
//        // 修改用户信息
//        authController.editUserInfo(editVo, loginUser)
//        // 修改数据成功，并返回token
//        userInfo = appUserMapper.selectById(loginUser.userId)
//        assertEquals(userInfo.username, editVo.username)
//        assertEquals(userInfo.gender, editVo.gender)
//
//        // 如果用户信息之前未完善（状态为uncompleted），完善后（补充username、tags）状态会修改为enabled
//        assertEquals(userInfo.status, UserStatus.enabled)
//        // 完善username、tags
//        val list = mutableListOf<String>()
//        list.add("112")
//        list.add("1asdf")
//        editVo = EditUserInfoReq().apply {
//            this.username = "3456"
//            this.tags = list
//        }
//        authController.editUserInfo(editVo, loginUser)
//        userInfo = appUserMapper.selectById(loginUser.userId)
//        assertEquals(userInfo.status, UserStatus.enabled)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/auth_user_login.sql")
//    fun editUserLocation() {
//        val loginUser = LoginUserInfo().apply {
//            userId = 100000
//            username = "ces03"
//            userType = UserTypeEnum.APPUSER
//            status = UserStatus.enabled
//        }
//        authController.editUserLocation(EditUserLocationReq().apply {
//            this.curLat = 36.30556423523153
//            this.curLng = 104.48060937499996
//        }, loginUser)
//        val userInfo = appUserMapper.selectById(loginUser.userId)
//        assertEquals(userInfo.curLat, 36.30556423523153)
//        assertEquals(userInfo.curLng, 104.48060937499996)
//    }
//}
