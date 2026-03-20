package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.user.model.entity.PushList
import com.parsec.aika.user.model.vo.req.GetPushListsReq
import com.parsec.aika.user.model.vo.resp.GetPushListsResp
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface PushListMapper : BaseMapper<PushList> {

    @Select(
        """
        <script>
        select pl.id, pl.title, pl.content, pl.pushTo, pl.soundAlert, pl.operator,
        pl.received, pl.pushTotal, pl.pushTime, pl.createdAt
        from push_list as pl
        where pl.deleted = 0
        <if test = 'req.title != null'>
            and pl.title like concat('%', #{req.title}, '%')
        </if>
        <if test = 'req.content != null'>
            and pl.content like concat('%', #{req.content}, '%')
        </if>
        <if test = 'req.operator != null'>
            and pl.operator like concat('%', #{req.operator}, '%')
        </if>
        <if test = 'req.minPushTime != null and req.maxPushTime != null'>
            and pl.pushTime between #{req.minPushTime} and #{req.maxPushTime}
        </if>
        order by pl.id desc
        </script>
    """
    )
    fun getPushLists(@Param("req") req: GetPushListsReq): List<GetPushListsResp>

    @Select(
        """
        <script>
        select pl.id, pl.title, pl.content, pl.pushTo, pl.soundAlert, pl.operator,
        pl.received, pl.pushTotal, pl.pushTime, pl.createdAt
        from push_list as pl
        where pl.deleted = 0
        <if test = 'req.title != null'>
            and pl.title like concat('%', #{req.title}, '%')
        </if>
        <if test = 'req.content != null'>
            and pl.content like concat('%', #{req.content}, '%')
        </if>
        <if test = 'req.operator != null'>
            and pl.operator like concat('%', #{req.operator}, '%')
        </if>
        <if test = 'req.minPushTime != null and req.maxPushTime != null'>
            and pl.pushTime between #{req.minPushTime} and #{req.maxPushTime}
        </if>
        order by pl.id desc
        </script>
    """
    )
    fun getPushLists(page: Page<GetPushListsResp>, @Param("req") req: GetPushListsReq): Page<GetPushListsResp>
}