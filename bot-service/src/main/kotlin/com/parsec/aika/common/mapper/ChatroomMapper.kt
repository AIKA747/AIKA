package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.resp.AppChatroomListResp
import com.parsec.aika.bot.model.vo.resp.ChatroomResp
import com.parsec.aika.common.model.entity.Chatroom
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

/**
 * @author 77923
 * @description 针对表【t_chatroom】的数据库操作Mapper
 * @createDate 2025-02-24 11:52:50
 * @Entity com.parsec.aika.common.model.entity.Chatroom
 */
@Mapper
interface ChatroomMapper : BaseMapper<Chatroom?> {

    /**
     * 获取用户的聊天室列表
     *
     * @param page 分页参数
     * @param userId 用户ID
     * @param status 成员状态(APPROVE表示已加入)
     * @param roomName 聊天室名称(可选，用于模糊搜索)
     * @return 聊天室列表(包含成员信息)
     */
    @Select(
        """
        <script>
        SELECT 
            c.id,
            c.createdAt,
            c.creator,
            c.updatedAt,
            c.updater,
            if(c.roomType='CHAT',m2.nickname,c.roomName) as roomName,
            if(c.roomType='CHAT',m2.avatar,c.roomAvatar) as roomAvatar,
            c.roomType,
            c.groupType,
            c.memberLimit,
            c.description,
            c.roomCode,
            m.lastReadTime,
            m.lastLoadTime,
            c.lastMessageTime,
            m.clearTime
        FROM t_chatroom c
        INNER JOIN t_chatroom_member m ON c.id = m.roomId and m.memberId = #{userId}
        left join t_chatroom_member m2 on c.id = m2.roomId and c.roomType='CHAT' and m2.memberId != #{userId}
        WHERE m.memberId = #{userId}
        AND (c.lastMessageTime &gt;= m.clearTime or m.clearTime is null)
        AND m.status = 'APPROVE'
        AND m.deleted = 0
        AND c.deleted = 0
        <if test="roomName != null and roomName != ''">
            having roomName LIKE CONCAT('%', #{roomName}, '%')
        </if>
        ORDER BY m.lastReadTime DESC
        </script>
    """
    )
    fun getMyChatroomList(
        @Param("userId") userId: Long, @Param("roomName") roomName: String?
    ): List<AppChatroomListResp>

    @Select(
        """
        select t1.* from t_chatroom t1
        left join t_chatroom_member t2 on t1.id = t2.roomId and t2.memberId = #{oneUserId}
        left join t_chatroom_member t3 on t1.id = t3.roomId and t3.memberId = #{twoUserId}
        where t1.deleted = 0 and t2.deleted = 0 and t3.deleted = 0 and t1.roomType='CHAT'
    """
    )
    fun selectUserChatroom(@Param("oneUserId") oneUserId: Long, @Param("twoUserId") twoUserId: Long): Chatroom?

    @Select(
        """
        <script>
            select
                t1.id,t1.roomName,t1.roomAvatar,t1.memberLimit,t1.description,t1.roomCode,
                t2.memberRole,t1.memberLimit,if(t2.id is null,0,1) as joined,t1.roomType,
                t1.groupType,t1.createdAt,t1.updatedAt,t1.creator,t1.updater,t2.lastReadTime
            from
                t_chatroom t1
            left join
                t_chatroom_member t2 on t1.id = t2.roomId and t2.memberId = #{userId} and t2.status = 'APPROVE' and t2.deleted = 0
            where
                t1.deleted = 0 and t1.groupType = 'PUBLIC'
                <if test="searchContent != null and searchContent != ''">
                    and (t1.roomName like concat('%',#{searchContent},'%') or t1.description like concat('%',#{searchContent},'%'))
                </if>
            order by
                t1.id desc
        </script>
    """
    )
    fun searchChatroomList(
        @Param("searchContent") searchContent: String?, @Param("userId") userId: Long?
    ): List<ChatroomResp>
}
