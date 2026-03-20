package com.parsec.aika.user.controller

import com.parsec.aika.user.UserServiceApplicationTests
import com.parsec.aika.user.model.vo.req.GetManageGroupReq
import com.parsec.aika.user.model.vo.req.PostManageGroupReq
import com.parsec.aika.user.model.vo.req.PutManageGroupReq
import org.junit.jupiter.api.Assertions
import org.springframework.boot.test.context.SpringBootTest
import java.time.LocalDateTime
import javax.annotation.Resource

@SpringBootTest
internal class ManageGroupControllerTest: UserServiceApplicationTests() {

    @Resource
    private lateinit var appGroupController: ManageGroupController

//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/user_page.sql")
    fun group() {
        // 新增
        appGroupController.postManageGroup(PostManageGroupReq().apply {
            this.groupName = "ces4"
        })

        // 编辑
        appGroupController.putManageGroup(PutManageGroupReq().apply {
            this.groupId = 100001
            this.groupName = "ces1"
        })

        // 删除
//        appGroupController.deleteManageGroupId(100002)

        // 列表
        val list = appGroupController.getManageGroup(GetManageGroupReq().apply { this.groupName = "ces" }).data.list
        Assertions.assertEquals(list.last().groupName, "ces1")
        Assertions.assertEquals(list.last().userCount, 11)
        Assertions.assertEquals(list.last().createdAt, LocalDateTime.parse("2023-12-25T14:59:54"))

    }


}