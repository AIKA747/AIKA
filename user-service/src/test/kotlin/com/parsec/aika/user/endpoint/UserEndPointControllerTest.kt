package com.parsec.aika.user.endpoint

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class UserEndPointControllerTest {

    @Resource
    private lateinit var userEndPointController: UserEndPointController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/feign_user_init.sql")
    fun feignUserCountryTest() {
        val countryList = userEndPointController.feignUserCountry().data
        // 能查询到数据
        assertNotNull(countryList)
        // 查询到的数据是已经去重的数据
        assertEquals(countryList.size, countryList.toSet().size)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/feign_user_init.sql")
    fun feignUserNumsTest() {
        val result = userEndPointController.feignUserNums("20240122", "成都")
        assertEquals(result.code, 0)
        assertEquals(result.data.totalUsers, 3)
        assertEquals(result.data.newUsers, 1)
        assertEquals(result.data.activeUsers, 2)
        assertEquals(result.data.inactiveUsers, 1)
    }
}