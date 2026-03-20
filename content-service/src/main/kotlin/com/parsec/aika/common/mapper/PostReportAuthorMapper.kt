package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.entity.PostReportAuthor
import com.parsec.aika.common.model.vo.req.ManagePostReportReq
import com.parsec.aika.common.model.vo.resp.PostReportResp
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface PostReportAuthorMapper : BaseMapper<PostReportAuthor> {

    @Select(
        """
        <script>
            select t1.id,
                   t1.reportId,
                   t1.postId,
                   t1.createdAt,
                   t3.nickname as postAuthorName,
                   t3.avatar   as postAuthorAvatar,
                   t4.nickname as authorName,
                   t4.avatar   as authorAvatar
            from t_post_report_author t1
                 inner join t_post t2 on t1.postId = t2.id
                 inner join t_author t3 on t2.author = t3.userId and t3.deleted = 0
                 inner join t_author t4 on t1.author = t4.userId and t4.deleted = 0
            where t4.deleted = 0 and t3.deleted = 0
            <if test="req.postId != null">
                and t1.postId = #{req.postId}
            </if>
            <if test="req.reportId != null">
                and t1.reportId = #{req.reportId}
            </if>
            <if test="req.postAuthorName != null">
                and t3.nickname like concat('%',#{req.postAuthorName},'%')
            </if>
            <if test="req.authorName != null">
                and t4.nickname like concat('%',#{req.authorName},'%')
            </if>
            <if test="req.minTime != null">
                and t1.createdAt &gt;= #{req.minTime}
            </if>
            <if test="req.maxTime != null">
                and t1.createdAt &lt;= #{req.maxTime}
            </if>
            order by t1.createdAt desc
        </script>
        """
    )
    fun postReportList(page: Page<PostReportResp>, @Param("req") req: ManagePostReportReq): Page<PostReportResp>
}