package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.AppleNotify
import org.apache.ibatis.annotations.Mapper

@Mapper
interface AppleNotifyMapper : BaseMapper<AppleNotify> {}