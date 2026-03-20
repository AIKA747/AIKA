package com.parsec.aika.user.controller

import cn.hutool.core.bean.BeanUtil
import com.alibaba.fastjson.JSONArray
import com.alibaba.fastjson.JSONObject
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.mapper.InterestItemMapper
import com.parsec.aika.user.model.em.InterestItemType
import com.parsec.aika.user.model.vo.req.InterestItemCreateVo
import com.parsec.aika.user.model.vo.req.InterestItemQueryVo
import com.parsec.aika.user.model.vo.req.InterestItemUpdateVo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class ManageInterestItemControllerTest {

    @Resource
    private lateinit var interestItemController: ManageInterestItemController

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
    fun testCreate() {
        val vo = InterestItemCreateVo().apply {
            this.itemName = "测试1"
            this.itemType = InterestItemType.TECHNOLOGY
            this.remark = "测试multiple=true"
            this.multiple = true
            // 构造一个 valueArray, valueArray中需要包含：optName和 value 字段
            val jsonArray = JSONArray()
            val jsonObject = JSONObject()
            jsonObject["optName"] = "roller"
            jsonObject["value"] = "1"
            jsonArray.add(jsonObject)
            jsonObject["optName"] = "skis"
            jsonObject["value"] = "3"
            jsonArray.add(jsonObject)
            this.valueArray = jsonArray
        }

        val result = interestItemController.createItem(vo, userInfo)
        assertEquals(result.code, 0)
        // 新增接口调用成功后，返回成功后的标签id
        val saveVo = interestItemMapper.selectById(result.data)
        assertEquals(saveVo.id, result.data)
        assertEquals(saveVo.itemName, vo.itemName)
        assertNotNull(saveVo.orderNum)

        val v01 = InterestItemCreateVo().apply {
            this.itemName = "测试2"
            this.itemType = InterestItemType.NEWS
            this.remark = "测试multiple=false"
            this.multiple = false
        }

        val result01 = interestItemController.createItem(v01, userInfo)
        assertEquals(result01.code, 0)
        // 新增接口调用成功后，返回成功后的标签id
        val saveVo01 = interestItemMapper.selectById(result01.data)
        assertEquals(saveVo01.id, result01.data)
        assertEquals(saveVo01.itemName, v01.itemName)
        assertNotNull(saveVo01.orderNum)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/interest_item_init.sql")
    fun testUpdateItem() {
        var item = interestItemMapper.selectById(1)
        // 传入存在的id，其他数据已经有的标签名称
        item.itemName = "测试2"
        try {
            var updateVo = InterestItemUpdateVo()
            BeanUtil.copyProperties(item, updateVo)
            interestItemController.updateItem(updateVo, userInfo)
            fail()
        } catch (e: Exception) {
        }

        // 传入id不对应的标签名称
        item.itemName = "测试666"
        item.orderNum = 1
        item.multiple = true
        item.valueArray = JSONArray()
        item.valueArray!!.add(JSONObject().apply {
            this["optName"] = "roller"
            this["value"] = "1"
        })

        var updateVo = InterestItemUpdateVo()
        BeanUtil.copyProperties(item, updateVo)
        interestItemController.updateItem(updateVo, userInfo)

        var result = interestItemController.updateItem(updateVo, userInfo)
        assertEquals(result.code, 0)
        var afterVo = interestItemMapper.selectById(1)
        assertNotNull(afterVo)
        assertEquals(afterVo.itemName, item.itemName)
        assertEquals(afterVo.orderNum, item.orderNum)
        assertTrue(!afterVo.valueArray.isNullOrEmpty())

    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/interest_item_init.sql")
    fun testList() {
        val queryVo = InterestItemQueryVo()
        queryVo.itemName = "测试4"
        queryVo.itemType = InterestItemType.ENTERTAINMENT
        var result = interestItemController.getItemList(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        // 查询到的数据都是未删除的
        result.data.list.map {
            assertFalse(interestItemMapper.selectById(it.id).deleted!!)
            assertNotNull(it.valueArray)
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/interest_item_init.sql")
    fun testDelete() {
        val id = 1
        // 删除前，能查询到数据
        val beforeTag = interestItemMapper.selectById(id)
        assertNotNull(beforeTag)
        // 删除
        val result = interestItemController.deleteItem(id, userInfo)
        assertEquals(result.code, 0)
        // 删除后，查询到的数据为空
        val afterTag = interestItemMapper.selectById(id)
        assertNull(afterTag)
    }

}
