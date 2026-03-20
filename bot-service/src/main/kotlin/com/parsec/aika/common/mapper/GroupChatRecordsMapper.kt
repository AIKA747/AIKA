package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.GroupChatRecords
import org.apache.ibatis.annotations.Mapper

/**
 * @author 77923
 * @description 针对表【t_group_chat_records】的数据库操作Mapper
 * @createDate 2025-02-24 11:54:11
 * @Entity com.parsec.aika.common.model.entity.GroupChatRecords
 */
@Mapper
interface GroupChatRecordsMapper : BaseMapper<GroupChatRecords?>




