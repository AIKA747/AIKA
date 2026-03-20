package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.UserServiceApplicationTests
import com.parsec.aika.user.remote.BotFeignClient
import com.parsec.trantor.common.response.BaseResult
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource
import kotlin.test.assertEquals

@SpringBootTest
internal class AppUserControllerTest : UserServiceApplicationTests() {

    @Resource
    private lateinit var appUserController: AppUserController


    @Mock
    private lateinit var botFeignClient: BotFeignClient

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/follower_page.sql")
    fun user() {
        var appUser = appUserController.getAppUser(100001, LoginUserInfo().apply { this.userId = 100002 }).data
        assertEquals(null, appUser.gender)
        assertEquals(0, appUser.botTotal)
        assertEquals(0, appUser.storyTotal)
        assertEquals(0, appUser.followerTotal)
        assertEquals(null, appUser.avatar)
        assertEquals("ces01", appUser.username)
        assertEquals(true, appUser.followed)

        appUser = appUserController.getAppUser(100001, LoginUserInfo().apply { this.userId = 100005 }).data
        assertEquals(false, appUser.followed)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/username_validation_init.sql")
    fun checkUsernameAvailable_success() {
        val username = "availableUser"
        val loginUserInfo = LoginUserInfo().apply {
            userId = 1L
            this.username = "test"
            this.email = "test@test.com"
        }

        `when`(botFeignClient.checkBotNameExists(username)).thenReturn(BaseResult.success(false))

        appUserController.checkUsernameAvailable(username, loginUserInfo).let {
            Assertions.assertEquals(0, it!!.code)
        }    

       // ces04 是被删除了的，所以也应该可以注册
        appUserController.checkUsernameAvailable("ces04", loginUserInfo).let {
            Assertions.assertEquals(0, it!!.code)
        }

        // ces01 是已经存在的，所以不应该可以注册
        appUserController.checkUsernameAvailable("ces01", loginUserInfo).let {
            Assertions.assertEquals(-1, it!!.code)
            Assertions.assertEquals("Username already exists", it!!.msg)
        }
    }

    @Test
    @Rollback
    @Transactional
    fun check_user_name_blank() {
        val username = "my love"
        val loginUserInfo = LoginUserInfo().apply {
            userId = 1L
            this.username = "test"
            this.email = "test@test.com"
        }

        `when`(botFeignClient.checkBotNameExists(username)).thenReturn(BaseResult.success(false))

        appUserController.checkUsernameAvailable(username, loginUserInfo).let {
            Assertions.assertEquals(-1, it!!.code)
            Assertions.assertEquals("Username cannot contain spaces", it!!.msg)
        }
    }
}
