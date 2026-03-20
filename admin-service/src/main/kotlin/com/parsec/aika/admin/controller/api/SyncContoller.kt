package com.parsec.aika.admin.controller.api

import com.parsec.aika.admin.service.ResourcesService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RefreshScope
@RestController
class SyncContoller {

    @Value("\${sync.api.key:303102534fdf11f086e80affcb889ee6}")
    private var apiKey: String? = null

    @Value("\${sync.resource.url:}")
    private var syncUrl: String? = null

    @Resource
    private lateinit var resourcesService: ResourcesService

    @GetMapping("/public/sync/resources")
    fun resourceList(apiKey: String?): BaseResult<*> {
        if (apiKey != this.apiKey) {
            return BaseResult.failure("apiKey is error")
        }
        return BaseResult.success(resourcesService.resourceList())
    }

    @PostMapping("/public/sync/resources")
    fun syncResourceList(): BaseResult<*> {
        if (syncUrl.isNullOrEmpty()) {
            return BaseResult.failure("syncUrl is null")
        }
        resourcesService.syncResources(syncUrl!!)
        return BaseResult.success()
    }
}