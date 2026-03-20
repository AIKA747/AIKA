package com.parsec.aika.user.service

import com.parsec.aika.common.model.bo.AuthorSyncBO

/**
 * 同步作者信息
 */
interface SyncAuthorService {

    fun syncAuthor(authorSyncBO: AuthorSyncBO)

}