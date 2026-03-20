package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.user.model.entity.UserGroupRel
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

interface UserGroupRelMapper : BaseMapper<UserGroupRel> {

    @Select(
        """
    <script>
    select distinct ugr.userId 
    from user_group_rel as ugr 
    where ugr.groupId in 
    <foreach collection='groupIdList' open='(' close = ')' item='id' separator=','> 
        #{id}
    </foreach>
    </script>
  """
    )
    fun selectDistinctUserIdListByGroupIdList(@Param("groupIdList") groupIdList: List<Long?>): List<Long>
}