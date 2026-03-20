package com.parsec.aika.content.service.impl

import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.AuthorMapper
import com.parsec.aika.common.mapper.FollowRelationMapper
import com.parsec.aika.common.mapper.PostMapper
import com.parsec.aika.common.model.bo.AuthorSyncBO
import com.parsec.aika.common.model.bo.SyncRelationBO
import com.parsec.aika.common.model.em.ActionType
import com.parsec.aika.common.model.em.AuthorSortType
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.entity.Author
import com.parsec.aika.common.model.entity.FollowRelation
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.model.vo.req.GetAuthorReq
import com.parsec.aika.common.model.vo.req.PostAppFollowAuthorReq
import com.parsec.aika.common.model.vo.resp.BlockedAuthorResp
import com.parsec.aika.common.model.vo.resp.GetAppContentPostResp
import com.parsec.aika.common.model.vo.resp.GetAuthorResp
import com.parsec.aika.common.model.vo.resp.GetFollowCountResp
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.service.AuthorService
import com.parsec.aika.content.service.PostConfigService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import jakarta.annotation.Resource
import jakarta.validation.Valid
import org.springframework.dao.DuplicateKeyException
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.util.Assert
import java.time.LocalDateTime

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/22.
 */
@Service
class AuthorServiceImpl : AuthorService {

    @Resource
    private lateinit var authorMapper: AuthorMapper

    @Resource
    private lateinit var noticeService: NoticeService

    @Resource
    private lateinit var relationMapper: FollowRelationMapper

    @Resource
    private lateinit var postMapper: PostMapper

    @Resource
    private lateinit var postConfigService: PostConfigService

    @Resource
    private lateinit var followRelationMapper: FollowRelationMapper

    override fun authorPage(req: GetAuthorReq, userInfo: LoginUserInfo): PageResult<GetAuthorResp> {
        val page = Page<GetAuthorResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        val newReq = req.apply {
            if (req.keyword.isNullOrEmpty() && sort == null) {
//                默认用POP 似乎比较好
                sort = AuthorSortType.POP
            }
        }
        if (StrUtil.isNotBlank(req.keyword) && StrUtil.startWith(req.keyword, "@")) {
            req.username = StrUtil.removePrefix(req.keyword, "@")
            req.keyword = null
        }
        return PageUtil<GetAuthorResp>().page(authorMapper.listAuthor(page, newReq, userInfo.userId!!))
    }

