package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.CollectStory
import com.parsec.aika.common.model.entity.Gift
import com.parsec.aika.common.model.entity.GiftRecorder
import com.parsec.aika.common.model.entity.Rewards
import org.apache.ibatis.annotations.Mapper

@Mapper
interface RewardsMapper : BaseMapper<Rewards> {
}