package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@Rollback
@Transactional
@SpringBootTest
class FirebaseUserTokenControllerTest {

    @Resource
    private lateinit var firebaseUserTokenController: FirebaseUserTokenController

    @Test
    fun testBind() {
        val token = "token"
        val loginUserInfo = LoginUserInfo()
        loginUserInfo.userId = 1
        val result = firebaseUserTokenController.bind(token, loginUserInfo)
        println(result)
    }

}