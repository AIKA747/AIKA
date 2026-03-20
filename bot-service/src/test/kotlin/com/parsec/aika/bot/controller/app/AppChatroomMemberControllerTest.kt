package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.parsec.aika.common.model.dto.ChatroomMemberVo
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.GroupMemberRole
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
@AutoConfigureMockMvc
class AppChatroomMemberControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    private val objectMapper = jacksonObjectMapper()




    @Test
    fun testSetMemberRoleEmptyParameters() {

        val request = SetMemberRoleRequest(roomId = "1", role = GroupMemberRole.MEMBER.name, memberIds = emptyList())
        val user = LoginUserInfo().apply {
            userId = 1
            username = "testuser"
        }

        mockMvc.perform(MockMvcRequestBuilders.put("/app/chatroom/role")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request))
            .header("user", objectMapper.writeValueAsString(user)))
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(400))
            .andExpect(MockMvcResultMatchers.jsonPath("$.msg").value("memberIds is required"))
    }


    @Test
    fun testDeleteMembersEmptyParameters() {
        val request = DeleteMembersRequest(roomId = "1", memberIds = emptyList())
        val user = LoginUserInfo().apply {
            userId = 1
            username = "testuser"
        }

        mockMvc.perform(MockMvcRequestBuilders.delete("/app/chatroom/members")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request))
            .header("user", objectMapper.writeValueAsString(user)))
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(400))
            .andExpect(MockMvcResultMatchers.jsonPath("$.msg").value("memberIds is required"))

    }

    @Test
    fun testAddMembersEmptyParameters() {
        val request = AddMembersRequest(roomId = "1", members = emptyList())
        val user = LoginUserInfo().apply {
            userId = 1
            username = "testuser"
        }

        mockMvc.perform(MockMvcRequestBuilders.post("/app/chatroom/members")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request))
            .header("user", objectMapper.writeValueAsString(user)))
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(400))
            .andExpect(MockMvcResultMatchers.jsonPath("$.msg").value("members is required"))

        val member = ChatroomMemberVo().apply {
            username = "testuser"
            memberType = AuthorType.USER
            avatar = "avatar"
            nickname = "nickname"
            memberId = 1
        }
        val request1 = AddMembersRequest(roomId = "1", members = listOf(member))

        mockMvc.perform(MockMvcRequestBuilders.post("/app/chatroom/members")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request1))
            .header("user", objectMapper.writeValueAsString(user)))
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(400))
            .andExpect(MockMvcResultMatchers.jsonPath("$.msg").value("members[0].roomId is required"))
    }

}
