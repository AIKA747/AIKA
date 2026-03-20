//package com.parsec.aika.user.service
//
//import com.parsec.aika.user.mapper.FollowerMapper
//import com.parsec.aika.user.model.em.FollowMethod
//import com.parsec.aika.user.model.vo.req.AppFollowFriendsReq
//import com.parsec.aika.user.model.vo.req.AppFollowOrCancelReq
//import org.junit.jupiter.api.Assertions.assertEquals
//import org.junit.jupiter.api.Assertions.assertNotNull
//import org.junit.jupiter.api.Test
//import org.springframework.boot.test.context.SpringBootTest
//import org.springframework.test.annotation.Rollback
//import org.springframework.test.context.jdbc.Sql
//import org.springframework.transaction.annotation.Transactional
//import javax.annotation.Resource
//
//@SpringBootTest
//class FollowerServiceTest {
//
//    @Resource
//    lateinit var followerService: FollowerService
//
//    @Resource
//    lateinit var followerMapper: FollowerMapper
//
//    @Test
//    @Rollback
//    @Transactional
//    fun appFollowOrCancel__whenRecordNotExists__thenInsertNewRecord() {
//        val userId = 1L
//        val followingId = 2L
//        val req = AppFollowOrCancelReq().apply {
//            this.userId = userId
//            this.followingId = followingId
//            this.method = FollowMethod.FOLLOW
//        }
//
//
//        followerService.appFollowOrCancel(req)
//
//        val follower = followerMapper.selectByUidAndFollowingId(userId, followingId)
//        assertNotNull(follower)
//        assertEquals(1, follower?.uf)  // 验证 uf 是否为 1
//        assertEquals(0, follower?.fu)  // 验证 fu 是否为 0
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    fun appFollowOrCancel__whenRecordExists__thenUpdateUfField() {
//        val userId = 1L
//        val followingId = 2L
//        val req =
//            AppFollowOrCancelReq().apply { this.userId = userId; this.followingId = followingId; method =  FollowMethod.FOLLOW }
//
//        followerService.appFollowOrCancel(req)
//
//        val follower = followerMapper.selectByUidAndFollowingId(userId, followingId)
//        assertNotNull(follower)
//        assertEquals(1, follower?.uf)  // 确认 uf 被设置为 1
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    fun appFollowOrCancel__whenCancelAndFollowAgain__thenUfSetTo1() {
//        val userId = 1L
//        val followingId = 2L
//        val req = AppFollowOrCancelReq().apply { this.userId = userId; this.followingId = followingId; method = FollowMethod.CANCEL }
//
//        followerService.appFollowOrCancel(req)
//
//        val follower = followerMapper.selectByUidAndFollowingId(userId, followingId)
//        assertNotNull(follower)
//        assertEquals(0, follower?.uf)  // 确认 uf 被设置为 0
//
//        // 取消关注后，再次关注
//        req.method = FollowMethod.FOLLOW
//        followerService.appFollowOrCancel(req)
//
//        followerMapper.selectByUidAndFollowingId(followingId, userId).let {
//            assertNotNull(it)
//            assertEquals(1, it?.uf)
//            assertEquals(0, it?.fu)
//        }
//
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    fun appFollowOrCancel__mutualFollowOperation() {
//        val userId = 1L
//        val followingId = 2L
//
//        // 用户1关注用户2
//        followerService.appFollowOrCancel(
//            AppFollowOrCancelReq().apply {
//
//                this.userId = userId
//                this.followingId = followingId
//                this.method = FollowMethod.FOLLOW
//            }
//        )
//        var follower = followerMapper.selectByUidAndFollowingId(userId, followingId)
//        assertEquals(1, follower?.uf)
//        assertEquals(0, follower?.fu)
//
//        // 用户2关注用户1
//        followerService.appFollowOrCancel(
//            AppFollowOrCancelReq().apply {
//
//                this.userId = followingId
//                this.followingId = userId
//                this.method = FollowMethod.FOLLOW
//            }
//        )
//        follower = followerMapper.selectByUidAndFollowingId(userId, followingId)
//
//        assertEquals(1, follower?.uf)
//        assertEquals(1, follower?.fu)  // 双向关注状态
//    }
//
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/follower_friend_page.sql")
//    fun appFollowFriends__when_status_FOLLOWED_BY__then_return_followed_by_friends_page() {
//        val req = AppFollowFriendsReq().apply { this.userId = 100001;this.followStatus = "FOLLOWED_BY" }
//
//        val appFollowFriends = followerService.appFollowFriends(req)
//
//        assertEquals(appFollowFriends.list.filter { it.id == 100003L }[0].id, 100003L)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/follower_friend_page.sql")
//    fun appFollowFriends__when_status_FOLLOWED_BY_and_username_match__then_return_followed_by_friends_page() {
//        val req = AppFollowFriendsReq().apply { this.userId = 100001;this.followStatus = "FOLLOWED_BY";this.username="03" }
//
//        val appFollowFriends = followerService.appFollowFriends(req)
//
//        assertEquals(appFollowFriends.list.filter { it.id == 100003L }[0].username, "ces03")
//    }
//
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/follower_friend_page.sql")
//    fun appFollowFriends__when_status_FOLLOWING__then_return_FOLLOWING_friends_page() {
//        val req = AppFollowFriendsReq().apply { this.userId = 100001;this.followStatus = "FOLLOWING"; this.username="02" }
//
//        val appFollowFriends = followerService.appFollowFriends(req)
//
//        assertEquals(appFollowFriends.list.filter { it.id == 100002L }[0].id, 100002L)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/follower_friend_page.sql")
//    fun appFollowFriends__when_status_FOLLOWING_mutual__then_return_MUTUAL_friends_page() {
////        我关注的，但是对方也关注我的，返回 MUTUAL
//        val req = AppFollowFriendsReq().apply { this.userId = 100002;this.followStatus = "FOLLOWING"; this.username="03" }
//
//        val appFollowFriends = followerService.appFollowFriends(req)
//
//        assertEquals(appFollowFriends.list.filter { it.id == 100003L }[0].id, 100003L)
//        assertEquals("MUTUAL", appFollowFriends.list.filter { it.id == 100003L }[0].followStatus)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/follower_friend_page.sql")
//    fun appFollowFriends__when_status_MUTUAL__then_return_MUTUAL_friends_page() {
//        val req = AppFollowFriendsReq().apply { this.userId = 100002;this.followStatus = "MUTUAL"; this.username="03" }
//
//        val appFollowFriends = followerService.appFollowFriends(req)
//
//        assertEquals(appFollowFriends.list.filter { it.id == 100003L }[0].id, 100003L)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
////    @Sql("/sql/follower_friend_page.sql")
//    fun appFollowFriends__when_no_result__then_return_empty() {
//        val req = AppFollowFriendsReq().apply { this.userId = 100000000;this.followStatus = "MUTUAL"; this.username="uname_not_exists" }
//
//        val appFollowFriends = followerService.appFollowFriends(req)
//
//        assertEquals(appFollowFriends.total,0)
//    }
//
//
//
//
//}
