package com.parsec.aika.content.controller.app

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.SyncRelationBO
import com.parsec.aika.common.model.em.ActionType
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.model.vo.req.PostAppFollowAuthorReq
import com.parsec.aika.common.model.vo.req.PutAppFollowAuthorReq
import com.parsec.aika.common.model.vo.resp.GetAuthorResp
import com.parsec.aika.common.model.vo.resp.GetFollowCountResp
import com.parsec.aika.content.service.AuthorService
import com.parsec.aika.content.service.impl.NoticeService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import jakarta.annotation.Resource


@RestController
class AuthorController {

    @Resource
    private lateinit var authorService: AuthorService

    @Resource
    private lateinit var noticeService: NoticeService

    @GetMapping("/app/author")
    fun authorPage(
        @Validated req: com.parsec.aika.common.model.vo.req.GetAuthorReq, loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<GetAuthorResp>> {
        return BaseResult.success(authorService.authorPage(req, loginUserInfo))
    }

    @PostMapping("/app/follow-relation")
    fun doFollowAuthor(
        @Validated @RequestBody req: PostAppFollowAuthorReq, loginUserInfo: LoginUserInfo
    ): BaseResult<Int> {
        Assert.state(req.followingId != loginUserInfo.userId, "Please do not focus on yourself")
        StaticLog.info("doFollowAuthor: {}", JSONUtil.toJsonStr(req))
        return BaseResult.success(authorService.doFollowAuthor(req, loginUserInfo))
    }

    @GetMapping("/app/following-apply")
    fun pageMyFollowingApply(
        req: PageVo, nickname: String?, loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<GetAuthorResp>>? {
        return BaseResult.success(authorService.listMyFollowingApply(req, nickname, loginUserInfo))
    }

    @PutMapping("/app/follow-relation")
    fun doFollowAgreed(@RequestBody req: PutAppFollowAuthorReq, loginUserInfo: LoginUserInfo): BaseResult<Int> {
        return BaseResult.success(authorService.doFollowAgreed(req.id!!, loginUserInfo))
    }

    @DeleteMapping("/app/follow-relation/{id}")
    fun deleteRelation(@PathVariable("id") id: Int, user: LoginUserInfo): BaseResult<Int> {
        authorService.deleteRelation(id, user) { relation ->
            noticeService.syncUserRelationInfo(SyncRelationBO().apply {
                userId = relation.creator
                followingId = relation.followingId
                actionType = ActionType.DELETE
            }, relation.type!!)
        }
        return BaseResult.success(null)
    }

    @GetMapping("/app/follow-count")
    fun followCount(loginUserInfo: LoginUserInfo): BaseResult<GetFollowCountResp> {
        return BaseResult.success(authorService.followCount(loginUserInfo))
    }

}
