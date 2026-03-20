package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.admin.model.vo.req.GetEmailLogsReq
import com.parsec.aika.admin.model.vo.resp.GetEmailLogsResp
import com.parsec.aika.common.model.entity.EmailLog
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface EmailLogMapper: BaseMapper<EmailLog> {

    @Select("""
        <script>
        select el.email, el.content, el.status, el.sendTime
        from email_log as el 
        where el.deleted = 0 
        <if test = 'req.email != null'>
            and el.email like concat('%', #{req.email}, '%')
        </if>
        <if test = 'req.status != null'>
            and el.status = #{req.status}
        </if>
        <if test = 'req.minSendTime != null and req.maxSendTime != null'>
            and el.sendTime between #{req.minSendTime} and #{req.maxSendTime}
        </if>
        <if test = 'req.content != null'>
            and el.content like concat('%', #{req.content}, '%') 
        </if>
        order by el.id desc
        </script>
    """)
    fun getEmailLogs(@Param("req") req: GetEmailLogsReq): List<GetEmailLogsResp>
}