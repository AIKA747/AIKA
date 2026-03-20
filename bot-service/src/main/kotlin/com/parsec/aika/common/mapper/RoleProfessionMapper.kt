package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.RoleProfession
import org.apache.ibatis.annotations.Mapper

@Mapper
interface RoleProfessionMapper : BaseMapper<RoleProfession> {
}