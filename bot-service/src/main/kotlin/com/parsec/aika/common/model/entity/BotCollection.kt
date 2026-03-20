package com.parsec.aika.common.model.entity

/**
 * @author husu
 * @version 1.0
 * @date 2025/1/7.
 */
import com.baomidou.mybatisplus.annotation.TableName
import com.parsec.aika.common.model.em.CollectionType
import com.parsec.trantor.mybatisplus.base.BaseDomain

@TableName("bot_collection")
class BotCollection : BaseDomain() {


    /**
     * 更新人
     */
    var updater: Long? = null

    /**
     * 创建人id。管理员。
     */
    var creator: Long? = null

    /**
     * 集合类型：TALES、EXPERT、GAME
     */
    var type: CollectionType? = null

    /**
     * 图标
     */
    var avatar: String? = null

    /**
     * 名称
     */
    var collectionName: String? = null


    /**
     * 分类
     */
    var category: Long? = null


}
