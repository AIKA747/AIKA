package com.parsec.aika.bot.service.impl

import cn.hutool.core.bean.BeanUtil
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import com.parsec.aika.bot.service.UserService
import com.parsec.aika.common.mapper.UserMapper
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * @author Administrator
 * @description 针对表【t_user】的数据库操作Service实现
 * @createDate 2025-07-17 09:27:38
 */
@Service
class UserServiceImpl : ServiceImpl<UserMapper?, User?>(), UserService {
    @Transactional(rollbackFor = [Exception::class])
    override fun syncUserInfo(authorSyncBO: AuthorSyncBO?): Boolean {
        val user = BeanUtil.copyProperties(authorSyncBO, User::class.java, "userId", "type")
        user.id = authorSyncBO?.userId
        user.status = authorSyncBO?.status
        return this.saveOrUpdate(user)
    }
}
