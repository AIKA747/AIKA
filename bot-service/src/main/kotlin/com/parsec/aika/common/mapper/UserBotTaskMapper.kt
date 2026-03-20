package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.resp.UserBotTaskResp
import com.parsec.aika.common.model.entity.BotTaskStatus
import com.parsec.aika.common.model.entity.UserBotTask
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select
import org.apache.ibatis.annotations.Update

@Mapper
interface UserBotTaskMapper : BaseMapper<UserBotTask> {

    @Update("update message_record set json=json_set(json, '\$.status', #{status}) where contentType='task' and json_value(json, '\$.id')=#{id}")
    fun updateBotMessageObjTaskStatus(@Param("id") id: Int, @Param("status") status: BotTaskStatus)


    @Update("update message_record set json=json_set(json, '\$.deleted', '1') where contentType='task' and json_value(json, '\$.id')=#{id}")
    fun deleteBotMessageObjTask(@Param("id") id: Int)

    @Select(
        """
        select t1.*
        from user_bot_task t1
        left join user_bot_task_logs  t2 on t1.id = t2.taskId
        where t1.deleted = 0 and t1.status = 'ENABLED' and t1.creater=#{userId} and t1.botId = #{botId}
        order by t2.excutedAt desc,t1.createdAt desc limit 1
    """
    )
    fun selectEnabledTask(@Param("userId") userId: Long?, @Param("botId") botId: Long?): UserBotTask?

    @Select(
        """
        <script>
        select t1.*,t2.botName,t2.avatar as botAvatar,t3.username,t3.nickname,t3.avatar
        from user_bot_task t1
        inner join bot t2 on t1.botId = t2.id
        left join t_user t3 on t1.creater = t3.id
        where t1.deleted = 0 
        <if test="minTime != null">
           AND t1.createdAt &gt;= #{minTime}
        </if>
        <if test="maxTime != null">
           AND t1.createdAt &lt;= #{maxTime}
        </if>
        <if test="status != null">
           AND t1.status = #{status.name}
        </if>
        order by t1.createdAt desc
        </script>
    """
    )
    fun getManageBotTaskList(
        @Param("status") status: BotTaskStatus?, @Param("minTime") minTime: String?, @Param("maxTime") maxTime: String?
    ): List<UserBotTaskResp>
}