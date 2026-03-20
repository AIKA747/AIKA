package com.parsec.aika.order.service

import com.parsec.aika.common.model.entity.ServicePackage
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.order.model.vo.req.ManageServicePackageCreateVo
import com.parsec.aika.order.model.vo.req.ManageServicePackageQueryVo
import com.parsec.aika.order.model.vo.req.ManageServicePackageStatusUpdateVo
import com.parsec.aika.order.model.vo.req.ManageServicePackageUpdateVo
import com.parsec.aika.order.model.vo.resp.AppServicePackageVo
import com.parsec.aika.order.model.vo.resp.ManageServicePackageListVo
import com.parsec.trantor.common.response.PageResult

interface ServicePackageService {

    /**
     * 管理端——服务包列表
     */
    fun manageServicePackageList(
        queryVo: ManageServicePackageQueryVo,
        user: LoginUserInfo
    ): PageResult<ManageServicePackageListVo>

    /**
     * 管理端——新建服务包
     */
    fun manageServicePackageCreate(reqVo: ManageServicePackageCreateVo, user: LoginUserInfo)

    /**
     * 管理端——修改服务包
     */
    fun manageServicePackageUpdate(reqVo: ManageServicePackageUpdateVo, user: LoginUserInfo)

    /**
     * 管理端——修改服务包状态
     */
    fun manageServicePackageStatusUpdate(req: ManageServicePackageStatusUpdateVo, user: LoginUserInfo)

    /**
     * 管理端——删除服务包
     */
    fun manageServicePackageDelete(id: Long, user: LoginUserInfo)

    /**
     * 管理端——服务包详情
     */
    fun manageServicePackageDetail(id: Long): ServicePackage

    /**
     * app端——服务包列表
     * 根本条件：未删除的、已激活的、可见的
     */
    fun appServicePackageList(pageVo: PageVo, user: LoginUserInfo): PageResult<AppServicePackageVo>
    fun allServicePackageList(): List<ServicePackage>?
    fun syncServicePackageList(url: String)
}