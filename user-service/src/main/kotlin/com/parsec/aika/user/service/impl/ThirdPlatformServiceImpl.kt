package com.parsec.aika.user.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.parsec.aika.user.mapper.ThirdPlatformMapper
import com.parsec.aika.user.model.entity.PlatformType
import com.parsec.aika.user.model.entity.ThirdPlatform
import com.parsec.aika.user.service.ThirdPlatformService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ThirdPlatformServiceImpl : ThirdPlatformService {

    @Autowired
    private lateinit var thirdPlatformMapper: ThirdPlatformMapper

    override fun queryBindUserInfo(platformId: String?, platform: PlatformType): ThirdPlatform? {
        return thirdPlatformMapper.selectOne(
            KtQueryWrapper(ThirdPlatform::class.java).eq(ThirdPlatform::platform, platform)
                .eq(ThirdPlatform::platformId, platformId).orderByDesc(ThirdPlatform::id).last("limit 1")
        )
    }

    override fun bindUserInfo(userId: Long?, platformId: String?, platform: PlatformType) {
        thirdPlatformMapper.insert(ThirdPlatform().apply {
            this.platform = platform
            this.userId = userId
            this.platformId = platformId
        })
    }

    override fun deleteUserBindInfo(userId: Long?) {
        thirdPlatformMapper.delete(KtUpdateWrapper(ThirdPlatform::class.java).eq(ThirdPlatform::userId, userId))
    }
}