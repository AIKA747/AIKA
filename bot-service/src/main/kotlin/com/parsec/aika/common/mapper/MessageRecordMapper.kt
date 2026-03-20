package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.req.AppChatQueryVo
import com.parsec.aika.bot.model.vo.req.AppChatRecordQueryVo
import com.parsec.aika.bot.model.vo.resp.AppChatListVo
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.common.model.entity.MessageRecord
import org.apache.ibatis.annotations.Delete
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface MessageRecordMapper : BaseMapper<MessageRecord> {

    /**
     * 会话列表
     * 由于数据库中并不存在会话表，会话的事实上是通过 subscription 和 message_record 的 inner join 来实现的。
     * （这里选用inner join 的目的在于，我们可以通过清除message_record的方法，来删除“会话”）
     * 机器人数据存在于机器人表里，而会话数，需要从message_record表中group
     */
    @Select("""
        <script>
            SELECT 
                mr.botId, b.botName, b.avatar AS botAvatar, b.creator, b.creatorName, b.botStatus, 
                mr.createdAt AS lastMessageAt, bs.lastReadAt,mr.num AS dialogues, mr.userId,b.botIntroduce,
                IF(b.creator = mr.userId, 1, 0) AS selfCreation,b.botSource,IF(ISNULL(bs.`id`),0,1) AS subscribed
            FROM (
                SELECT msgr.*, g.num 
                FROM message_record msgr 
                INNER JOIN (
                    SELECT MAX(id) AS id, COUNT(id) AS num 
                    FROM message_record 
                    WHERE userId=#{userId}
                    GROUP BY botId, userId
                ) AS g ON msgr.id=g.id
            ) AS mr 
            LEFT JOIN bot_subscription bs ON mr.botId=bs.botId AND mr.userId=bs.userId
            LEFT JOIN bot b ON mr.botId=b.id 
            WHERE mr.userId =#{userId} and b.deleted=0
            <if test = 'req.botName != null'> 
                and b.botName like concat('%', #{req.botName}, '%')
            </if>
            order by mr.id desc
        </script>
    """)
    fun appChatList(@Param("userId") userId: Long, @Param("req") queryVo: AppChatQueryVo): List<AppChatListVo>

    /**
     * 会话数量
     */
    @Select("""
        <script>
            select count(*) 
            from (
                select botId, userId, count(*) as num from message_record where botId=#{botId} group by botId, userId
            ) temp
        </script>
    """)
    fun botDialogues(@Param("botId") botId: Long): Int

    @Select("""
        <script>
            select 
                mr.id as msgId, mr.botId as objectId, mr.userId, mr.replyMessageId, mr.contentType,
                mr.fileProperty, mr.media, mr.readFlag, mr.readTime, mr.sourceType,
                mr.textContent, mr.msgStatus, mr.createdAt,mr.json
            from message_record mr 
            where mr.userId = #{userId} and mr.botId = #{req.botId} and mr.deleted=0
            <if test = 'req.lastTime != null'> 
                and UNIX_TIMESTAMP(mr.createdAt) >= UNIX_TIMESTAMP(#{req.lastTime})
            </if>
            order by mr.id desc
        </script>
    """)
    fun appChatRecords(@Param("userId") userId: Long, @Param("req") queryVo: AppChatRecordQueryVo): List<AppChatRecordListVo>

    /**
     * 删除会话记录
     */
    @Delete("""
        <script>
            delete from message_record where botId=#{botId} and userId=#{userId}
        </script>
    """)
    fun appChatRecordDelete(@Param("userId") userId: Long, @Param("botId") botId: Long)

}