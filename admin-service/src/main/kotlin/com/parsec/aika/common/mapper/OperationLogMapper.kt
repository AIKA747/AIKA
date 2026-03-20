package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.admin.model.vo.req.GetOperationLogsReq
import com.parsec.aika.admin.model.vo.resp.GetOperationLogsResp
import com.parsec.aika.common.model.entity.OperationLog
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface OperationLogMapper: BaseMapper<OperationLog> {

    @Select("""
        <script>
        select ol.adminName, ol.module, ol.record, ol.initialValue, ol.finalValue,
        ol.operatedTime, ol.action 
        from operation_log as ol 
        where ol.deleted = 0 
        <if test = 'req.username != null'>
            and ol.adminName like concat('%', #{req.username}, '%') 
        </if>
        <if test = 'req.module != null'>
            and ol.module like concat('%', #{req.module}, '%') 
        </if>
        <if test = 'req.action != null'>
            and ol.action = #{req.action} 
        </if>
        <if test = 'req.minOperatedTime != null'>
            and ol.operatedTime &gt;= #{req.minOperatedTime}
        </if>
        <if test = 'req.maxOperatedTime != null'>
            and ol.operatedTime &lt;= #{req.maxOperatedTime}
        </if>
        <if test = 'req.record != null'>
            and ol.record like concat('%', #{req.record}, '%') 
        </if>
        order by id desc 
        </script>
    """)
    fun getOperationLogs(@Param("req") req: GetOperationLogsReq): List<GetOperationLogsResp>
}