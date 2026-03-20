package com.parsec.aika.admin.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.crypto.digest.DigestUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.admin.model.vo.req.ManageUserEditVo
import com.parsec.aika.admin.model.vo.req.ManageUserQueryVo
import com.parsec.aika.admin.model.vo.resp.ManageUserDetailVo
import com.parsec.aika.admin.model.vo.resp.ManageUserListVo
import com.parsec.aika.admin.service.UserService
import com.parsec.aika.common.mapper.UserMapper
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.entity.User
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource

@Service
class UserServiceImpl : UserService {

    @Resource
    private lateinit var userMapper: UserMapper

    private val defaultPwd = "Abc123@456"

    override fun manageUsers(req: ManageUserQueryVo): PageResult<ManageUserListVo> {
        PageHelper.startPage<ManageUserListVo>(req.pageNo!!, req.pageSize!!)
        return PageUtil<ManageUserListVo>().page(userMapper.users(req))
    }

    override fun manageUserCreate(req: ManageUserEditVo, user: LoginUserInfo) {
        // 查询昵称是否已存在
        val checkNickname =
            userMapper.selectOne(KtQueryWrapper(User::class.java).eq(User::nickname, req.nickname).last("limit 1"))
        Assert.isNull(checkNickname, "nickname already exists")
        // 查询账户是否已存在
        val checkUsername =
            userMapper.selectOne(KtQueryWrapper(User::class.java).eq(User::username, req.username).last("limit 1"))
        Assert.isNull(checkUsername, "username already exists")
        // 新增管理员
        userMapper.insert(User().apply {
            this.nickname = req.nickname
            this.username = req.username
            this.roleId = req.roleId
            this.avatar = req.avatar
            this.password = DigestUtil.sha256Hex(defaultPwd)
            this.creator = user.userId
            this.creatorName = user.username
            this.createdAt = LocalDateTime.now()
            this.userStatus = UserStatus.enabled
            this.deleted = false
        })
    }

    override fun manageUserUpdate(req: ManageUserEditVo, user: LoginUserInfo) {
        // 查询id是否有数据
        val userVo = userMapper.selectById(req.id)
        Assert.notNull(userVo, "the administrator information does not exist")
        // 查询昵称是否已存在
        val checkNickname =
            userMapper.selectOne(KtQueryWrapper(User::class.java).eq(User::nickname, req.nickname).last("limit 1"))
        Assert.isTrue(checkNickname == null || checkNickname.id == req.id, "nickname already exists")
        // 查询账户是否已存在
        val checkUsername =
            userMapper.selectOne(KtQueryWrapper(User::class.java).eq(User::username, req.username).last("limit 1"))
        Assert.isTrue(checkUsername == null || checkUsername.id == req.id, "username already exists")
        // 新增管理员
        userMapper.updateById(User().apply {
            this.id = req.id
            this.nickname = req.nickname
            this.username = req.username
            this.roleId = req.roleId
            this.avatar = req.avatar
            this.updater = user.userId
            this.updatedAt = LocalDateTime.now()
        })
    }

    override fun manageUserDelete(id: Long, loginUser: LoginUserInfo) {
        // 验证id是否存在
        val userVo = userMapper.selectById(id)
        Assert.notNull(userVo, "管理员信息不存在")
        userMapper.deleteById(id)
    }

    override fun manageUserDetail(id: Long): ManageUserDetailVo {
        val vo = userMapper.selectById(id)
        Assert.notNull(vo, "管理员信息不存在")
        return ManageUserDetailVo().apply {
            this.id = vo.id
            this.username = vo.username
            this.nickname = vo.nickname
            this.avatar = vo.avatar
            this.roleId = vo.roleId
            this.createdAt = vo.createdAt
        }
    }

    override fun manageResetPwd(id: Long, user: LoginUserInfo) {
        // 查询id是否存在
        val userVo = userMapper.selectById(id)
        Assert.notNull(userVo, "管理员信息不存在")
        userMapper.updateById(User().apply {
            this.id = id
            this.password = DigestUtil.sha256Hex(defaultPwd)
            this.updater = user.userId
            this.updatedAt = LocalDateTime.now()
        })
    }

    override fun checkInitPwd(password: String): Boolean {
        return password == DigestUtil.sha256Hex(defaultPwd)
    }
}