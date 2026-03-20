package com.parsec.aika.admin.service

import com.parsec.aika.admin.model.vo.resp.GetAdminResourcesResp
import com.parsec.aika.common.model.entity.AdminResource
import com.parsec.aika.common.model.vo.LoginUserInfo


interface ResourcesService {
    fun getAdminResources(): List<GetAdminResourcesResp>
    fun saveOrUpdateResource(resource: AdminResource, loginUserInfo: LoginUserInfo): AdminResource?
    fun deleteResouce(id: Long): Int
    fun currentUserResource(userId: Long): List<GetAdminResourcesResp>
    fun resourceList(): List<AdminResource>
    fun syncResources(syncUrl: String)
}