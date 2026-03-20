package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.user.model.entity.CodeDic
import org.apache.ibatis.annotations.Mapper

@Mapper
interface CodeDicMapper : BaseMapper<CodeDic> {}