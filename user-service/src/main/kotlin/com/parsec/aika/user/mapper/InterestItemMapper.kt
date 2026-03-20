package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.user.model.entity.InterestItem
import com.parsec.aika.user.model.vo.req.InterestItemQueryVo
import com.parsec.aika.user.model.vo.resp.InterestItemCount
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface InterestItemMapper : BaseMapper<InterestItem> {

    @Select(
        """
        <script>
            select * from interest_item where deleted = 0
            <if test='req.itemName != null'>
                and itemName like concat('%', #{req.itemName}, '%')
            </if>
            <if test='req.itemType != null'>
                and itemType = #{req.itemType}
            </if>
            order by orderNum ASC
        </script>
    """
    )
    fun manageInterestItemList(@Param("req") req: InterestItemQueryVo): List<InterestItem>

    @Select(
        """
        <script>
            select * from interest_item where deleted = 0
            <if test='req.itemName != null'>
                and itemName like concat('%', #{req.itemName}, '%')
            </if>
            <if test='req.itemType != null'>
                and itemType = #{req.itemType}
            </if>
            order by orderNum ASC
        </script>
    """
    )
    fun manageInterestItemList(page: Page<InterestItem>, @Param("req") req: InterestItemQueryVo): Page<InterestItem>


    @Select(
        """
        select count(1) as count, itemType from interest_item where deleted = 0 group by itemType
    """
    )
    fun queryItemTypeCount(): List<InterestItemCount>
}
