package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.User
import org.apache.ibatis.annotations.Mapper

/**
 * @author Administrator
 * @description 针对表【t_user】的数据库操作Mapper
 * @createDate 2025-07-17 09:27:38
 * @Entity com.parsec.aika.common.model.entity.User
 */
@Mapper
interface UserMapper : BaseMapper<User?>
