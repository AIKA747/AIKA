package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.entity.StoryChatLog
import com.parsec.aika.common.model.vo.req.AppChatLogReq
import com.parsec.aika.common.model.vo.resp.AppChatRecordListVo
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface StoryChatLogMapper : BaseMapper<StoryChatLog> {

    @Select(
        """
        <script>
            SELECT 
                amr.id AS msgId, amr.storyId AS objectId, amr.creator AS userId, amr.replyMessageId, amr.contentType,
                amr.fileProperty, amr.media, amr.readFlag, amr.readTime, amr.sourceType,
                amr.textContent, amr.msgStatus, amr.createdAt,amr.json,amr.`chapterId`,amr.`storyRecorderId`,amr.creatorName as username
            FROM `t_story_chat_log` amr
            WHERE amr.creator = #{userId} and amr.storyId = #{req.storyId} 
            <if test='req.lastTime != null'>
                and UNIX_TIMESTAMP(amr.createdAt) >= UNIX_TIMESTAMP(#{req.lastTime})
            </if>
            order by amr.id desc
        </script>
        """
    )
    fun appMsgRecordList(page: Page<AppChatRecordListVo>, @Param("req")req: AppChatLogReq, @Param("userId")userId: Long): Page<AppChatRecordListVo>

    @Select("""
        SELECT COUNT(*) FROM (
            SELECT MAX(id) FROM `t_story_chat_log` WHERE chapterId=#{chapterId} AND creator=#{userId} AND sourceType='user' GROUP BY DATE_FORMAT(createdAt,'%Y%m%d%H%i')
        ) temp
    """)
    fun getUserChatMinutes(@Param("chapterId")chapterId: Long, @Param("userId")userId: Long): Int
}
