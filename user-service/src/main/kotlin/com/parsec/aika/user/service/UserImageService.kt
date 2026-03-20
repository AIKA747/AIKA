package com.parsec.aika.user.service

import com.parsec.aika.user.model.vo.req.UserImageListReq
import com.parsec.aika.user.model.vo.req.UserImageReq
import com.parsec.aika.user.model.vo.resp.UserImageResp
import com.parsec.trantor.common.response.PageResult

interface UserImageService {
    fun saveUserImage(req: UserImageReq, userId: Long): Boolean

    fun getUserImages(req: UserImageListReq, userId: Long): PageResult<UserImageResp>

    fun deleteUserImage(id: Long, userId: Long)

    fun setActiveAvatar(id: Long, userId: Long)
} 
