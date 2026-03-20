package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.entity.Comment
import com.parsec.aika.common.model.vo.req.CommentQueryVo
import com.parsec.aika.common.model.vo.resp.CommentResp
import org.apache.ibatis.annotations.*

@Mapper
interface CommentMapper : BaseMapper<Comment> {

    @Select(
        """
            <script>
            select c.*,a.nickname,a.username,a.avatar 
            from t_comment c
            left join t_author a on c.creator=a.userId and a.deleted = 0
            where c.postId=#{req.postId}
            <if test="req.blockedUserIdList != null and req.blockedUserIdList.size() > 0">
                and c.creator not in
                <foreach collection="req.blockedUserIdList" item="userId" open="(" separator="," close=")">
                    #{userId}
                </foreach>
            </if>
            <if test="req.keywords != null">
                and c.content like concat('%',#{req.keywords},'%')
            </if>
            order by c.createdAt asc
            </script>
        """
    )
    @Results(
        value = [
            Result(column = "replyTo", property = "replyTo", typeHandler = JacksonTypeHandler::class),
        ]
    )
    fun commentPageList(page: Page<CommentResp>, @Param("req") req: CommentQueryVo): Page<CommentResp>

    @Select(
        """
            select c.*,a.nickname,a.username,a.avatar, 
			pa.nickname as postAuthor, pa.avatar as postAuthorAvatar, 
			p.createdAt as postCreatedAt, p.summary, p.likes, p.reposts, p.id as postId,
            p.author as postAuthorId, p.type as postAuthorType, if(t.id is not null, 1, 0) as thumbed
            from t_comment c
            left join t_author a on c.creator=a.userId and a.deleted = 0
            left join t_post p on c.postId=p.id
			left join t_author pa on p.author=pa.userId and pa.deleted = 0
            left join t_thumb t on p.id = t.postId and t.creator = #{loginUserId}
            where c.creator=#{userId}
            order by c.createdAt desc
        """
    )
    @Results(
        value = [
            Result(column = "replyTo", property = "replyTo", typeHandler = JacksonTypeHandler::class),
        ]
    )
    fun userPageList(
        page: Page<CommentResp>, @Param("userId") userId: Long?, @Param("loginUserId") loginUserId: Long?
    ): Page<CommentResp>
}
