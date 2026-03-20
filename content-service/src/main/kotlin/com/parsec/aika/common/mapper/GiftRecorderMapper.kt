package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.CollectStory
import com.parsec.aika.common.model.entity.Gift
import com.parsec.aika.common.model.entity.GiftRecorder
import org.apache.ibatis.annotations.Mapper

@Mapper
interface GiftRecorderMapper : BaseMapper<GiftRecorder> {
}