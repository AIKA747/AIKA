package com.parsec.aika.user.service

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.controller.AppRecommendationController
import com.parsec.aika.user.mapper.TypicalUserVectorMapper
import com.parsec.aika.user.model.em.InterestItemType
import com.parsec.aika.user.model.entity.TypicalUserVector
import com.parsec.aika.user.service.impl.UserServiceImpl
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource
import kotlin.math.sqrt

/**
 * @author husu
 * @version 1.0
 * @date 2025/4/22.
 */
@SpringBootTest
@Rollback
@Transactional
class RecommendUserTest {



    @Resource
    private lateinit var userService: UserServiceImpl

    @Resource
    private lateinit var tuvMapper: TypicalUserVectorMapper


    @Resource
    private lateinit var recommendController: AppRecommendationController

    @Test
    @Sql("/sql/test_recommend_user.sql")
    fun testPrepareUserVector(){
        val user = userService.prepareUserInterestVector(1899773101947326465L)
        Assertions.assertEquals(5,user.sport!!.size)
        Assertions.assertEquals("6",user.sport!![0].key)
        Assertions.assertEquals(1,user.sport!![0].value)

        Assertions.assertEquals("7",user.sport!![1].key)
        Assertions.assertEquals(0,user.sport!![1].value)


        Assertions.assertEquals("8",user.sport!![2].key)
        Assertions.assertEquals(0,user.sport!![2].value)


        Assertions.assertEquals("9",user.sport!![3].key)
        Assertions.assertEquals(1,user.sport!![3].value)

        Assertions.assertEquals("10",user.sport!![4].key)
        Assertions.assertEquals(1,user.sport!![4].value)

        Assertions.assertEquals(sqrt(user.sport!!.size.toDouble()),user.sportMaxDistance)
        Assertions.assertEquals(sqrt(user.news!!.size.toDouble()),user.newsMaxDistance)
        Assertions.assertEquals(sqrt(user.artistic!!.size.toDouble()),user.artisticMaxDistance)
        Assertions.assertEquals(sqrt(user.gaming!!.size.toDouble()),user.gamingMaxDistance)
        Assertions.assertEquals(sqrt(user.entertainment!!.size.toDouble()),user.entertainmentMaxDistance)
        Assertions.assertEquals(sqrt(user.lifestyle!!.size.toDouble()),user.lifestyleMaxDistance)
        Assertions.assertEquals(sqrt(user.technology!!.size.toDouble()),user.technologyMaxDistance)
        Assertions.assertEquals(sqrt(user.social!!.size.toDouble()),user.socialMaxDistance)


    }


    @Test
    @Sql("/sql/test_recommend_user.sql")
    fun testTypicalUserVector(){
        userService.initTypicalUsers()

        tuvMapper.selectList(KtQueryWrapper(TypicalUserVector::class.java).eq(TypicalUserVector::type,InterestItemType.SPORT)).apply {
            Assertions.assertTrue(this.size > 0 )
            Assertions.assertNotNull(this[0].distance)
            println(this[0].distance)
            Assertions.assertNotNull(this[1].distance)
            println(this[1].distance)

            Assertions.assertNotNull(this[2].distance)
            Assertions.assertNotNull(this[3].distance)
            Assertions.assertNotNull(this[4].distance)

        }
    }

    @Test
    @Sql("/sql/test_recommend_user.sql")
    fun testRecommendUser() {
        val list = userService.getRecommendUserList(1899773101947326465L)
        Assertions.assertTrue(list.isNotEmpty())
        Assertions.assertNotNull(list[0].distance)
        println(list[0].distance)
        Assertions.assertTrue(list[0].distance!! < 1.0)
        Assertions.assertTrue(list[1].distance!! < 1.0)
        Assertions.assertTrue(list[2].distance!! < 1.0)
        Assertions.assertTrue(list[3].distance!! < 1.0)
        Assertions.assertTrue(list[4].distance!! < 1.0)
        Assertions.assertTrue(list[0].distance!! < list[1].distance!!)
        Assertions.assertTrue(list[1].distance!! < list[2].distance!!)
        Assertions.assertTrue(list[2].distance!! < list[3].distance!!)
        Assertions.assertTrue(list[3].distance!! < list[4].distance!!)
        println(list[0].distance!!)
        println(list[1].distance!!)
        println(list[2].distance!!)
        println(list[3].distance!!)
        println(list[4].distance!!)
    }

    @Test
    @Sql("/sql/test_recommend_user.sql")
    fun testController(){
       val result = recommendController.recommendationUserList(LoginUserInfo().apply { this.userId = 1899773101947326465L })
        Assertions.assertTrue(result.data.size!! > 0)
    }
}
