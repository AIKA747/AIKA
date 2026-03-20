package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.GptReqLog
import org.apache.ibatis.annotations.Mapper

@Mapper
interface GptReqLogMapper : BaseMapper<GptReqLog> {}