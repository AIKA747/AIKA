package com.parsec.aika.user.controller

import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource
import kotlin.test.assertContains

@SpringBootTest
internal class AppTagsControllerTest {

    @Resource
    private lateinit var appTagsController: AppTagsController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/interest_tag_init.sql")
    fun getTagList() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100001
            this.username = "cee"
            this.userType = UserTypeEnum.APPUSER
        }
        val result = appTagsController.getTagList(PageVo().apply {
            this.pageNo = 1
            this.pageSize = 10
        }, loginUser)
        assertEquals(result.code, 0)
        // 查询出来的数据都为未删除的
        assertTrue(result.data.list.size > 0)
        // 查不出来的标签不包括“测试0002”——测试sql中，删除状态为删除状态的
        // “测试0002”为删除状态，查询出来的数据不应该包含它
//        assertContains(result.data.list, "测试0001")
        assertFalse(result.data.list.contains("测试0002"))
        assertContains(result.data.list, "测试0003")
    }
}
