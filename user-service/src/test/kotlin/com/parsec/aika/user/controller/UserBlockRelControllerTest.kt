package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.UserServiceApplicationTests
import com.parsec.aika.user.model.vo.req.ListBlockedUserReq
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class UserBlockRelControllerTest : UserServiceApplicationTests() {

    @Resource
    private lateinit var userBlockRelController: UserBlockRelController


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/auth_user_login.sql")
    fun listBlockedUser() {
        // 屏蔽两名用户
        userBlockRelController.block(100001, LoginUserInfo().apply { this.userId = 100000 })
        userBlockRelController.block(100002, LoginUserInfo().apply { this.userId = 100000 })

        Assertions.assertEquals(2, userBlockRelController.listBlockedUser(ListBlockedUserReq().apply { this.userId = 100000 }, LoginUserInfo().apply { this.userId = 100000 }).data.list.size)

        // 解除屏蔽
        userBlockRelController.unBlock(100001, LoginUserInfo().apply { this.userId = 100000 })
        val list = userBlockRelController.listBlockedUser(ListBlockedUserReq().apply { this.userId = 100000 }, LoginUserInfo().apply { this.userId = 100000 }).data.list
        Assertions.assertEquals(1, list.size)
        Assertions.assertEquals(100002, list[0].userId)
        Assertions.assertEquals(null, list[0].avatar)
        Assertions.assertEquals("ces03", list[0].nickname)
        Assertions.assertEquals("ces03", list[0].username)



    }

}