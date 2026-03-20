package com.parsec.aika.order.controller.app

import com.parsec.aika.common.aspect.TranslateResult
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.order.model.vo.resp.AppServicePackageVo
import com.parsec.aika.order.service.ServicePackageService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppServicePackageController {

    @Resource
    private lateinit var servicePackageService: ServicePackageService

    /**
     * 服务包列表
     * 查询未删除的、已激活的、可见的服务包
     */
    @TranslateResult
    @GetMapping("/app/service-packages")
    fun servicePackages(pageVo: PageVo, user: LoginUserInfo): BaseResult<PageResult<AppServicePackageVo>> {
        return BaseResult.success(servicePackageService.appServicePackageList(pageVo, user))
    }


}