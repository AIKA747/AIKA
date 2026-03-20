package com.parsec.aika.admin.service.impl

import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.admin.model.vo.resp.GetAdminResourcesResp
import com.parsec.aika.admin.service.ResourcesService
import com.parsec.aika.common.mapper.ResourceMapper
import com.parsec.aika.common.mapper.UserMapper
import com.parsec.aika.common.model.entity.AdminResource
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import com.parsec.trantor.exception.core.AuthException
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import org.springframework.util.Assert
import java.time.LocalDateTime
import javax.annotation.Resource


@Service
class ResourcesServiceImpl : ResourcesService {

    @Resource
    private lateinit var resourceMapper: ResourceMapper

    @Resource
    private lateinit var userMapper: UserMapper

    override fun getAdminResources(): List<GetAdminResourcesResp> {
        val resourceList = resourceMapper.selectList(
            KtQueryWrapper(AdminResource::class.java)
                .orderByAsc(AdminResource::sortNo)
        ).map {
            GetAdminResourcesResp().apply {
                this.id = it.id
                this.name = it.name
                this.parentId = it.parentId
                this.icon = it.icon
                this.defaultResource = it.defaultResource
                this.route = it.route
                this.type = it.type
                this.sortNo = it.sortNo
            }
        }
        val parent = resourceList.filter { it.parentId == null || it.parentId == 0.toLong() }
        parent.forEach {
            getChildrensResources(it, resourceList)
        }
        return parent
    }

    override fun saveOrUpdateResource(resource: AdminResource, loginUserInfo: LoginUserInfo): AdminResource? {
        if (resource.parentId!! > 0) {
            resourceMapper.selectById(resource.parentId)
                ?: throw BusinessException("找不到上级资源信息[${resource.parentId}]")
        }
        if (null == resource.id) {
            resource.creator = loginUserInfo.userId
            resource.creatorName = loginUserInfo.username
            resource.createdAt = LocalDateTime.now()
            resource.deleted = false
            resourceMapper.insert(resource)
        } else {
            Assert.state(resource.parentId != resource.id, "parentId不能与该对象id一直")
            resource.updater = loginUserInfo.userId
            resource.updatedAt = LocalDateTime.now()
            resourceMapper.updateById(resource)
        }
        return resource
    }

    override fun deleteResouce(id: Long): Int {
        return resourceMapper.deleteById(id)
    }

    override fun currentUserResource(userId: Long): List<GetAdminResourcesResp> {
        val user = userMapper.selectById(userId) ?: throw AuthException(BaseResultCode.USER_LOGIN_ERROR)
        val resourceList = resourceMapper.queryRoleResources(user.roleId).map {
            val vo = GetAdminResourcesResp().apply {
                this.id = it.id
                this.name = it.name
                this.parentId = it.parentId
                this.icon = it.icon
                this.defaultResource = it.defaultResource
                this.route = it.route
                this.type = it.type
                this.sortNo = it.sortNo
            }
            vo
        }
        val parent = resourceList.filter { it.parentId == null || it.parentId == 0.toLong() }
        parent.forEach {
            getChildrensResources(it, resourceList)
        }
        return parent
    }

    override fun resourceList(): List<AdminResource> {
        return resourceMapper.selectList(KtQueryWrapper(AdminResource::class.java).orderByAsc(AdminResource::parentId))
    }

    override fun syncResources(syncUrl: String) {
        val resp = HttpUtil.get(syncUrl)
        val baseResult = JSONUtil.toBean(resp, BaseResult::class.java)
        Assert.state(baseResult.isSuccess, baseResult.msg)
        val resources = JSONUtil.toList(JSONUtil.parseArray(baseResult.data), AdminResource::class.java)
        for (resource in resources) {
            val adminResource = resourceMapper.selectById(resource.id)
            if (null == adminResource) {
                val selectOne = resourceMapper.selectOne(
                    KtQueryWrapper(AdminResource::class.java).eq(
                        AdminResource::route,
                        resource.route
                    ).last("limit 1")
                )
                if (null == selectOne) {
                    resourceMapper.insert(resource)
                } else {
                    selectOne.paths = resource.paths
                    resourceMapper.updateById(selectOne)
                }
            } else {
                resourceMapper.updateById(resource)
            }
        }

    }

    private fun getChildrensResources(
        resource: GetAdminResourcesResp,
        resourceList: List<GetAdminResourcesResp>,
    ) {
        val children = resourceList.filter { it.parentId == resource.id }
        children.forEach {
            getChildrensResources(it, resourceList)
        }
        resource.childrens = children
    }
}