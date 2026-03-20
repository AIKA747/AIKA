package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.req.GetAppBotCategoryReq
import com.parsec.aika.bot.model.vo.resp.GetAppBotCategoryResp
import com.parsec.aika.bot.model.vo.resp.ManageBotCategoryListVo
import com.parsec.aika.common.model.entity.Category
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface CategoryMapper : BaseMapper<Category> {

    fun getAppBotCategory(@Param("req") req: GetAppBotCategoryReq): List<GetAppBotCategoryResp>

    @Select(
        """
        select id as categoryId, categoryName 
        from category where deleted = 0 order by sortNo asc
    """
    )
    fun botCategoryList(): List<ManageBotCategoryListVo>

}
