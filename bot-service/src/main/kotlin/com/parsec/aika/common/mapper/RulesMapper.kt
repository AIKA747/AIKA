package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.resp.GetAppRulesResp
import com.parsec.aika.common.model.entity.Rules
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Select

@Mapper
interface RulesMapper : BaseMapper<Rules> {
    @Select("""
        select r.id, r.rule
        from rules as r
        where r.status = true
        order by r.id desc
    """)
    fun getAppRules(): List<GetAppRulesResp>
}