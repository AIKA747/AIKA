package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.UserBotTaskLogs
import org.apache.ibatis.annotations.Mapper

@Mapper
interface UserBotTaskLogsMapper : BaseMapper<UserBotTaskLogs>