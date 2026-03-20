package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.admin.model.vo.req.GetSmsLogsReq
import com.parsec.aika.admin.model.vo.resp.GetSmsLogsResp
import com.parsec.aika.common.model.entity.SmsLog
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface SmsLogMapper: BaseMapper<SmsLog> {

    @Select("""
        <script>
        select sl.phone, sl.content, sl.status, sl.sendTime
        from sms_log as sl 
        where sl.deleted = 0 
        <if test = 'req.phone != null'>
            and sl.phone like concat('%', #{req.phone}, '%')
        </if>
        <if test = 'req.status != null'>
            and sl.status = #{req.status}
        </if>
        <if test = 'req.minSendTime != null and req.maxSendTime != null'>
            and sl.sendTime between #{req.minSendTime} and #{req.maxSendTime}
        </if>
        <if test = 'req.content != null'>
            and sl.content like concat('%', #{req.content}, '%') 
        </if>
        order by sl.id desc
        </script>
    """)
    fun getSmsLogs(@Param("req") req: GetSmsLogsReq): List<GetSmsLogsResp>
}