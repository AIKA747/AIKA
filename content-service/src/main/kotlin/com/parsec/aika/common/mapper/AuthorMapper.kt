package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.entity.Author
import com.parsec.aika.common.model.vo.req.GetAuthorReq
import com.parsec.aika.common.model.vo.resp.BlockedAuthorResp
import com.parsec.aika.common.model.vo.resp.GetAuthorResp
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface AuthorMapper : BaseMapper<Author> {

    @Select(
        """
        <script>
        select a.*
        ,r.id is not null as followed
        from t_author a
        left join t_follow_relation r on a.userId = r.followingId and r.creator = #{userId} and r.agreed = 1
        <where>
            a.deleted=0 and a.userId != #{userId} and a.status != 'disabled'
            <if test='req.username != null '>
                and a.username like concat('%',#{req.username},'%')
            </if> 
            <if test='req.keyword != null '>
                and a.nickname like concat('%',#{req.keyword},'%')
            </if> 
        </where>
        <if test='req.sort == @com.parsec.aika.common.model.em.AuthorSortType@ALL and req.keyword != null'> 
        order by 
            case 
                when nickname like concat(#{req.keyword},'%') then 1
                when nickname like concat('%',#{req.keyword}) then 2
                when nickname like concat('%',#{req.keyword},'%') then 3
            end 
        asc
        </if>
        <if test='req.sort == @com.parsec.aika.common.model.em.AuthorSortType@ALL and req.username != null'> 
        order by 
            case 
                when username like concat(#{req.username},'%') then 1
                when username like concat('%',#{req.username}) then 2
                when username like concat('%',#{req.username},'%') then 3
            end 
        asc
        </if>
        <if test='req.sort == @com.parsec.aika.common.model.em.AuthorSortType@POP or req.sort == null'>
        order by 
            case when popUpdatedAt &lt;= DATE_SUB(now(), INTERVAL -30 DAY) then 0 else a.pop end  
        desc
        </if> 
        </script>
    """
    )
    fun listAuthor(
        page: Page<GetAuthorResp>, @Param("req") req: GetAuthorReq, @Param("userId") userId: Long
    ): Page<GetAuthorResp>

    @Select(
        """
    <script>
        select userId,username,nickname,avatar,createdAt,caseCleanAt,bio,
            (select count(*) from t_post b where b.flagged = 1 and b.author = userId and b.createdAt > caseCleanAt) as flagNum
        from t_author
        where type = 'USER'
        <if test="null!=authorName and authorName!=''">
            and (username like concat('%',#{authorName},'%') or nickname like concat('%',#{authorName},'%'))
        </if>
        having flagNum &gt;= #{postBlockedNumber}
        order by flagNum,createdAt desc
    </script>
    """
    )
    fun blockedAuthors(
        page: Page<BlockedAuthorResp>,
        @Param("postBlockedNumber") postBlockedNumber: Int,
        @Param("authorName") authorName: String?
    ): Page<BlockedAuthorResp>
}
