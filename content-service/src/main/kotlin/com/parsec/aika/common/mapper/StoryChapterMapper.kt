package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.common.model.entity.StoryChapter
import com.parsec.aika.common.model.vo.resp.ManageChapterVo
import org.apache.ibatis.annotations.Delete
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface StoryChapterMapper : BaseMapper<StoryChapter> {

    @Select("""
        <script>
            select * from t_story_chapter where deleted = 0
            <if test='storyId != null'>
                and storyId = #{storyId}
            </if>
            order by chapterOrder 
        </script>
    """)
    fun manageChapterList(@Param("storyId") storyId: Long?): List<com.parsec.aika.common.model.vo.resp.ManageChapterVo>

    @Select("""
        <script>
            select * from t_story_chapter where deleted = 0 and id = #{id}
        </script>
    """)
    fun manageChapterDetail(@Param("id") id: Long): com.parsec.aika.common.model.vo.resp.ManageChapterVo

    @Delete("""
        delete from t_story_chapter where id = #{id}
    """)
    fun manageChapterDelete(@Param("id") id: Long)

    @Select("""
        <script>
            select * from t_story_chapter where id = #{id}
        </script>
    """)
    fun manageChapterCheckDelete(@Param("id") id: Long): StoryChapter

}