    /**
     * 关注用户
     */
    override fun doFollowAuthor(@Valid req: PostAppFollowAuthorReq, loginUserInfo: LoginUserInfo): Int {
        //取消关注
        if (req.actionType == ActionType.DELETE) {
            val result = relationMapper.delete(
                KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, loginUserInfo.userId)
                    .eq(FollowRelation::followingId, req.followingId).eq(FollowRelation::type, req.type)
            )
            if (result > 0) {
                noticeService.syncUserRelationInfo(SyncRelationBO().apply {
                    userId = loginUserInfo.userId
                    followingId = req.followingId
                    actionType = ActionType.DELETE
                }, req.type!!)
            }
            return result
        }
        val apply = FollowRelation().apply {
            followingId = req.followingId
            type = req.type
            creator = loginUserInfo.userId
//            * 如果关注的对象是机器人 （type=BOT），则 FollowRelation 的 agreed 默认为 true。也就是说，机器人是不用审核的，但是如果关注的对象是User，则agreed 默认为 false。
//            agreed = req.type == AuthorType.BOT
            //用户关注无需审核，直接关注成功
            agreed = true
        }
        try {
            StaticLog.info("insert relation: {}", JSONUtil.toJsonStr(apply))
            val insert = relationMapper.insert(apply)
            StaticLog.info("insert relation ,result: {}", insert)
            if (insert >= 1 && apply.agreed) {
                noticeService.syncUserRelationInfo(SyncRelationBO().apply {
                    userId = loginUserInfo.userId
                    followingId = req.followingId
                    actionType = ActionType.ADD
                    botImage = apply.botImage
                }, req.type!!)
            }
        } catch (e: DuplicateKeyException) {
            return 0
        }
        return apply.id
    }

    override fun doFollowAgreed(id: Int, loginUserInfo: LoginUserInfo): Int {


        val relation = relationMapper.selectById(id) ?: throw BusinessException("apply not found")
        if (relation.agreed) {
            return 0
        }
        if (relation.followingId != loginUserInfo.userId) {
            throw BusinessException("You have no permission to agree this relation")
        }
        val apply = FollowRelation().apply { this.id = relation.id;this.agreed = true }
        val ret = relationMapper.updateById(apply)
        noticeService.syncUserRelationInfo(SyncRelationBO().apply {
            userId = relation.creator
            followingId = relation.followingId
            actionType = ActionType.ADD
            botImage = apply.botImage
        }, relation.type!!)
        return ret
    }


    override fun listMyFollowingApply(
        req: PageVo, nickname: String?, loginUserInfo: LoginUserInfo
    ): PageResult<GetAuthorResp> {
        val page = Page<GetAuthorResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<GetAuthorResp>().page(
            relationMapper.listMyFollowingApply(
                page, loginUserInfo.userId!!, nickname
            )
        )
    }

    override fun deleteRelation(id: Int, loginUserInfo: LoginUserInfo, callback: (relation: FollowRelation) -> Unit) {
//      当前用户关注的记录
        val relation = relationMapper.selectById(id) ?: throw BusinessException("relation not found")

        if (relation.creator == loginUserInfo.userId) {
            relationMapper.deleteById(id)
            return callback(relation)
        }

        if (relation.followingId == loginUserInfo.userId && !relation.agreed) {
            relationMapper.deleteById(id)
            return
        }

        throw BusinessException("You have no permission to delete this relation")

    }

    @Async
    override fun updateAuthorPopDegree(userId: Long, type: AuthorType) {
        val author = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, userId)
        )
        Assert.notNull(author, "Author not found")
        Assert.isTrue(author.type == type, "AuthorType not match")
        val pop = this.author30DaysPopDegree(userId, author.type!!)
        if (pop.isNaN()) {
            author.pop = 0.0
        } else {
            author.pop = pop
        }
        author.popUpdatedAt = LocalDateTime.now()
        StaticLog.info("Update authorId:${author.id}, popularity degree: ${author.pop}")
        authorMapper.updateById(author)
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun syncAuthorInfo(authorSyncBO: AuthorSyncBO) {
        val author = authorMapper.selectOne(
            KtQueryWrapper(Author::class.java).eq(Author::userId, authorSyncBO.userId)
                .eq(Author::type, authorSyncBO.type).last("limit 1")
        )
        if (author != null) {
            author.nickname = authorSyncBO.nickname ?: ""
            author.avatar = authorSyncBO.avatar ?: ""
            author.username = authorSyncBO.username ?: ""
            author.bio = authorSyncBO.bio.takeIf { it?.isNotBlank() == true }
            author.gender = authorSyncBO.gender ?: Gender.HIDE
            author.updatedAt = LocalDateTime.now()
            author.status = authorSyncBO.status
            authorMapper.updateById(author)
        } else {
            authorMapper.insert(Author().apply {
                this.userId = authorSyncBO.userId
                this.type = authorSyncBO.type
                this.nickname = authorSyncBO.nickname ?: ""
                this.avatar = authorSyncBO.avatar ?: ""
                this.username = authorSyncBO.username ?: ""
                this.bio = authorSyncBO.bio.takeIf { it?.isNotBlank() == true }
                this.gender = authorSyncBO.gender ?: Gender.HIDE
                this.status = authorSyncBO.status
            })
        }
    }

    private fun author30DaysPopDegree(userId: Long, type: AuthorType): Double {
        return this.postMapper.selectList(
            KtQueryWrapper(Post::class.java).eq(Post::author, userId).eq(Post::type, type)
                .ge(Post::createdAt, LocalDateTime.now().minusDays(30)).select(Post::id)
        ).map { postMapper.calPostPopDegree(it.id!!) }.average()
    }

    override fun followCount(loginUserInfo: LoginUserInfo): GetFollowCountResp {
        return GetFollowCountResp().apply {
            this.following = relationMapper.selectCount(
                KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::creator, loginUserInfo.userId)
                    .eq(FollowRelation::agreed, true)
            )
            this.followers = relationMapper.selectCount(
                KtQueryWrapper(FollowRelation::class.java).eq(FollowRelation::followingId, loginUserInfo.userId)
                    .eq(FollowRelation::agreed, true)
            )
        }
    }

    override fun blockedAuthors(pageNo: Int?, pagerSize: Int?, authorName: String?): PageResult<BlockedAuthorResp>? {
        val postBlockedNumber = postConfigService.postCreateBlockedNumber()
        val page = Page<BlockedAuthorResp>((pageNo ?: 1).toLong(), (pagerSize ?: 10).toLong())

        val list = authorMapper.blockedAuthors(page, postBlockedNumber, authorName)
        return PageUtil<BlockedAuthorResp>().page(list)
    }

    override fun unblockedAuthor(userId: Long): Int {
        val update = authorMapper.update(Author().apply {
            this.caseCleanAt = LocalDateTime.now()
        }, KtUpdateWrapper(Author::class.java).eq(Author::userId, userId).eq(Author::type, AuthorType.USER))
        Assert.state(update > 0, "unblocked author failed")
        return update
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun deleteAuthor(userId: Long) {
        //删除关联管理
        followRelationMapper.delete(KtQueryWrapper(FollowRelation::class.java).and {
            it.eq(FollowRelation::followingId, userId).or().eq(FollowRelation::creator, userId)
        })
        authorMapper.delete(
            KtQueryWrapper(Author::class.java).eq(Author::userId, userId).eq(Author::type, AuthorType.USER)
        )
    }
}
