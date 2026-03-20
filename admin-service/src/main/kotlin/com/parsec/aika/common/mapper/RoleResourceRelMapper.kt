package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.RoleResourceRel
import org.apache.ibatis.annotations.Mapper

@Mapper
interface RoleResourceRelMapper: BaseMapper<RoleResourceRel> {
}