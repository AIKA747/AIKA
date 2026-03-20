package com.parsec.aika.order.controller.manage

import com.parsec.aika.common.model.entity.ServicePackage
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.ManageServicePackageCreateVo
import com.parsec.aika.order.model.vo.resp.ManageServicePackageListVo
import com.parsec.aika.order.model.vo.req.ManageServicePackageQueryVo
import com.parsec.aika.order.model.vo.req.ManageServicePackageStatusUpdateVo
import com.parsec.aika.order.model.vo.req.ManageServicePackageUpdateVo
import com.parsec.aika.order.service.ServicePackageService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageServicePackageController {

    @Resource
    private lateinit var servicePackageService: ServicePackageService

    /**
     * 服务包管理列表
     */
    @GetMapping("/manage/service-package")
    fun servicePackageList(queryVo: ManageServicePackageQueryVo, user: LoginUserInfo): BaseResult<PageResult<ManageServicePackageListVo>> {
        return BaseResult.success(servicePackageService.manageServicePackageList(queryVo, user))
    }

    /**
     * 新建服务包
     */
    @PostMapping("/manage/service-package")
    fun servicePackageCreate(@Validated @RequestBody reqVo: ManageServicePackageCreateVo, user: LoginUserInfo): BaseResult<Void> {
        servicePackageService.manageServicePackageCreate(reqVo, user)
        return BaseResult.success()
    }

    /**
     * 修改服务包状态
     */
    @PatchMapping("/manage/service-package/status")
    fun servicePackageStatusUpdate(@Validated @RequestBody req: ManageServicePackageStatusUpdateVo, user: LoginUserInfo): BaseResult<Void> {
        servicePackageService.manageServicePackageStatusUpdate(req, user)
        return BaseResult.success()
    }


    /**
     * 删除服务包
     */
    @DeleteMapping("/manage/service-package/{id}")
    fun servicePackageDelete(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Void> {
        servicePackageService.manageServicePackageDelete(id, user)
        return BaseResult.success()
    }

    /**
     * 服务包详情
     */
    @GetMapping("/manage/service-package/{id}")
    fun servicePackageDetail(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<ServicePackage> {
        return BaseResult.success(servicePackageService.manageServicePackageDetail(id))
    }


    /**
     * 修改服务包
     */
    @PutMapping("/manage/service-package")
    fun servicePackageUpdate(@Validated @RequestBody reqVo: ManageServicePackageUpdateVo, user: LoginUserInfo): BaseResult<Void> {
        servicePackageService.manageServicePackageUpdate(reqVo, user)
        return BaseResult.success()
    }


}