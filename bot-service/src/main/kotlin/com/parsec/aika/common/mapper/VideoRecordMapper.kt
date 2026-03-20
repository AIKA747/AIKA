package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.req.GetManageBotDigitalHumanVideoRecordsReq
import com.parsec.aika.bot.model.vo.resp.GetManageBotDigitalHumanVideoRecordsResp
import com.parsec.aika.common.model.entity.VideoRecord
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface VideoRecordMapper : BaseMapper<VideoRecord> {

    @Select(
        """
            <script>
                select r.*, if(p1.id is null, if(p2.id is null, 0, 1), 2) as flag
                from digital_human_video_record as r 
                left join digital_human_profile as p1 on r.profileId = p1.id and r.id = p1.idleVideoId
                left join digital_human_profile as p2 on r.profileId = p2.id and r.id = p2.greetVideoId
                where r.profileId = #{req.profileId} and r.status='done' order by createdAt desc
            </script>
        """
    )
    fun getManageBotDigitalHumanVideoRecords(@Param("req") req: GetManageBotDigitalHumanVideoRecordsReq): List<GetManageBotDigitalHumanVideoRecordsResp>
}