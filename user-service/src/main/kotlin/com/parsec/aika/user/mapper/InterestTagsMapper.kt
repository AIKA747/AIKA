package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.user.model.entity.InterestTags
import com.parsec.aika.user.model.vo.req.ManageTagsQueryVo
import com.parsec.aika.user.model.vo.resp.ManageTagsListVo
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface InterestTagsMapper : BaseMapper<InterestTags> {

    @Select(
        """
        <script>
            select tagName from interest_tags where deleted = 0 order by sortNo
        </script>
    """
    )
    fun tagNameList(): List<String>

    @Select(
        """
        <script>
            select tagName from interest_tags where deleted = 0 order by sortNo
        </script>
    """
    )
    fun tagNameList(page: Page<String>): Page<String>

    @Select(
        """
        <script>
            select * from interest_tags where deleted = 0
            <if test='req.tagName != null'>
                and tagName like concat('%', #{req.tagName}, '%')
            </if>
            order by sortNo
        </script>
    """
    )
    fun manageTagsList(@Param("req") req: ManageTagsQueryVo): List<ManageTagsListVo>

    @Select(
        """
        <script>
            select * from interest_tags where deleted = 0
            <if test='req.tagName != null'>
                and tagName like concat('%', #{req.tagName}, '%')
            </if>
            order by sortNo
        </script>
    """
    )
    fun manageTagsList(page: Page<ManageTagsListVo>, @Param("req") req: ManageTagsQueryVo): Page<ManageTagsListVo>

    @Select(
        """
        <script>
        select if(count(id) > 0, 1, 0) from `interest_tags` 
        where deleted = 0 and tagName = #{tagName}
        <if test = 'id != null'> 
            and id != #{id}
        </if>
        </script>
    """
    )
    fun manageCheckTagName(@Param("tagName") tagName: String, @Param("id") id: Long?): Boolean

}