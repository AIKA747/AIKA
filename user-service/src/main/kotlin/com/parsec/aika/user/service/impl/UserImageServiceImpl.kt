package com.parsec.aika.user.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.user.mapper.AppUserMapper
import com.parsec.aika.user.mapper.UserImageMapper
import com.parsec.aika.user.model.em.ImageType
import com.parsec.aika.user.model.entity.AppUserInfo
import com.parsec.aika.user.model.entity.UserImage
import com.parsec.aika.user.model.vo.req.UserImageListReq
import com.parsec.aika.user.model.vo.req.UserImageReq
import com.parsec.aika.user.model.vo.resp.UserImageResp
import com.parsec.aika.user.service.UserImageService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@Service
class UserImageServiceImpl : UserImageService {

    @Resource
    private lateinit var userImageMapper: UserImageMapper

    @Resource
    private lateinit var appUserMapper: AppUserMapper

    override fun getUserImages(req: UserImageListReq, userId: Long): PageResult<UserImageResp> {
        val page = Page<UserImage>(req.pageNo!!.toLong(), req.pageSize!!.toLong())

        val wrapper = KtQueryWrapper(UserImage::class.java)
            .eq(UserImage::userId, userId)
            .eq(UserImage::deleted, false)

        req.type?.let {
            wrapper.eq(UserImage::type, it)
        }

        wrapper.orderByDesc(UserImage::id)

        val pageResult = userImageMapper.selectPage(page, wrapper)
        val user = appUserMapper.selectById(userId)
        val respList = pageResult.records.map {
            UserImageResp().apply {
                this.id = it.id
                this.createdAt = it.createdAt
                this.type = it.type
                this.imageUrl = it.imageUrl
                this.remark = it.remark
                if (it.type == ImageType.AVATAR) {
                    this.checked = it.imageUrl == user.avatar
                }
            }
        }

        return PageResult<UserImageResp>().apply {
            this.total = pageResult.total
            this.pageNum = pageResult.current
            this.pageSize = pageResult.size
            this.pages = pageResult.pages
            this.list = respList
        }
    }

    @Transactional
    override fun deleteUserImage(id: Long, userId: Long) {
        val image = userImageMapper.selectById(id)
        if (image == null || image.userId != userId) {
            throw BusinessException("Image not found")
        }

        userImageMapper.deleteById(id)

        // 如果删除的是当前头像,需要更新用户头像
        val user = appUserMapper.selectById(userId)
        if (image.type == ImageType.AVATAR && image.imageUrl == user.avatar) {
            val avatarWrapper = KtQueryWrapper(UserImage::class.java)
                .eq(UserImage::userId, userId)
                .eq(UserImage::type, ImageType.AVATAR)
                .eq(UserImage::deleted, false)
                .orderByDesc(UserImage::createdAt)
                .last("limit 1")

            val newAvatar = userImageMapper.selectOne(avatarWrapper)
            // 如果新头像为空,则设置头像为null
            val updateWrapper = KtUpdateWrapper(AppUserInfo::class.java)
                .set(AppUserInfo::avatar, newAvatar?.imageUrl)
                .eq(AppUserInfo::id, userId)
            appUserMapper.update(AppUserInfo().apply {
                this.id = userId
            }, updateWrapper)
        }
    }

    @Transactional
    override fun setActiveAvatar(id: Long, userId: Long) {
        val image = userImageMapper.selectById(id)
        if (image == null || image.userId != userId || image.type != ImageType.AVATAR) {
            throw BusinessException("Avatar image not found")
        }

        val user = appUserMapper.selectById(userId)
        user.avatar = image.imageUrl
        appUserMapper.updateById(user)
    }

    @Transactional
    override fun saveUserImage(req: UserImageReq, userId: Long): Boolean {
        // 如果是头像类型,检查数量限制
        if (req.type == ImageType.AVATAR) {
            val wrapper = KtQueryWrapper(UserImage::class.java)
                .eq(UserImage::userId, userId)
                .eq(UserImage::type, ImageType.AVATAR)
                .eq(UserImage::deleted, false)
            val count = userImageMapper.selectCount(
                wrapper
            )
            if (count >= 5) {
                throw BusinessException("The number of avatar images cannot exceed 5")
            }
        }

        // 保存图片记录
        val userImage = UserImage().apply {
            this.userId = userId
            this.type = req.type
            this.imageUrl = req.imageUrl
            this.remark = req.remark
            this.deleted = false
        }
        userImageMapper.insert(userImage)

        // 如果是头像,更新用户头像
        if (req.type == ImageType.AVATAR) {
            val user = appUserMapper.selectById(userId)
            user?.let {
                it.avatar = req.imageUrl
                appUserMapper.updateById(it)
            }
        }

        return true
    }
} 
