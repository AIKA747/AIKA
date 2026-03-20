package com.parsec.aika.user.service

import com.parsec.aika.user.model.entity.PlatformType
import com.parsec.aika.user.model.entity.ThirdPlatform

interface ThirdPlatformService {
    fun queryBindUserInfo(platformId: String?, platform: PlatformType): ThirdPlatform?

    fun bindUserInfo(userId: Long?, platformId: String?, platform: PlatformType)
    fun deleteUserBindInfo(userId: Long?)
}