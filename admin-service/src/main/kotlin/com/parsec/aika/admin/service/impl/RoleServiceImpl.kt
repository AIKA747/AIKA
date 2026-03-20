package com.parsec.aika.admin.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.admin.model.vo.req.GetRolesReq
import com.parsec.aika.admin.model.vo.req.PostRoleReq
import com.parsec.aika.admin.model.vo.req.PutRoleReq
import com.parsec.aika.admin.model.vo.resp.GetRoleIdResp
import com.parsec.aika.admin.model.vo.resp.GetRolesResp
import com.parsec.aika.admin.service.RoleService
import com.parsec.aika.common.mapper.ResourceMapper
import com.parsec.aika.common.mapper.RoleMapper
import com.parsec.aika.common.mapper.RoleResourceRelMapper
import com.parsec.aika.common.model.constant.RedisCont.ROLE_RESOURCE_PATHS
import com.parsec.aika.common.model.entity.AdminResource
import com.parsec.aika.common.model.entity.Role
import com.parsec.aika.common.model.entity.RoleResourceRel
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.redis.util.RedisUtil
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource


@Service
class RoleServiceImpl : RoleService {

    @Resource
    private lateinit var roleMapper: RoleMapper

    @Resource
    private lateinit var roleResourceRelMapper: RoleResourceRelMapper

    @Resource
    private lateinit var resourceMapper: ResourceMapper

    @Transactional
    override fun postRole(req: PostRoleReq, loginUserInfo: LoginUserInfo) {
        val role = Role()
        role.roleName = req.roleName
        role.creator = loginUserInfo.userId
        role.creatorName = loginUserInfo.username
        role.deleted = false
        role.remark = req.remark
        roleMapper.insert(role)
        updateResources(role.id, req.resourceIds)
    }

    @Transactional
    override fun putRole(req: PutRoleReq, loginUserInfo: LoginUserInfo) {
        val role = roleMapper.selectById(req.id)
        Assert.notNull(role, "角色不存在")
        role.roleName = req.roleName
        role.remark = req.remark
        role.updater = loginUserInfo.userId
        roleMapper.updateById(role)
        updateResources(req.id!!, req.resourceIds)
    }

    private fun updateResources(roleId: Long, resourceIds: List<Long?>?) {
        roleResourceRelMapper.delete(KtQueryWrapper(RoleResourceRel::class.java).eq(RoleResourceRel::roleId, roleId))
        if (resourceIds.isNullOrEmpty()) {
            return
        }
        resourceIds.filterNotNull().forEach {
            roleResourceRelMapper.insert(RoleResourceRel().apply {
                this.roleId = roleId
                this.resourceId = it
            })
        }
    }

    override fun getRoleId(id: Long): GetRoleIdResp {
        val role = roleMapper.selectById(id)
        Assert.notNull(role, "角色不存在")
        return GetRoleIdResp().apply {
            this.id = role.id
            this.roleName = role.roleName
            this.remark = role.remark
            this.createdAt = role.createdAt
            this.resourceIds = roleResourceRelMapper.selectList(
                KtQueryWrapper(RoleResourceRel::class.java).eq(
                    RoleResourceRel::roleId, role.id
                )
            ).map { it.resourceId!!.toString() }
        }
    }

    override fun deleteRoleId(id: Long) {
        val role = roleMapper.selectById(id)
        Assert.notNull(role, "角色不存在")
        roleMapper.deleteById(id)
    }

    override fun getRoles(req: GetRolesReq): PageResult<GetRolesResp> {
        PageHelper.startPage<GetRolesResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetRolesResp>().page(roleMapper.getRoles(req))

    }

    @Async
    override fun refreshRoleResources(roleId: Long?) {
        val resourceList = resourceMapper.queryRoleResources(roleId)
        val paths = resourceList.map(AdminResource::paths).filter(StrUtil::isNotBlank).joinToString(",")
        RedisUtil.set("${ROLE_RESOURCE_PATHS}$roleId", paths)
    }

}