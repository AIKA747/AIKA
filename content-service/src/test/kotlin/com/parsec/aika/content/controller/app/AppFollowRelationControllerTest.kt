package com.parsec.aika.content.controller.app

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.common.mapper.FollowRelationMapper
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.BotImage
import com.parsec.aika.common.model.entity.FollowRelation
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.BotImageUpdateVo
import com.parsec.trantor.exception.core.BusinessException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource

@SpringBootTest
internal class AppFollowRelationControllerTest {

    @Resource
    private lateinit var appFollowRelationController: AppFollowRelationController

    @Resource
    private lateinit var followRelationMapper: FollowRelationMapper


    private var userInfo: LoginUserInfo = LoginUserInfo()

    @BeforeEach
    fun setBefore() {
        userInfo = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.APPUSER
        }
    }

//    @Test
    @Transactional
    @Sql("/sql/follow_relation_init.sql")
    fun testUpdateBotImage() {
        val vo = com.parsec.aika.common.model.vo.req.BotImageUpdateVo().apply {
            this.botImage = BotImage().apply {
                this.cover = "https://www.test.com/image.jpg"
                this.avatar = "https://www.test.com/image.jpg"
            }
        }
        assertThrowsExactly(BusinessException::class.java) {
            vo.botId = 999
            // 修改未关注用户失败
            this.appFollowRelationController.updateFollowBotImage(vo, userInfo)
        }
        assertThrowsExactly(BusinessException::class.java) {
            vo.botId = 2
            // 修改USER类型用户失败
            this.appFollowRelationController.updateFollowBotImage(vo, userInfo)
        }
        vo.botId = 1
        val result = this.appFollowRelationController.updateFollowBotImage(vo, userInfo)
        assertEquals(result.code, 0)
        val followRelation = this.followRelationMapper.selectOne(
            KtQueryWrapper(FollowRelation::class.java)
            .eq(FollowRelation::type, AuthorType.BOT)
            .eq(FollowRelation::deleted, false)
            .eq(FollowRelation::creator, userInfo.userId)
            .eq(FollowRelation::followingId, vo.botId))
        assertNotNull(followRelation.botImage)
        assertTrue(followRelation.botImage!!.cover != null && followRelation.botImage!!.avatar != null)

        com.parsec.aika.common.model.vo.req.BotImageUpdateVo().apply {
            this.botImage = BotImage().apply {
                this.cover = null // 或者 "" 空字符串
                this.avatar = null // 或者 "" 空字符串
            }
            this.botId = 1
            assertThrowsExactly(IllegalArgumentException::class.java) {
                appFollowRelationController.updateFollowBotImage(this, userInfo)
            }
        }



    }
}
