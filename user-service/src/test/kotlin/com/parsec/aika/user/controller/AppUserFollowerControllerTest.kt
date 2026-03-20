package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.UserServiceApplicationTests
import com.parsec.aika.user.model.vo.req.UserAppFollowerLastReadTimeReq
import com.parsec.aika.user.model.vo.req.UserAppFollowerReq
import com.parsec.aika.user.model.vo.req.UserAppFollowingReq
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource

@SpringBootTest
internal class AppUserFollowerControllerTest: UserServiceApplicationTests() {

    @Resource
    private lateinit var appUserFollowerController: AppUserFollowerController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/follower_page.sql")
    fun follower() {
        // 关注我的粉丝列表
        val req = UserAppFollowerReq()
        val user = LoginUserInfo().apply { this.userId = 100001 }
        var result = appUserFollowerController.appFollower(req, user)
        Assertions.assertEquals((result.data).total, 2)
        Assertions.assertEquals((result.data).list[0].userId, 100003)
        Assertions.assertEquals((result.data).list[0].lastReadTime, LocalDateTime.parse("2023-12-25T14:59:54"))
        Assertions.assertEquals((result.data).list[0].username, "ces03")

        user.userId = 100002
        result = appUserFollowerController.appFollower(req, user)
        Assertions.assertEquals((result.data).total, 2)

        user.userId = 100003
        result = appUserFollowerController.appFollower(req, user)
        Assertions.assertEquals((result.data).total, 0)

        // 我关注的粉丝列表
        val req2 = UserAppFollowingReq()
        var result2 = appUserFollowerController.appFollowing(req2, user)
        Assertions.assertEquals((result2.data).total, 2)
        Assertions.assertEquals((result2.data).list[0].userId, 100002)
        Assertions.assertEquals((result2.data).list[0].lastReadTime, LocalDateTime.parse("2023-12-25T14:59:54"))
        Assertions.assertEquals((result2.data).list[0].username, "ces02")
        Assertions.assertEquals((result2.data).list[0].followerTotal, 0)
        Assertions.assertEquals((result2.data).list[0].storyTotal, 0)
        Assertions.assertEquals((result2.data).list[0].botTotal, 0)

        user.userId = 100001
        result2 = appUserFollowerController.appFollowing(req2, user)
        Assertions.assertEquals((result2.data).total, 1)

        // 标记关注用户最新更新已读
        val result3 = appUserFollowerController.appFollowerLastReadTime(UserAppFollowerLastReadTimeReq().apply { this.followingId = 100002 }, user)
        Assertions.assertEquals(result3.code, 0)

        // 关注用户
//        appUserFollowerController.appFollowing(AppFollowingReq().apply {  this.followingId = 100003 }, user)
//        result2 = appUserFollowerController.appFollowing(req2, user)
//        Assertions.assertEquals((result2.data).total, 2)
    }


}