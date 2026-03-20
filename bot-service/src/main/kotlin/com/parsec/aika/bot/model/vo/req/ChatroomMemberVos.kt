package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.dto.ChatroomMemberVo
import javax.validation.Valid
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

/**
 * 设置成员角色请求
 */
data class SetMemberRoleRequest(

  @field:NotEmpty(message = "is required")
  val roomId: String,
  @field:NotEmpty(message = "is required")
  val role: String,
  @field:NotEmpty(message = "is required")
  val memberIds: List<String>
)

/**
 * 删除成员请求
 */
data class DeleteMembersRequest(
  @field:NotEmpty(message = "is required")
  val roomId: String,
  @field:NotEmpty(message = "is required")
  val memberIds: List<String>
)

/**
 * 添加成员请求
 */
data class AddMembersRequest(
  @field:NotEmpty(message = "is required")
  val roomId: String,


  @field:NotEmpty(message = "is required")
  @field:Valid
  val members: List<ChatroomMemberVo>
)

/**
 * 添加成员请求
 */
data class GroupJoinRequest(
  @field:NotNull(message = "is required")
  val id: Int
)
