package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.req.GetAppRateReq
import com.parsec.aika.bot.model.vo.resp.GetAppRateResp
import com.parsec.aika.common.model.entity.BotRate
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface BotRateMapper : BaseMapper<BotRate> {
    @Select("""
        <script>
        select r.id, r.userId, r.userName, r.botId, r.rating, r.content, r.commentAt
        from bot_rate as r 
        where r.deleted = 0
        <if test = 'req.botId != null'>
            and r.botId = #{req.botId}
        </if>
        order by r.id desc
        </script>
    """)
    fun getAppRate(@Param("req") req: GetAppRateReq): List<GetAppRateResp>


    @Select("""
        select avg(rating)
        from bot_rate 
        where botId = #{id}
    """)
    fun avgRateByBotId(@Param("id") id: Long): Double
}