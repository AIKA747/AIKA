//package com.parsec.aika.order.controller.manage
//
//import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
//import com.parsec.aika.common.mapper.ServicePackageMapper
//import com.parsec.aika.common.model.em.ServicePackageStatusEnum
//import com.parsec.aika.common.model.em.UserTypeEnum
//import com.parsec.aika.common.model.entity.ServicePackage
//import com.parsec.aika.common.model.vo.LoginUserInfo
//import com.parsec.aika.order.OrderServiceApplicationTests
//import com.parsec.aika.order.model.vo.req.ManageServicePackageCreateVo
//import com.parsec.aika.order.model.vo.req.ManageServicePackageQueryVo
//import com.parsec.aika.order.model.vo.req.ManageServicePackageStatusUpdateVo
//import com.parsec.aika.order.model.vo.req.ManageServicePackageUpdateVo
//import org.junit.jupiter.api.Assertions
//import org.junit.jupiter.api.Test
//import org.springframework.test.annotation.Rollback
//import org.springframework.test.context.jdbc.Sql
//import org.springframework.transaction.annotation.Transactional
//import java.time.LocalDateTime
//import java.time.format.DateTimeFormatter
//import javax.annotation.Resource
//
//internal class ManageServicePackageControllerTest : OrderServiceApplicationTests() {
//
//    @Resource
//    private lateinit var servicePackageController: ManageServicePackageController
//
//    @Resource
//    private lateinit var servicePackageMapper: ServicePackageMapper
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/service_package_init.sql")
//    fun servicePackageList() {
//        val loginUser = LoginUserInfo().apply {
//            this.userId = 100
//            this.userType = UserTypeEnum.ADMINUSER
//        }
//        // 查询服务包列表
//        var result = servicePackageController.servicePackageList(ManageServicePackageQueryVo(), loginUser)
//        Assertions.assertEquals(result.code, 0)
//        Assertions.assertTrue(result.data.total > 0)
//
//        // 传入查询条件——服务包名称
//        var queryVo = ManageServicePackageQueryVo().apply {
//            this.packageName = "22"
//        }
//        result = servicePackageController.servicePackageList(queryVo, loginUser)
//        Assertions.assertEquals(result.code, 0)
//        Assertions.assertTrue(result.data.total > 0)
//        // 查询出来的数据中的服务包名称都包含传入的服务包名称
//        result.data.list.map {
//            Assertions.assertTrue(it.packageName!!.contains(queryVo.packageName!!))
//        }
//
//        // 传入查询条件——是否可见
//        queryVo = ManageServicePackageQueryVo().apply {
//            this.visiblity = true
//        }
//        result = servicePackageController.servicePackageList(queryVo, loginUser)
//        Assertions.assertEquals(result.code, 0)
//        Assertions.assertTrue(result.data.total > 0)
//        // 查询出来的数据中的都是可见的
//        result.data.list.map {
//            // 由于返回数据未返回是否可见字段，故根据返回的id再查询一次进行判断
//            val vo = servicePackageMapper.selectById(it.id)
//            Assertions.assertTrue(vo.visiblity!!)
//        }
//
//        // 传入查询复合条件——状态、名称
//        queryVo = ManageServicePackageQueryVo().apply {
//            this.packageName = "01"
//            this.status = ServicePackageStatusEnum.Inactive
//        }
//        result = servicePackageController.servicePackageList(queryVo, loginUser)
//        Assertions.assertEquals(result.code, 0)
//        Assertions.assertTrue(result.data.total > 0)
//        // 查询出来的数据中的都符合条件
//        result.data.list.map {
//            Assertions.assertTrue(it.packageName!!.contains(queryVo.packageName!!))
//            Assertions.assertEquals(it.status, queryVo.status)
//        }
//
//        // 传入查询条件——时间段查询
//        queryVo = ManageServicePackageQueryVo().apply {
//            this.minCreatedAt = "2024-01-02 00:00:00"
//            this.maxCreatedAt = "2024-10-02 00:00:00"
//        }
//        result = servicePackageController.servicePackageList(queryVo, loginUser)
//        Assertions.assertEquals(result.code, 0)
//        Assertions.assertTrue(result.data.total > 0)
//        // 查询出来的数据中的都符合条件
//        result.data.list.map {
//            Assertions.assertTrue(
//                it.createdAt!!.isBefore(
//                    LocalDateTime.parse(
//                        queryVo.maxCreatedAt,
//                        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
//                    )
//                )
//            )
//            Assertions.assertTrue(
//                it.createdAt!!.isAfter(
//                    LocalDateTime.parse(
//                        queryVo.minCreatedAt,
//                        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
//                    )
//                )
//            )
//        }
//    }
//
////    @Test
////    @Rollback
////    @Transactional
////    @Sql("/sql/service_package_init.sql")
//    fun servicePackageCreateTest() {
//        val loginUser = LoginUserInfo().apply {
//            this.userId = 100
//            this.username = "管理员01test"
//            this.userType = UserTypeEnum.ADMINUSER
//        }
//        // 创建服务包
//        // 不传入服务包名称，报错
//        try {
//            servicePackageController.servicePackageCreate(ManageServicePackageCreateVo(), loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "服务包名称不能为空")
//        }
//        // 传入已存在的服务包名称，报错
//        try {
//            servicePackageController.servicePackageCreate(ManageServicePackageCreateVo().apply {
//                this.packageName = "test-554345"
//            }, loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "该服务包名称已存在")
//        }
//        // 传入正确参数
//        val vo = ManageServicePackageCreateVo().apply {
//            this.packageName = "测试服务包-001010000"
//            this.cover = "asdf"
//            this.description = "asdfjlkjklj"
//            this.price = 14600
//            this.subPeriod = 12
//            this.visiblity = false
//        }
//        val result = servicePackageController.servicePackageCreate(vo, loginUser)
//        Assertions.assertEquals(result.code, 0)
//        // 新增的数据，默认状态为 未激活
//        val saveVo = servicePackageMapper.selectOne(
//            KtQueryWrapper(ServicePackage::class.java).eq(
//                ServicePackage::packageName,
//                vo.packageName
//            ).last("limit 1")
//        )
//        Assertions.assertEquals(saveVo.status, ServicePackageStatusEnum.Inactive)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/service_package_init.sql")
//    fun servicePackageUpdateTest() {
//        val loginUser = LoginUserInfo().apply {
//            this.userId = 100
//            this.username = "管理员01test"
//            this.userType = UserTypeEnum.ADMINUSER
//        }
//        // 不传id，报错
//        try {
//            servicePackageController.servicePackageUpdate(ManageServicePackageUpdateVo(), loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "服务包id不能为空")
//        }
//        // 不传服务包名称，报错
//        try {
//            servicePackageController.servicePackageUpdate(ManageServicePackageUpdateVo().apply { this.id=1 }, loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "服务包名称不能为空")
//        }
//        // 传入不存在对应数据的id值，报错
//        var updateVo = ManageServicePackageUpdateVo().apply {
//            this.id = 12345432343
//            this.packageName = "adsf"
//        }
//        try {
//            servicePackageController.servicePackageUpdate(updateVo, loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "该服务包信息不存在")
//        }
//        // 传入存在数据的id值，但名称是其他数据已存在的，报错
//        updateVo = ManageServicePackageUpdateVo().apply {
//            this.id = 10000001
//            this.packageName = "test-554345"
//        }
//        try {
//            servicePackageController.servicePackageUpdate(updateVo, loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "该服务包名称已存在")
//        }
//        // 传入本id对应的名称
//        updateVo = ManageServicePackageUpdateVo().apply {
//            this.id = 10000001
//            this.packageName = "测试服务包-00101"
//            this.description = "adkfjaskdjflkadsf"
//        }
//        // 修改前的详情字段不等于传入的详情字段
//        val updateBefore = servicePackageMapper.selectById(updateVo.id)
//        Assertions.assertNotEquals(updateBefore.description, updateVo.description)
//        val result = servicePackageController.servicePackageUpdate(updateVo, loginUser)
//        Assertions.assertEquals(result.code, 0)
//        // 修改后的对象中的详情为传入的详情
//        val updateAfter = servicePackageMapper.selectById(updateVo.id)
//        Assertions.assertEquals(updateAfter.description, updateVo.description)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/service_package_init.sql")
//    fun servicePackageStatusUpdateTest() {
//        val loginUser = LoginUserInfo().apply {
//            this.userId = 100
//            this.username = "管理员01测试"
//            this.userType = UserTypeEnum.ADMINUSER
//        }
//        // 不传入id值
//        try {
//            servicePackageController.servicePackageStatusUpdate(ManageServicePackageStatusUpdateVo(), loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "服务包id不能为空")
//        }
//        // 不传入状态值
//        try {
//            servicePackageController.servicePackageStatusUpdate(ManageServicePackageStatusUpdateVo().apply {
//                this.id = 133
//            }, loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "服务包状态不能为空")
//        }
//        // 传入错误的id值
//        var reqVo = ManageServicePackageStatusUpdateVo().apply {
//            this.id = 133
//            this.status = ServicePackageStatusEnum.Active
//        }
//        try {
//            servicePackageController.servicePackageStatusUpdate(reqVo, loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "该服务包信息不存在")
//        }
//        // 传入正确参数
//        reqVo = ManageServicePackageStatusUpdateVo().apply {
//            this.id = 10000001
//            this.status = ServicePackageStatusEnum.Active
//        }
//        // 修改前的状态不等于传入的状态
//        val updateBeforeVo = servicePackageMapper.selectById(reqVo.id)
//        Assertions.assertNotEquals(updateBeforeVo.status, reqVo.status)
//        val result = servicePackageController.servicePackageStatusUpdate(reqVo, loginUser)
//        Assertions.assertEquals(result.code, 0)
//        // 修改后的状态等于传入的状态
//        val updateAfterVo = servicePackageMapper.selectById(reqVo.id)
//        Assertions.assertEquals(updateAfterVo.status, reqVo.status)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/service_package_init.sql")
//    fun servicePackageDeleteTest() {
//        val loginUser = LoginUserInfo().apply {
//            this.userId = 100
//            this.userType = UserTypeEnum.ADMINUSER
//        }
//        // 传入不存在数据的id，报错
//        var packageId = 122122222L
//        val packageVo = servicePackageMapper.selectById(packageId)
//        Assertions.assertNull(packageVo)
//        try {
//            servicePackageController.servicePackageDelete(packageId, loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "该服务包信息不存在")
//        }
//
//        // 传入存在数据的id
//        packageId = 10000001L
//        // 删除前，能查询到数据
//        val vo = servicePackageMapper.selectById(packageId)
//        Assertions.assertNotNull(vo)
//        // 调用删除方法
//        val result = servicePackageController.servicePackageDelete(packageId, loginUser)
//        Assertions.assertEquals(result.code, 0)
//        // 调用删除方法后，无法查询到该数据
//        val deleteAfterVo = servicePackageMapper.selectById(packageId)
//        Assertions.assertNull(deleteAfterVo)
//    }
//
//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/service_package_init.sql")
//    fun servicePackageDetailTest() {
//        val loginUser = LoginUserInfo().apply {
//            this.userId = 100
//            this.userType = UserTypeEnum.ADMINUSER
//        }
//        // 传入不存在的数据id值，报错
//        try {
//            servicePackageController.servicePackageDetail(111121212121, loginUser)
//            Assertions.fail()
//        } catch (e: Exception) {
//            Assertions.assertEquals(e.message, "该服务包信息不存在")
//        }
//        // 传入存在的id
//        val packageId = 10000001L
//        val result = servicePackageController.servicePackageDetail(packageId, loginUser)
//        // 通过mapper直接查询到对象数据
//        val detail = servicePackageMapper.selectById(packageId)
//        Assertions.assertEquals(result.code, 0)
//        Assertions.assertEquals(result.data.id, packageId)
//        Assertions.assertEquals(result.data.id, detail.id)
//        Assertions.assertEquals(result.data.packageName, detail.packageName)
//    }
//}