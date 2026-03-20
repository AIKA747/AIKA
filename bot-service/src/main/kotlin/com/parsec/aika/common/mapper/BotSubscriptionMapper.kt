package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.resp.BotListVo
import com.parsec.aika.common.model.entity.BotSubscription
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface BotSubscriptionMapper : BaseMapper<BotSubscription> {

    @Select("""
        <script>
            select 
                b.id, bs.userId, b.avatar as botAvatar, b.botName, b.botStatus,
                b.chatTotal, b.creator, b.creatorName, b.gender, bs.lastReadAt, b.rating,
                b.subscriberTotal, b.updatedAt,b.botSource,bs.botImage
            from bot_subscription bs 
            left join bot b on bs.botId = b.id
            where b.deleted=0 and bs.userId = #{userId}
            <if test = 'botName != null'> 
                and b.botName like concat('%', #{botName}, '%')
            </if>
        </script>
    """)
    fun appMySubscribedBots(@Param("botName") botName: String?, @Param("userId") userId: Long): List<BotListVo>

    /**
     * 查询某用户订阅的机器人id的集合
     * 若botIds不为空，则需要返回botIds中该用户订阅了的机器人id的集合
     */
    @Select("""
        <script>
            select botId from bot_subscription 
            where 
                userId = #{userId} 
                <if test='botIds != null'>
                    and botId in 
                      <foreach collection="botIds" item="item" index="index" open="(" separator="," close=")">
                        #{item}
                      </foreach>
                </if>
        </script>
    """)
    fun feignUserSubscribedBotIds(@Param("userId") userId: Long, @Param("botIds") botIds: List<String>?): List<Long>
}