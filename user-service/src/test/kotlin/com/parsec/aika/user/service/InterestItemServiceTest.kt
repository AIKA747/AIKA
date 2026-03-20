package com.parsec.aika.user.service

import com.parsec.aika.user.model.entity.AppUserInfo
import com.parsec.trantor.exception.core.BusinessException
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

/**
 * @author husu
 * @version 1.0
 * @date 2024/11/3.
 */
@SpringBootTest
class InterestItemServiceTest {

    @Resource
    lateinit var interestItemService: InterestItemService

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/interest_by_item_type.sql")
    fun testValidateVector(){
        AppUserInfo().let {
            it.sport = mapOf("1" to 1, "2" to 1)
            it.entertainment = mapOf("12" to 1)
            it.news = mapOf("13" to 1)
            it.gaming = mapOf("14" to 1)
            it.artistic = mapOf("2" to 1, "7" to 1, "15" to 1)
            it.lifestyle = mapOf("3" to 1, "16" to 1)
            it.technology = mapOf("17" to 1)
            it.social = mapOf("18" to 1)
            interestItemService.validateVector(it)
        }


        //测试验证方法，构造一个不通过的用户测试数据

        AppUserInfo().let {
            it.sport = mapOf("1" to 1)
            it.entertainment = mapOf("12" to 1)
            it.news = mapOf("13" to 1)
            it.gaming = mapOf("14" to 1)
            it.artistic = mapOf("2" to 1, "7" to 1, "15" to 1)
            it.lifestyle = mapOf("3" to 1, "16" to 1)
            it.technology = mapOf("17" to 1)
            it.social = mapOf("18" to 1)

            Assertions.assertThrows(BusinessException::class.java) {
                interestItemService.validateVector(it)
            }
        }
    }
}
