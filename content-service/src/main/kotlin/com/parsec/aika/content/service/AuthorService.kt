package com.parsec.aika.content.service

import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.FollowRelation
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.model.vo.req.GetAuthorReq
import com.parsec.aika.common.model.vo.req.PostAppFollowAuthorReq
import com.parsec.aika.common.model.vo.resp.BlockedAuthorResp
import com.parsec.aika.common.model.vo.resp.GetAuthorResp
import com.parsec.aika.common.model.vo.resp.GetFollowCountResp
import com.parsec.trantor.common.response.PageResult

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/22.
 */
interface AuthorService {

    fun authorPage(req: GetAuthorReq, userInfo: LoginUserInfo): PageResult<GetAuthorResp>
    fun doFollowAuthor(req: PostAppFollowAuthorReq, loginUserInfo: LoginUserInfo): Int
    fun listMyFollowingApply(req: PageVo, nickname: String?, loginUserInfo: LoginUserInfo): PageResult<GetAuthorResp>
    fun doFollowAgreed(id: Int, loginUserInfo: LoginUserInfo): Int
    fun deleteRelation(id: Int, loginUserInfo: LoginUserInfo, callback: (relation: FollowRelation) -> Unit)
    fun updateAuthorPopDegree(userId: Long, type: AuthorType)

    /**
     * 同步作者信息
     */
    fun syncAuthorInfo(authorSyncBO: AuthorSyncBO)

    /**
     * 查询用户关注人数
     */
    fun followCount(loginUserInfo: LoginUserInfo): GetFollowCountResp

    /**
     * 封禁用户管理列表
     */
    fun blockedAuthors(pageNo: Int?, pagerSize: Int?, authorName: String?): PageResult<BlockedAuthorResp>?

    /**
     * 作者解封
     */
    fun unblockedAuthor(userId: Long): Int
    fun deleteAuthor(userId: Long)
}
