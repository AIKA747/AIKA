package com.parsec.aika.content.controller.manage

import cn.hutool.json.JSONUtil
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.ManageCategoryReq
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.transaction.annotation.Transactional

@Rollback
@Transactional
@SpringBootTest
@AutoConfigureMockMvc  // 确保MockMvc可用
class ManageCategoryControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    private lateinit var loginUserInfo: LoginUserInfo

    @BeforeEach
    fun setUp() {
        loginUserInfo = LoginUserInfo().apply {
            userId = 1L
            username = "testUser"
        }
    }

    @Test
    fun saveCategoryTest() {
        val manageCategoryReq = com.parsec.aika.common.model.vo.req.ManageCategoryReq().apply {
            name = "TestCategory 1"
        }
        // 执行POST请求
        mockMvc.perform(
            post("/manage/category").contentType(MediaType.APPLICATION_JSON)
                .content(JSONUtil.toJsonStr(manageCategoryReq)).header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0"))

        // 执行POST请求
        mockMvc.perform(
            post("/manage/category").contentType(MediaType.APPLICATION_JSON)
                .content(JSONUtil.toJsonStr(manageCategoryReq)).header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(
            jsonPath("$.code").value("-1")
        ).andExpect(jsonPath("$.msg").value("Category name already exists"))
    }

    @Test
    @Sql(value = ["/sql/category.sql"])
    fun updateCategoryTest() {
        val manageCategoryReq = com.parsec.aika.common.model.vo.req.ManageCategoryReq().apply {
            id = 1L
            name = "test3"
            weight = 1
        }
        // 执行POST请求
        mockMvc.perform(
            put("/manage/category").contentType(MediaType.APPLICATION_JSON)
                .content(JSONUtil.toJsonStr(manageCategoryReq)).header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("0"))

        //测试名称重复
        manageCategoryReq.name = "test2"
        // 执行POST请求
        mockMvc.perform(
            put("/manage/category").contentType(MediaType.APPLICATION_JSON)
                .content(JSONUtil.toJsonStr(manageCategoryReq)).header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value("-1"))
            .andExpect(jsonPath("$.msg").value("Category name already exists"))

    }


}
