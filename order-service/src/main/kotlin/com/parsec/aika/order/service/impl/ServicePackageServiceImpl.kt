package com.parsec.aika.order.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.common.mapper.OrderMapper
import com.parsec.aika.common.mapper.ServicePackageMapper
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.ServicePackageStatusEnum
import com.parsec.aika.common.model.entity.Order
import com.parsec.aika.common.model.entity.ServicePackage
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.order.model.vo.req.ManageServicePackageCreateVo
import com.parsec.aika.order.model.vo.req.ManageServicePackageQueryVo
import com.parsec.aika.order.model.vo.req.ManageServicePackageStatusUpdateVo
import com.parsec.aika.order.model.vo.req.ManageServicePackageUpdateVo
import com.parsec.aika.order.model.vo.resp.AppServicePackageVo
import com.parsec.aika.order.model.vo.resp.ManageServicePackageListVo
import com.parsec.aika.order.service.ServicePackageService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.beans.BeanUtils
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource

@Service
class ServicePackageServiceImpl : ServicePackageService {

    @Resource
    private lateinit var servicePackageMapper: ServicePackageMapper

    @Resource
    private lateinit var orderMapper: OrderMapper

    override fun manageServicePackageList(
        queryVo: ManageServicePackageQueryVo, user: LoginUserInfo
    ): PageResult<ManageServicePackageListVo> {
        PageHelper.startPage<ManageServicePackageListVo>(queryVo.pageNo!!, queryVo.pageSize!!)
        return PageUtil<ManageServicePackageListVo>().page(servicePackageMapper.manageList(queryVo))
    }

    override fun manageServicePackageCreate(reqVo: ManageServicePackageCreateVo, user: LoginUserInfo) {
        // 判断服务包名称是否已存在
        val checkNameVo = servicePackageMapper.selectOne(
            KtQueryWrapper(ServicePackage::class.java).eq(ServicePackage::packageName, reqVo.packageName)
                .last("limit 1")
        )
        Assert.isNull(checkNameVo, "The service package name already exists")
        val servicePackage = ServicePackage()
        BeanUtils.copyProperties(reqVo, servicePackage)
        // 默认状态为未激活
        servicePackage.status = ServicePackageStatusEnum.Inactive
        servicePackage.creator = user.userId
        servicePackage.creatorName = user.username
        servicePackage.createdAt = LocalDateTime.now()
        servicePackageMapper.insert(servicePackage)
    }

    override fun manageServicePackageUpdate(reqVo: ManageServicePackageUpdateVo, user: LoginUserInfo) {
        // 根据传入id，判断该操作数据是否存在
        val detailVo = servicePackageMapper.selectById(reqVo.id)
        Assert.notNull(detailVo, "The service package information does not exist")
        // 判断名称是否已存在
        val checkNameVo = servicePackageMapper.selectOne(
            KtQueryWrapper(ServicePackage::class.java).eq(
                ServicePackage::packageName, reqVo.packageName
            ).last("limit 1")
        )
        Assert.isTrue(checkNameVo == null || checkNameVo.id == reqVo.id, "The service package name already exists")
        val packageVo = ServicePackage().apply {
            this.id = detailVo.id
            this.packageName = reqVo.packageName
            this.cover = reqVo.cover
            this.description = reqVo.description
            this.price = reqVo.price
            this.subPeriod = reqVo.subPeriod
            this.visiblity = reqVo.visiblity
            this.purchaseLimit = reqVo.purchaseLimit
            this.updater = user.userId
            this.updatedAt = LocalDateTime.now()
            this.sortNo = reqVo.sortNo ?: 0
        }
        servicePackageMapper.updateById(packageVo)
    }

    override fun manageServicePackageStatusUpdate(req: ManageServicePackageStatusUpdateVo, user: LoginUserInfo) {
        // 根据传入id，判断该操作数据是否存在
        val detailVo = servicePackageMapper.selectById(req.id)
        Assert.notNull(detailVo, "The service package information does not exist")
        servicePackageMapper.updateById(ServicePackage().apply {
            this.id = req.id
            this.status = req.status
        })
    }

    override fun manageServicePackageDelete(id: Long, user: LoginUserInfo) {
        // 验证id对应的数据是否存在
        val detailVo = servicePackageMapper.selectById(id)
        Assert.notNull(detailVo, "The service package information does not exist")
        val count = orderMapper.selectCount(KtQueryWrapper(Order::class.java).eq(Order::packageId, id))
        Assert.state(count < 1, "Cannot delete service packages with existing order information")
        // 删除服务包
        servicePackageMapper.deleteById(id)
    }

    override fun manageServicePackageDetail(id: Long): ServicePackage {
        val detail = servicePackageMapper.selectById(id)
        Assert.notNull(detail, "The service package information does not exist")
        return detail
    }

    override fun appServicePackageList(pageVo: PageVo, user: LoginUserInfo): PageResult<AppServicePackageVo> {
        PageHelper.startPage<AppServicePackageVo>(pageVo.pageNo!!, pageVo.pageSize!!)
        val list = servicePackageMapper.appList()
        list.filter { it.purchaseLimit!! > 0 }.forEach {
            it.purchaseNum = orderMapper.selectCount(
                KtQueryWrapper(Order::class.java).eq(Order::userId, user.userId).eq(Order::packageId, it.id)
                    .eq(Order::status, OrderStatusEnum.Success)
            )
        }
        return PageUtil<AppServicePackageVo>().page(list)
    }

    override fun allServicePackageList(): List<ServicePackage>? {
        return servicePackageMapper.selectList(
            KtQueryWrapper(ServicePackage::class.java)
        )
    }

    override fun syncServicePackageList(url: String) {
        //获取生产环境的服务包列表
        val resp = HttpUtil.get(url)
        val baseResult = JSONUtil.toBean(resp, BaseResult::class.java)
        Assert.state(baseResult.isSuccess, baseResult.msg)
        val servicePackages = JSONUtil.toList(JSONUtil.parseArray(baseResult.data), ServicePackage::class.java)
        servicePackages.forEach {
            val detail = servicePackageMapper.selectById(it.id)
            if (detail == null) {
                servicePackageMapper.insert(it)
            }
        }
    }
}