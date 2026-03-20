package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.parsec.trantor.mybatisplus.base.BaseDomain

/**
 * @author husu
 * @version 1.0
 * @date 2025/1/7.
 */
@TableName("game_result")
class GameResult : BaseDomain() {

    /**
     * 游戏ID
     */
    
    var gameId: Long? = null

    /**
     * 摘要
     */
    var summary: String? = null

    /**
     * 描述
     */
    var description: String? = null

    /**
     * 图片URL
     */
    var cover: String? = null


}

