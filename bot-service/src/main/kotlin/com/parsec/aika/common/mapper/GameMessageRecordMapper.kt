package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.req.AppChatRecordQueryVo
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.common.model.entity.GameMessageRecord
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface GameMessageRecordMapper : BaseMapper<GameMessageRecord> {

    @Select(
        """
        <script>
            select 
                mr.id as msgId, mr.threadId as objectId, mr.userId, mr.replyMessageId, mr.contentType,
                mr.fileProperty, mr.media, mr.readFlag, mr.readTime, mr.sourceType,mr.json,
                mr.textContent, mr.msgStatus, mr.createdAt,mr.gameStatus
            from game_message_record mr 
            where mr.userId = #{userId} and mr.threadId = #{req.threadId} and mr.deleted=0
            <if test = 'req.lastTime != null'> 
                and UNIX_TIMESTAMP(mr.createdAt) >= UNIX_TIMESTAMP(#{req.lastTime})
            </if>
            order by mr.id desc
        </script>
    """
    )
    fun appChatRecords(
        @Param("userId") userId: Long, @Param("req") queryVo: AppChatRecordQueryVo
    ): List<AppChatRecordListVo>


}