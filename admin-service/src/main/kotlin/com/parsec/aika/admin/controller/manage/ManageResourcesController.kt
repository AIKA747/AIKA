package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.resp.GetAdminResourcesResp
import com.parsec.aika.admin.service.ResourcesService
import com.parsec.aika.common.model.entity.AdminResource
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageResourcesController {

    @Resource
    private lateinit var resourcesService: ResourcesService

    @GetMapping("/resources")
    fun getAdminResources(): BaseResult<List<GetAdminResourcesResp>> {
        return BaseResult.success(resourcesService.getAdminResources())
    }

    @PostMapping("/resources")
    fun saveOrUpdateResource(
        @RequestBody resource: AdminResource, loginUserInfo: LoginUserInfo
    ): BaseResult<AdminResource> {
        return BaseResult.success(resourcesService.saveOrUpdateResource(resource, loginUserInfo))
    }

    @DeleteMapping("/resources/{id}")
    fun deleteResouce(@PathVariable id: Long): BaseResult<Int> {
        return BaseResult.success(resourcesService.deleteResouce(id))
    }
}