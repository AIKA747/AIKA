package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.BotTemp
import org.apache.ibatis.annotations.Mapper

@Mapper
interface BotTempMapper : BaseMapper<BotTemp> {
}