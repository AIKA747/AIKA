package com.parsec.aika.order.controller

import com.parsec.aika.order.service.ServicePackageService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RefreshScope
@RestController
class SyncController {

    @Resource
    private lateinit var servicePackageService: ServicePackageService

    @Value("\${sync.api.key:303102534fdf11f086e80affcb889ff7}")
    private var apiKey: String? = null

    @Value("\${sync.servicePackage.url:}")
    private var syncUrl: String? = null

    @GetMapping("/public/sync/service-package")
    fun syncServicePackageList(apiKey: String?): BaseResult<*> {
        if (apiKey != this.apiKey) {
            return BaseResult.failure("api key error")
        }
        return BaseResult.success(servicePackageService.allServicePackageList())
    }

    @PostMapping("/public/sync/service-package")
    fun syncServicePackageList(): BaseResult<*> {
        if (syncUrl.isNullOrEmpty()) {
            return BaseResult.failure("sync url is null")
        }
        servicePackageService.syncServicePackageList(syncUrl!!)
        return BaseResult.success()
    }


}
