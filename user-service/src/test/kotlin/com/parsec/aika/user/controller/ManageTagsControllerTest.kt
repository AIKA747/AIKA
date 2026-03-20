package com.parsec.aika.user.controller

import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.mapper.InterestTagsMapper
import com.parsec.aika.user.model.vo.req.ManageTagsCreateVo
import com.parsec.aika.user.model.vo.req.ManageTagsQueryVo
import com.parsec.aika.user.model.vo.req.ManageTagsUpdateSortNoVo
import com.parsec.aika.user.model.vo.req.ManageTagsUpdateVo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class ManageTagsControllerTest {

    @Resource
    private lateinit var tagsController: ManageTagsController

    @Resource
    private lateinit var tagsMapper: InterestTagsMapper

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
    @Sql("/sql/manage_interest_tag_init.sql")
    fun getTagList() {
        val queryVo = ManageTagsQueryVo()
        var result = tagsController.getTagList(queryVo, userInfo)
        assertEquals(result.code, 0)
        // 查询到的数据都是未删除的
        result.data.list.map {
            assertFalse(tagsMapper.selectById(it.id).deleted!!)
        }
        queryVo.tagName = "ces"
        result = tagsController.getTagList(queryVo, userInfo)
        // 根据传入的标签名称查询到的数据中标签名称包含传入的标签名称，且都是未删除的数据
        assertEquals(result.code, 0)
        // 查询到的数据都是未删除的
        result.data.list.map {
            assertFalse(tagsMapper.selectById(it.id).deleted!!)
            assertTrue(it.tagName!!.contains(queryVo.tagName!!))
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_interest_tag_init.sql")
    fun createTag() {
        val vo = ManageTagsCreateVo().apply {
            this.tagName = "测试0004"
            this.sortNo = 4
        }
        // 传入存在的标签名称
        vo.tagName = "测试0004"
        try {
            tagsController.createTag(vo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "标签名称已存在")
        }
        // 传入不存在的标签名称
        vo.tagName = "adf测试asdf989"
        val result = tagsController.createTag(vo, userInfo)
        assertEquals(result.code, 0)
        // 新增接口调用成功后，返回成功后的标签id
        val saveVo = tagsMapper.selectById(result.data)
        assertNotNull(saveVo)
        assertEquals(saveVo.id.toString(), result.data)
        assertEquals(saveVo.tagName, vo.tagName)
        assertEquals(saveVo.sortNo, vo.sortNo)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_interest_tag_init.sql")
    fun updateTag() {
        val vo = ManageTagsUpdateVo().apply {
            this.tagName = "adf"
            this.sortNo = 4
        }
        // 传入不存在的id
        vo.id = 100003534
        try {
            tagsController.updateTag(vo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该标签信息不存在")
        }
        // 传入存在的id，其他数据已经有的标签名称
        vo.id = 1000001
        vo.tagName = "测试0004"
        try {
            tagsController.updateTag(vo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "标签名称已存在")
        }
        // 传入id对应的标签名称
        vo.tagName = "测试0001"
        // 修改标签信息。修改前名称等于传入的名称，排序不等于传入的排序
        var beforeVo = tagsMapper.selectById(vo.id)
        assertNotNull(beforeVo)
        assertEquals(beforeVo.tagName, vo.tagName)
        assertNotEquals(beforeVo.sortNo, vo.sortNo)
        var result = tagsController.updateTag(vo, userInfo)
        assertEquals(result.code, 0)
        // 修改后，名称等于传入的名称，排序等于传入的排序
        var afterVo = tagsMapper.selectById(vo.id)
        assertNotNull(afterVo)
        assertEquals(afterVo.tagName, vo.tagName)
        assertEquals(afterVo.sortNo, vo.sortNo)

        // 传入id不对应的标签名称
        vo.tagName = "测试0为人24er"
        vo.sortNo = 23
        // 修改标签信息。修改前名称不等于传入的名称，排序不等于传入的排序
        beforeVo = tagsMapper.selectById(vo.id)
        assertNotNull(beforeVo)
        assertNotEquals(beforeVo.tagName, vo.tagName)
        assertNotEquals(beforeVo.sortNo, vo.sortNo)
        result = tagsController.updateTag(vo, userInfo)
        assertEquals(result.code, 0)
        // 修改后，名称等于传入的名称，排序等于传入的排序
        afterVo = tagsMapper.selectById(vo.id)
        assertNotNull(afterVo)
        assertEquals(afterVo.tagName, vo.tagName)
        assertEquals(afterVo.sortNo, vo.sortNo)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_interest_tag_init.sql")
    fun updateSortNoTag() {
        val vo = ManageTagsUpdateSortNoVo().apply {
            this.sortNo = 3
        }
        // 传入不存在的id
        vo.id = 100003534
        try {
            tagsController.updateSortNoTag(vo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该标签信息不存在")
        }
        // 传入存在的id
        vo.id = 1000001
        // 修改前的排序不等于传入的排序
        val beforeVo = tagsMapper.selectById(vo.id)
        assertNotNull(beforeVo)
        assertNotEquals(beforeVo.sortNo, vo.sortNo)
        val result = tagsController.updateSortNoTag(vo, userInfo)
        assertEquals(result.code, 0)
        // 修改后的排序等于传入的排序
        val afterVo = tagsMapper.selectById(vo.id)
        assertNotNull(afterVo)
        assertEquals(afterVo.sortNo, vo.sortNo)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_interest_tag_init.sql")
    fun deleteTag() {
        // 传入不存在的id
        try {
            tagsController.deleteTag(1221212, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该标签信息不存在")
        }
        // 传入存在的id
        val id = 1000003L
        // 删除前，能查询到数据
        val beforeTag = tagsMapper.selectById(id)
        assertNotNull(beforeTag)
        // 删除
        val result = tagsController.deleteTag(id, userInfo)
        assertEquals(result.code, 0)
        // 删除后，查询到的数据为空
        val afterTag = tagsMapper.selectById(id)
        assertNull(afterTag)
    }
}