package com.parsec.aika.bot.service.impl

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import com.parsec.aika.bot.service.MessageFeatureService
import com.parsec.aika.common.mapper.MessageFeatureMapper
import com.parsec.aika.common.model.entity.MessageFeature
import org.springframework.stereotype.Service

/**
 * @author 77923
 * @description 针对表【t_message_feature】的数据库操作Service实现
 * @createDate 2025-02-24 11:54:38
 */
@Service
class MessageFeatureServiceImpl : ServiceImpl<MessageFeatureMapper?, MessageFeature?>(), MessageFeatureService




