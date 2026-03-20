package com.parsec.aika.user.controller

import cn.hutool.crypto.digest.DigestUtil
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.UserServiceApplicationTests
import com.parsec.aika.user.mapper.AppUserMapper
import com.parsec.aika.user.model.em.Gender
import com.parsec.aika.user.model.vo.req.ManageUserListReq
import com.parsec.aika.user.model.vo.req.ManageUserStatusReq
import com.parsec.aika.user.model.vo.req.UpdatePasswordReq
import com.parsec.aika.user.model.vo.resp.PostManageGroupUserReq
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource

@SpringBootTest
internal class ManageUserControllerTest : UserServiceApplicationTests() {

    @Resource
    private lateinit var manageUserController: ManageUserController

    @Resource
    private lateinit var manageGroupController: ManageGroupController

    @Resource
    private lateinit var appUserMapper: AppUserMapper

//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/user_page.sql")
    fun user() {
        val req = ManageUserListReq()
        req.status = UserStatus.enabled
        req.username = "ces"
        req.groupId = 100001
        req.phone = "183"
        req.email = "123451"
        req.gender = Gender.MALE
        req.country = "china"
        req.tags = "唱"
        req.minCreatedAt = "2023-12-24 14:59:54"
        req.maxCreatedAt = "2023-12-26 14:59:54"

        // 加入
        manageGroupController.postManageGroupUser(PostManageGroupUserReq().apply {
            this.groupId = 100001;this.userIds = listOf(100002, 100003)
        })

        // 用户列表
        val result = manageUserController.manageUserList(req)
        Assertions.assertEquals((result.data).total, 1)
        Assertions.assertEquals((result.data).list.last().username, "ces01")
        Assertions.assertEquals((result.data).list.last().phone, "18375729810")
        Assertions.assertEquals((result.data).list.last().email, "123451@qq.com")
        Assertions.assertEquals((result.data).list.last().gender, Gender.MALE)
        Assertions.assertEquals((result.data).list.last().status, UserStatus.enabled)
        Assertions.assertEquals((result.data).list.last().createdAt, LocalDateTime.parse("2023-12-25T14:59:54"))

        // ban用户
        manageUserController.manageUserStatus(ManageUserStatusReq().apply {
            this.userId = 1000001; this.status = UserStatus.disabled
        })

        // 用户详情
        val manageUser = manageUserController.getManageUser(1000001).data
        Assertions.assertEquals(manageUser.avatar, "http://www.avatar.com")
        Assertions.assertEquals(manageUser.bio, "my bio")
        Assertions.assertEquals(manageUser.botTotal, 11)
        Assertions.assertEquals(manageUser.country, "china")
        Assertions.assertEquals(manageUser.email, "123451@qq.com")
        Assertions.assertEquals(manageUser.followerTotal, 11)
        Assertions.assertEquals(manageUser.gender, Gender.MALE)
        Assertions.assertEquals(manageUser.phone, "18375729810")
        Assertions.assertEquals(manageUser.status, UserStatus.disabled)
        Assertions.assertEquals(manageUser.storyTotal, 11)
        Assertions.assertEquals(manageUser.subBotTotal, 11)
        Assertions.assertEquals(manageUser.username, "ces01")

        // 删除用户
        manageUserController.manageUser(1000001)

    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/auth_user_login.sql")
    fun updatePassword() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100000011
            this.username = "ces01"
        }
        val updatePwd = UpdatePasswordReq().apply {
            this.oldPwd = "123456"
            this.newPwd = "1111"
        }
        try {
            // 传入的登录用户不存在
            manageUserController.updatePassword(updatePwd, loginUser)
            Assertions.fail()
        } catch (_: Exception) {
        }
        loginUser.userId = 100000
        updatePwd.oldPwd = "11111"
        try {
            // 传入的原密码有误
            manageUserController.updatePassword(updatePwd, loginUser)
            Assertions.fail()
        } catch (_: Exception) {
        }
        updatePwd.oldPwd = "123456"
        updatePwd.newPwd = "123456"
        try {
            // 传入的新密码和原密码相同
            manageUserController.updatePassword(updatePwd, loginUser)
            Assertions.fail()
        } catch (_: Exception) {
        }
        // 传入正确格式且与原密码不同的新密码
        updatePwd.newPwd = "122121"
        val result = manageUserController.updatePassword(updatePwd, loginUser)
        Assertions.assertEquals(result.code, 0)

        // 查询该用户的密码，应该为传入的新密码
        val user = appUserMapper.selectById(loginUser.userId)
        Assertions.assertEquals(DigestUtil.sha256Hex(updatePwd.newPwd), user.password)
    }

}