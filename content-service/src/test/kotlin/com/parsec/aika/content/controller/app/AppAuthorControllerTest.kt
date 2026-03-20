package com.parsec.aika.content.controller.app

import cn.hutool.log.StaticLog
import com.parsec.aika.common.mapper.FollowRelationMapper
import com.parsec.aika.common.model.em.AuthorSortType
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.model.vo.req.PutAppFollowAuthorReq
import com.parsec.trantor.exception.core.BusinessException
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue

@SpringBootTest
internal class AppAuthorControllerTest {

    @Resource
    private lateinit var appauthorController: AuthorController

    @Resource
    private lateinit var followRelationMapper: FollowRelationMapper

    val loginUserInfo = LoginUserInfo().apply {
        this.userId = 1
        username = "test user"

    }
    val loginUserInfo2 = LoginUserInfo().apply {
        this.userId = 2
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun authorPage__no_condition() {
        val list =
            appauthorController.authorPage(com.parsec.aika.common.model.vo.req.GetAuthorReq(), loginUserInfo).data.list
        assertEquals(2, list[0].userId)
        assertEquals(3, list[1].userId)
        assertEquals(4, list[2].userId)
        assertEquals(false, list[0].followed)
        assertEquals(true, list[1].followed)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun authorPage__page() {
        val result = appauthorController.authorPage(
            com.parsec.aika.common.model.vo.req.GetAuthorReq().apply { pageSize = 1 }, loginUserInfo
        )
        assertEquals(4, result.data.pages)
        assertEquals(1, result.data.list.size)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun authorPage__sort_pop() {
        val result = appauthorController.authorPage(
            com.parsec.aika.common.model.vo.req.GetAuthorReq().apply { sort = AuthorSortType.POP }, loginUserInfo
        )
        assertEquals(4, result.data.total)
        assertEquals(2, result.data.list[0].id)
        assertEquals(3, result.data.list[1].id)
        assertEquals(4, result.data.list[2].id)
        assertEquals(5, result.data.list[3].id)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun authorPage__keyword() {
        val result = appauthorController.authorPage(
            com.parsec.aika.common.model.vo.req.GetAuthorReq().apply { keyword = "or1" }, loginUserInfo2
        )
        assertEquals(1, result.data.list.size)
        assertEquals("Author1", result.data.list[0].nickname)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun authorPage__sort_all() {
        val result = appauthorController.authorPage(
            com.parsec.aika.common.model.vo.req.GetAuthorReq().apply { keyword = "keyword";sort = AuthorSortType.ALL },
            loginUserInfo
        )
        assertEquals(3, result.data.list.size)
        assertEquals(2, result.data.list[0].userId)
        assertEquals(3, result.data.list[1].userId)
        assertEquals(4, result.data.list[2].userId)
    }

    @Test
    @Rollback
    @Transactional
    fun doFollowAuthor__bot_agreed() {
        val result = appauthorController.doFollowAuthor(
            com.parsec.aika.common.model.vo.req.PostAppFollowAuthorReq()
                .apply { followingId = 2; type = AuthorType.BOT }, loginUserInfo
        )
        StaticLog.info("doFollowAuthor__bot_agreed:{}", result)
        val selectById = followRelationMapper.selectById(result.data)
        assertTrue { selectById.agreed }
    }

    @Test
    @Rollback
    @Transactional
    fun doFollowAuthor__user_not_agreed() {
        val result = appauthorController.doFollowAuthor(
            com.parsec.aika.common.model.vo.req.PostAppFollowAuthorReq()
                .apply { followingId = 3; type = AuthorType.USER }, loginUserInfo
        )
        StaticLog.info("doFollowAuthor__bot_agreed:{}", result)
        val selectById = followRelationMapper.selectById(result.data)
        assertTrue { selectById.agreed }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun pageMyFollowingApply() {
        val result = appauthorController.doFollowAuthor(
            com.parsec.aika.common.model.vo.req.PostAppFollowAuthorReq()
                .apply { followingId = 5; type = AuthorType.USER }, loginUserInfo
        )
        StaticLog.info("doFollowAuthor__bot_agreed:{}", result)
        val selectById = followRelationMapper.selectById(result.data)
        assertTrue { selectById.agreed }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun pageMyFollowingApply__duplicate_do_nothing() {
        val result = appauthorController.doFollowAuthor(
            com.parsec.aika.common.model.vo.req.PostAppFollowAuthorReq()
                .apply { followingId = 3; type = AuthorType.USER }, loginUserInfo
        )
        StaticLog.info("doFollowAuthor__bot_agreed:{}", result)
        assertEquals(0, result.data)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun pageMyFollowingApply__page() {
        val result =
            appauthorController.pageMyFollowingApply(PageVo().apply { pageSize = 1 }, null, loginUserInfo2)!!.data
        assertEquals(1, result.list.size)
        assertEquals(2, result.pages)
        assertEquals(4, result.list[0].userId)
        assertEquals("author4", result.list[0].username)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun doFollowAgreed() {
        appauthorController.doFollowAgreed(PutAppFollowAuthorReq().apply { id = 3 }, loginUserInfo2).code.let {
            assertEquals(0, it)
        }

        //        重复同意
        appauthorController.doFollowAgreed(PutAppFollowAuthorReq().apply { id = 3 }, loginUserInfo2).code.let {
            assertEquals(0, it)

        }

        //        无权限
        loginUserInfo2.let {
            it.userId = 333
            Assertions.assertThrows(BusinessException::class.java) {
                appauthorController.doFollowAgreed(PutAppFollowAuthorReq().apply { id = 2 }, it)
            }
        }


        val myFollowingApplyByUid = followRelationMapper.getMyFollowingApplyByUid(2, 4)
        assertEquals(true, myFollowingApplyByUid!!.agreed)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun deleteRelation__creator_is_me() {
        val result = appauthorController.deleteRelation(2, loginUserInfo)
        assertEquals(0, result.code)
        assertNull(followRelationMapper.selectById(2))


        Assertions.assertThrows(BusinessException::class.java) {
            appauthorController.deleteRelation(4, loginUserInfo)
        }

    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun deleteRelation__my_apply_not_agreed() {
        val result = appauthorController.deleteRelation(3, loginUserInfo.apply { userId = 2 })
        assertEquals(0, result.code)
        assertNull(followRelationMapper.selectById(3))

        Assertions.assertThrows(BusinessException::class.java) {
            appauthorController.deleteRelation(2, loginUserInfo.apply { userId = 20 })
        }
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AuthorController_pageAuthor.sql")
    fun doQueryFollowCount() {
        val result1 = appauthorController.followCount(loginUserInfo.apply { userId = 1 })
        Assertions.assertEquals(1, result1.data.following)
        Assertions.assertEquals(0, result1.data.followers)

        val result2 = appauthorController.followCount(loginUserInfo.apply { userId = 2 })
        Assertions.assertEquals(0, result2.data.following)
        Assertions.assertEquals(0, result2.data.followers)

        val result3 = appauthorController.followCount(loginUserInfo.apply { userId = 3 })
        Assertions.assertEquals(1, result3.data.following)
        Assertions.assertEquals(1, result3.data.followers)

        val result44 = appauthorController.followCount(loginUserInfo.apply { userId = 44 })
        Assertions.assertEquals(0, result44.data.following)
        Assertions.assertEquals(1, result44.data.followers)
    }

}
