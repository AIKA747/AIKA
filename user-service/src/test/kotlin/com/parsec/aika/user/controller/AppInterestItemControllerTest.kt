package com.parsec.aika.user.controller

import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.mapper.InterestItemMapper
import com.parsec.aika.user.model.em.InterestItemType
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class AppInterestItemControllerTest {

    @Resource
    private lateinit var interestItemController: AppInterestItemController

    @Resource
    private lateinit var interestItemMapper: InterestItemMapper

    private var userInfo: LoginUserInfo = LoginUserInfo()

    @BeforeEach
    fun setBefore() {
        userInfo = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/interest_item_init.sql")
    fun testList() {
        InterestItemType.SPORT.let { itemType ->
            val result = interestItemController.getInterestItemList(itemType, userInfo)
            assertEquals(result.code, 0)
            assertTrue(result.data.isNotEmpty())
            result.data.map {
                assertEquals(itemType, interestItemMapper.selectById(it.id).itemType)
            }
        }

        InterestItemType.SOCIAL.let { itemType ->
            val result = interestItemController.getInterestItemList(itemType, userInfo)
            assertEquals(result.code, 0)
            assertTrue(result.data.isNotEmpty())
            result.data.map {
                assertEquals(itemType, interestItemMapper.selectById(it.id).itemType)
            }
        }

        InterestItemType.NEWS.let { itemType ->
            val result = interestItemController.getInterestItemList(itemType, userInfo)
            assertEquals(result.code, 0)
            assertTrue(result.data.isNotEmpty())
            result.data.map {
                assertEquals(itemType, interestItemMapper.selectById(it.id).itemType)
            }
        }

        InterestItemType.ENTERTAINMENT.let { itemType ->
            val result = interestItemController.getInterestItemList(itemType, userInfo)
            assertEquals(result.code, 0)
            assertTrue(result.data.isNotEmpty())
            result.data.map {
                assertEquals(itemType, interestItemMapper.selectById(it.id).itemType)
            }
            // 验证同一个类型，按orderNum正序排列
            assertEquals(4, result.data[0].id )
            assertEquals(5, result.data[1].id )
        }

        InterestItemType.ARTISTIC.let { itemType ->
            val result = interestItemController.getInterestItemList(itemType, userInfo)
            assertEquals(result.code, 0)
            assertTrue(result.data.isNotEmpty())
            result.data.map {
                assertEquals(itemType, interestItemMapper.selectById(it.id).itemType)
            }
            // 验证同一个类型，按orderNum正序排列
            assertEquals(7, result.data[0].id )
            assertEquals(2, result.data[1].id )
        }

        InterestItemType.LIFESTYLE.let { itemType ->
            val result = interestItemController.getInterestItemList(itemType, userInfo)
            assertEquals(result.code, 0)
            assertTrue(result.data.isNotEmpty())
            result.data.map {
                assertEquals(itemType, interestItemMapper.selectById(it.id).itemType)
            }
        }

        InterestItemType.TECHNOLOGY.let { itemType ->
            val result = interestItemController.getInterestItemList(itemType, userInfo)
            assertEquals(result.code, 0)
            assertTrue(result.data.isNotEmpty())
            result.data.map {
                assertEquals(itemType, interestItemMapper.selectById(it.id).itemType)
            }
        }
        InterestItemType.OTHER.let { itemType ->
            val result = interestItemController.getInterestItemList(itemType, userInfo)
            assertEquals(result.code, 0)
            assertTrue(result.data.isNotEmpty())
            result.data.map {
                assertNotEquals(itemType, interestItemMapper.selectById(it.id).itemType)
            }
            val types = result.data.map {
                it.itemType
            }.toList()

            assertEquals(7, result.data[0].id )
            assertEquals(2, result.data[1].id )
        }
        // 查询所有数据
        val result = interestItemController.getInterestItemList(null, userInfo)
        assertEquals(result.code, 0)
        assertEquals(10, result.data.size)
        // 优先按类型排序，然后按orderNum正序排列
        assertEquals(7, result.data[0].id )
        assertEquals(2, result.data[1].id )
    }
}
