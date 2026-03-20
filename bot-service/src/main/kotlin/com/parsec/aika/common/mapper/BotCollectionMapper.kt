package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.bot.model.vo.resp.GetAppBotCollectionItemResp
import com.parsec.aika.bot.model.vo.resp.GetAppBotCollectionResp
import com.parsec.aika.common.model.entity.BotCollection
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface BotCollectionMapper : BaseMapper<BotCollection> {

    @Select(
        """
        <script>
            select 
                id                
                ,type          
                ,avatar        
                ,collectionName
                ,category      
            from bot_collection 
            where deleted=0
            order by id desc
        </script>
    """
    )
    fun listBotCollection(): List<GetAppBotCollectionResp>


    @Select(
        """
        <script>
            select 
                id          
                ,createdAt   
                ,updatedAt   
                ,dataVersion 
                ,deleted     
                ,updater     
                ,creator     
                ,botId       
                ,type        
                ,collectionId
                ,avatar      
                ,name        
                ,description 
                ,listCover,
                 listCoverDark
            from bot_collection_item
            where collectionId= #{collectionId} and deleted=0
            order by id desc
        </script>
    """
    )
    fun listBotCollectionItem(@Param("collectionId") collectionId: Long): List<GetAppBotCollectionItemResp>

    @Select(
        """
        select id,roomName as collectionName,roomType as type,roomAvatar as avatar
        from t_chatroom where deleted=0 and roomType='GROUP_CHAT' and groupType='PUBLIC' 
        and id not in (select botId from bot_collection_item where deleted=0 and `type`='GROUP_CHAT')
        order by id desc
        limit #{limit}
        """
    )
    fun groupChatList(@Param("limit")limit: Int): List<GetAppBotCollectionResp>

}
