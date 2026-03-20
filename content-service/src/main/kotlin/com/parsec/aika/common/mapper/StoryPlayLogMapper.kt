package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.CollectStory
import com.parsec.aika.common.model.entity.StoryPlayLog
import org.apache.ibatis.annotations.Mapper

@Mapper
interface StoryPlayLogMapper : BaseMapper<StoryPlayLog> {
}