package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.req.AppAssistantMsgRecordQueryVo
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.common.model.entity.AssistantMsgRecord
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface AssistantMsgRecordMapper : BaseMapper<AssistantMsgRecord> {

    @Select(
        """
        <script>
            select 
                amr.id as msgId, amr.assistantId as objectId, amr.userId, amr.replyMessageId, amr.contentType,
                amr.fileProperty, amr.media, amr.readFlag, amr.readTime, amr.sourceType,amr.badAnswer,amr.regenerateNum,
                amr.textContent, amr.msgStatus, amr.createdAt,amr.json,amr.videoUrl,amr.videoStatus,amr.digitHuman
            from assistant_msg_record amr
            where amr.userId = #{userId} and amr.deleted = 0 
            <if test='req.lastTime != null'>
                and UNIX_TIMESTAMP(amr.createdAt) >= UNIX_TIMESTAMP(#{req.lastTime})
            </if>
            order by amr.id desc
        </script>
    """
    )
    fun appMsgRecordList(
        @Param("req") req: AppAssistantMsgRecordQueryVo, @Param("userId") userId: Long
    ): List<AppChatRecordListVo>

}