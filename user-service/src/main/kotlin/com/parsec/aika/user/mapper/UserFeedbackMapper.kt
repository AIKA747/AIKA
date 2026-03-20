package com.parsec.aika.user.mapper

import cn.hutool.json.JSONObject
import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.user.model.entity.UserFeedback
import com.parsec.aika.user.model.vo.req.FeedbackStatisticsReq
import com.parsec.aika.user.model.vo.resp.UserFeedbackListResp
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface UserFeedbackMapper : BaseMapper<UserFeedback> {

    @Select(
        """
        <script>
            SELECT id,title,`status`,submissionAt
            FROM `user_feedback`
            WHERE userId=#{userId}
            <if test="listType=='processed'">
                AND status IN ('underReview','pending')
            </if>
            <if test="listType=='finished'">
                AND status IN ('rejected','completed','withdraw')
            </if>
            order by submissionAt desc
        </script>
        """
    )
    fun queryAppUserFeedbackList(
        @Param("userId") userId: Long?, @Param("listType") listType: String?
    ): List<UserFeedbackListResp>

    @Select(
        """
        <script>
            SELECT id,title,`status`,submissionAt
            FROM `user_feedback`
            WHERE userId=#{userId}
            <if test="listType=='processed'">
                AND status IN ('underReview','pending')
            </if>
            <if test="listType=='finished'">
                AND status IN ('rejected','completed','withdraw')
            </if>
            order by submissionAt desc
        </script>
        """
    )
    fun queryAppUserFeedbackList(
        page: Page<UserFeedbackListResp>, @Param("userId") userId: Long?, @Param("listType") listType: String?
    ): Page<UserFeedbackListResp>

    @Select(
        """
        <script>   
            WITH RECURSIVE DateSequence AS (
              SELECT
                #{req.minSubmissionAt} AS DateValue
              UNION ALL
              SELECT
                DATE_ADD(DateValue, INTERVAL 1 DAY)
              FROM
                DateSequence
              WHERE
                DateValue &lt; #{req.maxSubmissionAt}
            )
            SELECT
              a.DateValue AS dayId,ifnull(b.userCount,0) as userCount,ifnull(b.reportQuantity,0) as reportQuantity
            FROM
              DateSequence as a 
              LEFT JOIN 
              (
              SELECT COUNT(DISTINCT userId)AS userCount,COUNT(*) AS reportQuantity,DATE_FORMAT(submissionAt,'%Y-%m-%d') AS dayId 
                FROM `user_feedback` WHERE 
                submissionAt &lt;=#{req.maxSubmissionAt} 
                AND submissionAt &gt;=#{req.minSubmissionAt} 
                <if test="null!=req.username and req.username!=''">
                    AND username LIKE CONCAT('%',#{req.username},'%')
                </if>
                <if test="null!=req.status">
                    AND status=#{req.status}
                </if>
                <if test="null!=req.titleValue and req.titleValue!=''">
                    AND titleValue=#{req.titleValue}
                </if>
                GROUP BY DATE_FORMAT(submissionAt,'%Y-%m-%d')
            ) as b ON a.DateValue=b.dayId
        </script>
        """
    )
    fun reportQuantity(@Param("req") req: FeedbackStatisticsReq): List<JSONObject>?

    @Select(
        """
        <script> 
            WITH RECURSIVE FeedbackStatus AS (
                 <foreach collection="statusList" item="statusValue" separator="UNION ALL">
                    SELECT #{statusValue} AS statusValue
                </foreach>
            )
            SELECT a.statusValue AS `status`,IFNULL(b. quantity,0) AS quantity
            FROM FeedbackStatus AS a
            LEFT JOIN 
            (
                SELECT `status`,COUNT(*) AS quantity 
                FROM `user_feedback` 
                WHERE submissionAt &lt;=#{req.maxSubmissionAt} 
                AND submissionAt &gt;=#{req.minSubmissionAt} 
                <if test="null!=req.username and req.username!=''">
                    AND username LIKE CONCAT('%',#{req.username},'%')
                </if>
                <if test="null!=req.status">
                    AND status=#{req.status}
                </if>
                <if test="null!=req.titleValue and req.titleValue!=''">
                    AND titleValue=#{req.titleValue}
                </if>
                GROUP BY `status`
            ) AS b ON a.statusValue=b.status
        </script>
        """
    )
    fun statusStatistics(
        @Param("req") req: FeedbackStatisticsReq,
        @Param("statusList") statusList: List<String>
    ): List<JSONObject>?

    @Select(
        """
        <script>
            WITH RECURSIVE FeedbackTitle AS (
                <foreach collection="titleList" item="titleValue" separator="UNION ALL">
                    SELECT #{titleValue} AS titleValue
                </foreach>
            )
            SELECT a.titleValue AS `titleValue`,IFNULL(b. quantity,0) AS quantity
            FROM FeedbackTitle AS a
            LEFT JOIN 
            (
                SELECT `titleValue`,COUNT(*) AS quantity 
                FROM `user_feedback` 
                WHERE submissionAt &lt;=#{req.maxSubmissionAt} 
                AND submissionAt &gt;=#{req.minSubmissionAt} 
                <if test="null!=req.username and req.username!=''">
                    AND username LIKE CONCAT('%',#{req.username},'%')
                </if>
                <if test="null!=req.status">
                    AND status=#{req.status}
                </if>
                <if test="null!=req.titleValue and req.titleValue!=''">
                    AND titleValue=#{req.titleValue}
                </if>
                GROUP BY `titleValue`
            ) AS b ON a.titleValue=b.titleValue
        </script>
        """
    )
    fun titleStatistics(
        @Param("req") req: FeedbackStatisticsReq, @Param("titleList") data: List<String>
    ): List<JSONObject>?
}