package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.PostReport
import org.apache.ibatis.annotations.Mapper

@Mapper
interface PostReportMapper : BaseMapper<PostReport> {
}