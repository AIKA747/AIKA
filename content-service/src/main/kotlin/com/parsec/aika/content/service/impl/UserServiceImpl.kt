package com.parsec.aika.content.service.impl

import cn.hutool.core.util.StrUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.CommentMapper
import com.parsec.aika.common.mapper.FollowRelationMapper
import com.parsec.aika.common.mapper.PostMapper
import com.parsec.aika.common.mapper.StoryRecorderMapper
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.GameStatus
import com.parsec.aika.common.model.entity.Comment
import com.parsec.aika.common.model.entity.FollowRelation
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.entity.StoryRecorder
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.resp.AppUserStatisticsResp
import com.parsec.aika.common.model.vo.resp.FollowUserResp
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.service.UserService
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import jakarta.annotation.Resource

@Service
class UserServiceImpl : UserService {


    @Resource
    private lateinit var relationMapper: FollowRelationMapper

    @Resource
    private lateinit var storyRecorderMapper: StoryRecorderMapper

    @Resource
    private lateinit var postMapper: PostMapper

    @Resource
    private lateinit var commentMapper: CommentMapper

    /**
     * 获取用户统计数据
     */
    override fun getUserStatistics(userId: Long): AppUserStatisticsResp {
        return AppUserStatisticsResp().apply {
            // 关注数
            this.followingTotal = relationMapper.selectCount(
                KtQueryWrapper(FollowRelation::class.java).eq(
                    FollowRelation::creator, userId
                ).eq(FollowRelation::agreed, true).eq(FollowRelation::type, AuthorType.USER)
            )
            // 粉丝数
            this.followersTotal = relationMapper.selectCount(
                KtQueryWrapper(FollowRelation::class.java).eq(
                    FollowRelation::followingId, userId
                ).eq(FollowRelation::agreed, true).eq(FollowRelation::type, AuthorType.USER)
            )
            // 完成故事数
            this.storyTotal = storyRecorderMapper.selectCount(
                KtQueryWrapper(StoryRecorder::class.java).eq(
                    StoryRecorder::creator, userId
                ).eq(StoryRecorder::status, GameStatus.SUCCESS).eq(StoryRecorder::deleted, 0)
            )
            // 发帖数量
            this.postTotal = postMapper.selectCount(KtQueryWrapper(Post::class.java).eq(Post::author, userId))
            // 评论数量
            this.commentTotal =
                commentMapper.selectCount(KtQueryWrapper(Comment::class.java).eq(Comment::creator, userId))
            // 好友数
            this.friendTotal = relationMapper.getFriendTotal(userId)
        }
    }

    override fun followUsers(
        pageNo: Int?, pagerSize: Int?, type: Int?, userId: Long?, searchName: String?, loginUserInfo: LoginUserInfo
    ): PageResult<FollowUserResp>? {
        var username: String? = null
        var nickanme: String? = null
        if (StrUtil.isNotBlank(searchName)) {
            if (StrUtil.startWith(searchName, "@") && searchName!!.length > 1) {
                username = searchName.substring(1)
            } else {
                nickanme = searchName
            }
        }
        val page = Page<FollowUserResp>((pageNo ?: 1).toLong(), (pagerSize ?: 10).toLong())
        val result = when (type) {
            0 -> {
                //userId关注的用户列表
                relationMapper.getFollowingList(
                    page, userId ?: loginUserInfo.userId, loginUserInfo.userId, username, nickanme
                )
            }

            1 -> {
                //关注userId的用户列表
                relationMapper.getFollowedList(
                    page, userId ?: loginUserInfo.userId, loginUserInfo.userId, username, nickanme
                )
            }

            else -> {
                //userId的互关（好友）列表
                relationMapper.getFrendsList(
                    page, userId ?: loginUserInfo.userId, loginUserInfo.userId, username, nickanme
                )
            }
        }
        return PageUtil<FollowUserResp>().page(result)
    }


}