package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.UserServiceApplicationTests
import com.parsec.aika.user.mapper.AppUserMapper
import com.parsec.aika.user.model.em.ImageType
import com.parsec.aika.user.model.vo.req.UserImageListReq
import com.parsec.aika.user.model.vo.req.UserImageReq
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class UserImageControllerTest : UserServiceApplicationTests() {

    @Resource
    private lateinit var userImageController: UserImageController

    @Resource
    private lateinit var appUserMapper: AppUserMapper

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/user_image_init.sql")
    fun saveUserImage() {
        val loginUser = LoginUserInfo().apply {
            userId = 100001
            username = "test_user"
        }

        // 测试上传普通图
        val imageReq = UserImageReq().apply {
            type = ImageType.IMAGE
            imageUrl = "http://example.com/image.jpg"
            remark = "test image"
        }
        val imageResult = userImageController.saveUserImage(imageReq, loginUser)
        Assertions.assertEquals(imageResult.code, 0)

        // 测试上传头像
        val avatarReq = UserImageReq().apply {
            type = ImageType.AVATAR
            imageUrl = "http://example.com/avatar.jpg"
            remark = "test avatar"
        }
        val avatarResult = userImageController.saveUserImage(avatarReq, loginUser)
        Assertions.assertEquals(avatarResult.code, 0)

        // 验证用户头像是否更新
        val user = appUserMapper.selectById(loginUser.userId)
        Assertions.assertEquals(user.avatar, avatarReq.imageUrl)

        // 测试头像数量限制
        // 先上传4张头像（加上之前的1张共5张）
        repeat(4) {
            userImageController.saveUserImage(avatarReq, loginUser)
        }

        // 尝试上传第6张头像，应该失败
        try {
            userImageController.saveUserImage(avatarReq, loginUser)
            Assertions.fail("Should throw exception when avatar count exceeds limit")
        } catch (e: Exception) {
            Assertions.assertEquals(e.message, "The number of avatar images cannot exceed 5")
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/user_image_init.sql")
    fun testGetUserImages() {
        val loginUser = LoginUserInfo().apply {
            userId = 100001
            username = "test_user"
        }

        // 先添加一些测试数据
        val imageReq = UserImageReq().apply {
            type = ImageType.IMAGE
            imageUrl = "http://example.com/image.jpg"
            remark = "test image"
        }
        userImageController.saveUserImage(imageReq, loginUser)

        val avatarReq = UserImageReq().apply {
            type = ImageType.AVATAR
            imageUrl = "http://example.com/avatar.jpg"
            remark = "test avatar"
        }
        userImageController.saveUserImage(avatarReq, loginUser)

        // 测试获取所有图片
        val listReq = UserImageListReq().apply {
            pageNo = 1
            pageSize = 10
        }
        val listResult = userImageController.getUserImages(listReq, loginUser)
        Assertions.assertEquals(listResult.code, 0)
        Assertions.assertTrue(listResult.data.total >= 2)

        // 测试按类型筛选
        listReq.type = ImageType.AVATAR
        val avatarResult = userImageController.getUserImages(listReq, loginUser)
        Assertions.assertEquals(avatarResult.code, 0)
        Assertions.assertTrue(avatarResult.data.list.all { it.type == ImageType.AVATAR })
        // 验证checked字段
        val user = appUserMapper.selectById(loginUser.userId)
        Assertions.assertTrue(avatarResult.data.list.any { it.checked == (it.imageUrl == user.avatar) })
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/user_image_init.sql")
    fun testDeleteUserImage() {
        val loginUser = LoginUserInfo().apply {
            userId = 100001
            username = "test_user"
        }

        // 先添加一个头像
        val avatarReq = UserImageReq().apply {
            type = ImageType.AVATAR
            imageUrl = "http://example.com/avatar1.jpg"
            remark = "test avatar 1"
        }
        userImageController.saveUserImage(avatarReq, loginUser)

        // 再添加一个头像
        avatarReq.imageUrl = "http://example.com/avatar2.jpg"
        userImageController.saveUserImage(avatarReq, loginUser)

        // 获取第一个头像的ID
        val listReq = UserImageListReq().apply {
            type = ImageType.AVATAR
            pageNo = 1
            pageSize = 10
        }
        val listResult = userImageController.getUserImages(listReq, loginUser)
        val firstImageId = listResult.data.list[0].id!!
        val secondImageId = listResult.data.list[1].id!!

        // 删除第一个头像
        val deleteResult = userImageController.deleteUserImage(firstImageId, loginUser)
        Assertions.assertEquals(deleteResult.code, 0)

        // 验证用户头像是否更新为另一个头像
        val user = appUserMapper.selectById(loginUser.userId)
        Assertions.assertEquals(user.avatar, "http://example.com/avatar1.jpg")

        // 再删除一个头像
        val deleteResult2 = userImageController.deleteUserImage(secondImageId, loginUser)
        Assertions.assertEquals(deleteResult2.code, 0)

        // 验证用户头像是否更新为null
        val user2 = appUserMapper.selectById(loginUser.userId)
        Assertions.assertEquals(user2.avatar, null)

    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/user_image_init.sql")
    fun testSetActiveAvatar() {
        val loginUser = LoginUserInfo().apply {
            userId = 100001
            username = "test_user"
        }

        // 添加两个头像
        val avatarReq1 = UserImageReq().apply {
            type = ImageType.AVATAR
            imageUrl = "http://example.com/avatar1.jpg"
            remark = "test avatar 1"
        }
        userImageController.saveUserImage(avatarReq1, loginUser)

        val avatarReq2 = UserImageReq().apply {
            type = ImageType.AVATAR
            imageUrl = "http://example.com/avatar2.jpg"
            remark = "test avatar 2"
        }
        userImageController.saveUserImage(avatarReq2, loginUser)

        // 获取第二个头像的ID
        val listReq = UserImageListReq().apply {
            type = ImageType.AVATAR
            pageNo = 1
            pageSize = 10
        }
        val listResult = userImageController.getUserImages(listReq, loginUser)
        val secondImageId = listResult.data.list[1].id!!

        // 设置第二个头像为当前头像
        val setActiveResult = userImageController.setActiveAvatar(mapOf("id" to secondImageId), loginUser)
        Assertions.assertEquals(setActiveResult.code, 0)

        // 验证用户头像是否更新
        val user = appUserMapper.selectById(loginUser.userId)
        Assertions.assertEquals(user.avatar, "http://example.com/avatar1.jpg")

        // 验证非头像类型不能设为当前头像
        val imageReq = UserImageReq().apply {
            type = ImageType.IMAGE
            imageUrl = "http://example.com/image.jpg"
            remark = "test image"
        }
        userImageController.saveUserImage(imageReq, loginUser)
        val imageList = userImageController.getUserImages(UserImageListReq().apply {
            type = ImageType.IMAGE
            pageNo = 1
            pageSize = 10
        }, loginUser)
        val imageId = imageList.data.list[0].id!!

        try {
            userImageController.setActiveAvatar(mapOf("id" to imageId), loginUser)
            Assertions.fail("Should throw exception when setting non-avatar image as active")
        } catch (e: Exception) {
            Assertions.assertEquals(e.message, "Avatar image not found")
        }
    }
} 
