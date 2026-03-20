package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.resp.ChatroomJoinNotificationResp
import com.parsec.aika.common.model.entity.ChatroomMember
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

/**
 * @author 77923
 * @description 针对表【t_chatroom_member】的数据库操作Mapper
 * @createDate 2025-02-24 11:53:38
 * @Entity com.parsec.aika.common.model.entity.ChatroomMember
 */
@Mapper
interface ChatroomMemberMapper : BaseMapper<ChatroomMember?> {

    @Select(
        """
        <script>
            SELECT t1.`id`,t1.`roomId`,t1.`memberId`,t1.`status`,t1.`createdAt`,
            t2.`roomName` AS chatroomName,t3.`nickname` AS creatorNickName,t2.roomAvatar as chatroomAvatar
            FROM t_chatroom_member t1
            LEFT JOIN t_chatroom t2 ON t1.`roomId`=t2.`id`
            LEFT JOIN t_chatroom_member t3 ON t1.`creator`=t3.`memberId` AND t2.`id`=t3.`roomId`
            WHERE t1.deleted=0 AND t1.`status`='FRIEND_INVITE' AND t1.`memberId`= #{memberId} 
            <if test="null!=name and name!=''">
               and (t2.`roomName` like concat('%',#{name},'%') or t3.`nickname` like concat('%',#{name},'%'))
            </if>
            ORDER BY t1.id DESC
        </script>
        """
    )
    fun getChatroomMemberNotifycation(@Param("memberId") memberId: Long,@Param("name")  name: String?): List<ChatroomJoinNotificationResp>

    @Select(
        """
        SELECT count(*)
        FROM t_chatroom_member t1
        WHERE t1.deleted=0 AND t1.`status`='FRIEND_INVITE' AND t1.`memberId`= #{memberId} 
        """
    )
    fun getChatroomMemberNotifycationCount(@Param("memberId") memberId: Long): Int
}




