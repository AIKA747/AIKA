package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.user.model.entity.PushJob
import com.parsec.aika.user.model.vo.req.ManagePushJobListReq
import com.parsec.aika.user.model.vo.resp.ManagePushJobListResp
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface PushJobMapper : BaseMapper<PushJob> {
    @Select(
        """
        <script>
            SELECT id,`name`,`category`,`type`,cron,`status`,excuted,excutedAt,createdAt
            FROM `push_job`
            where deleted=0 and sysJob = #{req.sysJob}
            <if test='null!=req.name and req.name != ""'>
                and `name` like concat('%',#{req.name},'%')
            </if>
            <if test = 'req.category != null'>
                and `category` = #{req.category}
            </if>
            <if test = 'req.status != null'>
                and `status` = #{req.status}
            </if>
            <if test = 'req.excuted != null'>
                and excuted = #{req.excuted}
            </if>
            <if test = 'req.minCreatedAt != null'>
                and createdAt gt;= #{req.minCreatedAt}
            </if>
            <if test = 'req.maxCreatedAt != null'>
                and createdAt lt;= #{req.maxCreatedAt}
            </if>
            order by id desc
        </script>
        """
    )
    fun pushJobList(@Param("req") req: ManagePushJobListReq): List<ManagePushJobListResp>

    @Select(
        """
        <script>
            SELECT id,`name`,`category`,`type`,cron,`status`,excuted,excutedAt,createdAt
            FROM `push_job`
            where deleted=0 and sysJob = #{req.sysJob}
            <if test='null!=req.name and req.name != ""'>
                and `name` like concat('%',#{req.name},'%')
            </if>
            <if test = 'req.category != null'>
                and `category` = #{req.category}
            </if>
            <if test = 'req.status != null'>
                and `status` = #{req.status}
            </if>
            <if test = 'req.excuted != null'>
                and excuted = #{req.excuted}
            </if>
            <if test = 'req.minCreatedAt != null'>
                and createdAt gt;= #{req.minCreatedAt}
            </if>
            <if test = 'req.maxCreatedAt != null'>
                and createdAt lt;= #{req.maxCreatedAt}
            </if>
            order by id desc
        </script>
        """
    )
    fun pushJobList(page: Page<ManagePushJobListResp>, @Param("req") req: ManagePushJobListReq): Page<ManagePushJobListResp>
}