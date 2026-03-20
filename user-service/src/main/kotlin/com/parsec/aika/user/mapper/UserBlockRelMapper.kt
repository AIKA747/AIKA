package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.user.model.entity.UserBlockRel
import com.parsec.aika.user.model.vo.resp.ListBlockedUserResp
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

interface UserBlockRelMapper : BaseMapper<UserBlockRel> {

    @Select(
        """
        select ubr.blockedUserId as userId, u.username, u.nickname, u.avatar
        from user_block_rel as ubr
        left join user as u on ubr.blockedUserId = u.id
        where ubr.userId = #{userId}
        order by ubr.blockAt desc
    """
    )
    fun listBlockedUser(@Param("userId") userId: Long): List<ListBlockedUserResp>

    @Select(
        """
        select ubr.blockedUserId as userId, u.username, u.nickname, u.avatar
        from user_block_rel as ubr
        left join user as u on ubr.blockedUserId = u.id
        where ubr.userId = #{userId}
        order by ubr.blockAt desc
    """
    )
    fun listBlockedUser(page: Page<ListBlockedUserResp>, @Param("userId") userId: Long): Page<ListBlockedUserResp>
}