package com.parsec.aika.bot.model.vo

/**
 * 游戏问题对象
 * @property index 当前问题索引
 * @property question 问题内容
 * @property eof 是否是最后一个问题，eof指最后一个问题
 * @property bof 是否还没有开始 bof 的下一个节点是第一个问题
 */
data class GameQuestion(
    var index: Int,
    var question: String?=null,
    val eof: Boolean,
    val bof: Boolean
)
