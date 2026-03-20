package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.UserAssistant
import org.apache.ibatis.annotations.Mapper

@Mapper
interface UserAssistantMapper: BaseMapper<UserAssistant> {
}