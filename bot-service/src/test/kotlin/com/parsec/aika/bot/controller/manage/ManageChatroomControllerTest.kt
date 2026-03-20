package com.parsec.aika.bot.controller.manage

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.model.vo.req.ManageChatroomEditReq
import com.parsec.aika.bot.remote.UserFeignClient
import com.parsec.aika.common.model.dto.AppUserVO
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import javax.annotation.Resource


@SpringBootTest
class ManageChatroomControllerTest {

    @MockBean
    private lateinit var userFeignClient: UserFeignClient


    @Resource
    private lateinit var manageChatroomController: ManageChatroomController

    val user = LoginUserInfo().apply {
        userId = 1
        userType = UserTypeEnum.ADMINUSER
    }

    @Test
    fun groupChatList() {
        val pageNo = 1
        val pageSize = 10
        val searchContent = "1"
        val result = manageChatroomController.groupChatList(pageNo, pageSize, searchContent)
        StaticLog.info(JSONUtil.toJsonStr(result))
    }

    @Test
    fun createChatroom() {

        // 准备模拟响应
        // 准备模拟响应
        `when`(userFeignClient.userInfo(1)).thenReturn(AppUserVO().apply {
            id = 1
            username = "test username"
            nickname = "test nickname"
        })

        val req = ManageChatroomEditReq().apply {
            roomAvatar = "https://avatars.githubusercontent.com/u/1024025?v=4"
            roomName = "test"
            description = "test"
            ownerId = 1
        }
        val result = manageChatroomController.createChatroom(req, user)
        StaticLog.info(JSONUtil.toJsonStr(result))
    }


}