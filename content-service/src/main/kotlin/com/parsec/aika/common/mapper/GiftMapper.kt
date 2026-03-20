package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.entity.Gift
import com.parsec.aika.common.model.vo.req.GetAppGiftReq
import com.parsec.aika.common.model.vo.req.ManageGiftQueryVo
import com.parsec.aika.common.model.vo.resp.GetAppGiftResp
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface GiftMapper : BaseMapper<Gift> {

    @Select(
        """
        select g.id, g.giftName, g.image
        from t_gift as g 
        where g.deleted = 0 
        and (
            (g.storyId is null and g.chapterId is null) 
            or (g.storyId = #{req.storyId} and chapterId is null) 
            or (g.storyId = #{req.storyId} and chapterId = #{req.chapterId})
            ) 
        order by g.id desc 
    """
    )
    fun getAppGift(page: Page<GetAppGiftResp>, @Param("req") req: GetAppGiftReq): Page<GetAppGiftResp>

    /**
     * 若传入了id，则验证除该id对应数据外，是否存在该礼物名称
     *   若传入了故事id、章节id，则添加这两个条件
     */
    @Select(
        """
        <script>
            select * from t_gift where deleted = 0 and giftName = #{giftName} 
            <if test='id != null'>
                and id != #{id}
            </if>
            limit 1
        </script>
    """
    )
    fun checkNameVo(@Param("giftName") name: String, @Param("id") notId: Long?): Gift

    /**
     * 如果没有storyId和chapterId，则筛选全局；
     * 有storyId，筛选storyId满足条件，且chapterId为空的（故事级）；
     * 有chapterId，则按chapterId筛选。（章节级）
     */
    @Select(
        """
        <script>
            select * from t_gift where deleted = 0 
            <if test='req.storyId == null and req.chapterId == null'>
                and storyId is null and chapterId is null 
            </if>
            <if test='req.storyId == null and req.chapterId != null'>
                and chapterId = #{req.chapterId} 
            </if>
            <if test='req.storyId != null and req.chapterId == null'>
                and storyId = #{req.storyId} and chapterId is null 
            </if>
            <if test='req.storyId != null and req.chapterId != null'>
                and storyId = #{req.storyId} and chapterId = #{req.chapterId}
            </if>
            <if test='req.giftName != null'>
                and giftName like concat('%', #{req.giftName}, '%')
            </if>
            order by id desc
        </script>
    """
    )
    fun manageGiftList(
        page: Page<Gift>, @Param("req") queryVo: ManageGiftQueryVo
    ): Page<Gift>
}
