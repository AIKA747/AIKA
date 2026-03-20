package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.parsec.aika.common.model.em.GameStatus
import com.parsec.trantor.mybatisplus.base.BaseDomain

/**
 * @author husu
 * @version 1.0
 * @date 2025/1/7.
 */
@TableName("game_thread")
class GameThread : BaseDomain() {

    /** 游戏ID */
    var gameId: Long? = null

    /** 游戏状态 COMPLETE 代表完成，UNCOMPLETED 代表未完成 */
    var status: GameStatus? = null

    /** 结果ID，关联游戏结果 */
    var result: Long? = null

    /** chatgpt 的 thread id */
    var threadId: String? = null

    /** 创建人id */
    var creator: Long? = null

    /** 当前问题索引，从0开始，null表示未开始 */
    var curQuestion: Int? = null
}
