package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.parsec.aika.user.domain.Notification
import com.parsec.aika.user.mapper.provider.NotificationSqlProvider
import com.parsec.aika.user.model.vo.resp.AppNotifyResp
import org.apache.ibatis.annotations.*

/**
 * @author 77923
 * @description 针对表【notification(用户通知表)】的数据库操作Mapper
 * @createDate 2025-01-24 18:44:26
 * @Entity com.parsec.aika.user.domain.Notification
 */
interface NotificationMapper : BaseMapper<Notification?> {
    @Select(
        """
        <script>
        SELECT COUNT(*) FROM (
            SELECT groupById FROM notification
            WHERE JSON_CONTAINS(IFNULL(userIds,'[]'), #{userId})
            <if test="lastTime != null">
                AND createdAt>#{lastTime}
            </if>
            GROUP BY groupById
        ) temp
        </script>
    """
    )
    fun selectNotifyCount(@Param("userId") userId: String?, @Param("lastTime") lastTime: String?): Int

    @Results(
        Result(property = "metadata", column = "metadata", typeHandler = JacksonTypeHandler::class),
        Result(property = "authors", column = "authors", typeHandler = JacksonTypeHandler::class)
    )
    @Select(
        """
        <script>
            SELECT groupById,MAX(id)AS id,MAX(`type`)AS `type`,MAX(cover) AS cover,COUNT(*) AS `number`,
            MAX(metadata) AS metadata,MAX(createdAt) AS createdAt,
            IF(
                EXISTS(
                    SELECT 1 FROM notification t 
                        INNER JOIN JSON_TABLE(t.readUserIds,'${'$'}[*]' COLUMNS (userId BIGINT PATH '${'$'}.userId')) j ON j.userId = #{userId}
                WHERE t.groupById = a.groupById),1,0) AS readFlag,
            JSON_ARRAYAGG(JSON_OBJECT('authorId', authorId, 'avatar', avatar, 'nickname', nickname,'username',username,'gender',gender)) AS `authors`
            FROM notification a
            WHERE JSON_CONTAINS(IFNULL(a.userIds,'[]'), #{userId})
            <if test="lastTime != null">
                AND createdAt>#{lastTime}
            </if>
            GROUP BY groupById
            ORDER BY createdAt DESC
            LIMIT #{offset}, #{pageSize}
        </script>
    """
    )
    fun selectNotifyList(
        @Param("userId") userId: String?,
        @Param("lastTime") lastTime: String?,
        @Param("offset") offset: Int,
        @Param("pageSize") pageSize: Int
    ): List<AppNotifyResp>

    @Select(
        """
        SELECT COUNT(t.id) FROM notification t
        LEFT JOIN JSON_TABLE(t.readUserIds, '${'$'}[*]' COLUMNS (userId BIGINT PATH '${'$'}.userId')) AS jt ON jt.userId = #{userId}
        WHERE JSON_CONTAINS(IFNULL(userIds,'[]'), #{userId}) AND jt.userId IS NULL
    """
    )
    fun unreadNotificationCount(@Param("userId") userId: String): Int


    //    @Update(
//        value = ["<script>", "UPDATE notification", "SET readUserIds = JSON_ARRAY_APPEND(readUserIds, '$', JSON_OBJECT('userId', #{userId}, 'readAt', NOW()))", "WHERE JSON_CONTAINS(IFNULL(userIds,'[]'), #{userId})", "AND IFNULL(JSON_CONTAINS(JSON_EXTRACT(readUserIds, '$[*].userId'), #{userId}), 0) = 0", "</script>"]
//    )
    @UpdateProvider(type = NotificationSqlProvider::class, method = "readAllNotification")
    fun readAllNotification(@Param("userId") userId: Long?)
}




