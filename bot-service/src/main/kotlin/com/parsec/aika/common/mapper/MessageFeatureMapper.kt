package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.MessageFeature
import org.apache.ibatis.annotations.Mapper

/**
 * @author 77923
 * @description 针对表【t_message_feature】的数据库操作Mapper
 * @createDate 2025-02-24 11:54:38
 * @Entity com.parsec.aika.common.model.entity.MessageFeature
 */
@Mapper
interface MessageFeatureMapper : BaseMapper<MessageFeature?>




