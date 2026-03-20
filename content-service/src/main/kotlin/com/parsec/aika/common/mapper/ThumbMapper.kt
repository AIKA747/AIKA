package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.entity.Thumb
import com.parsec.aika.common.model.vo.resp.AppThumbListResp
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface ThumbMapper : BaseMapper<Thumb> {

    @Select(
        """
            select 
                t1.id,t2.userId,t2.nickname,t2.avatar,t2.username,t1.createdAt,ifnull(t3.agreed, 0) as followed
            from 
                t_thumb t1
            left join 
                t_author t2 on t1.creator = t2.userId
            left join 
                t_follow_relation t3 on t3.followingId = t1.creator and t3.creator = #{userId} and t3.deleted = 0
            where t1.postId = #{postId}
        """
    )
    fun selectPostThumbList(page: Page<AppThumbListResp>, @Param("postId") postId: Int, @Param("userId") userId: Long): Page<AppThumbListResp>
}
