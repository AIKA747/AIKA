package com.parsec.aika.bot.service

import com.baomidou.mybatisplus.extension.service.IService
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.entity.User

/**
 * @author Administrator
 * @description 针对表【t_user】的数据库操作Service
 * @createDate 2025-07-17 09:27:38
 */
interface UserService : IService<User?> {
    fun syncUserInfo(authorSyncBO: AuthorSyncBO?): Boolean
}
