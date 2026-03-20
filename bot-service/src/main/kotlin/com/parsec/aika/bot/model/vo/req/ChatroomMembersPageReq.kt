package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.GroupMemberStatus
import com.parsec.aika.common.model.vo.PageVo
import javax.validation.constraints.NotNull

/**
 *
 * @author Zijian Liao
 * @since 1.0.0
 */
class ChatroomMembersPageReq : PageVo() {
  @NotNull
  var roomId: Int? = null
  var nickname: String? = null
  var memberRole: String? = null
  /**
   * FRIEND_INVITE(朋友邀请加入群聊，待用户审核),USER_JOIN_REQUEST（用户申请加入群里，待管理员审核）,APPROVE（已通过）
   */
  var status: GroupMemberStatus? = null

  var memberType: AuthorType? = null
}
