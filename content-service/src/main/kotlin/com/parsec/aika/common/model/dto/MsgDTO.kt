package com.parsec.aika.common.model.dto

import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.GameStatus

/**
 * @author husu
 * @version 1.0
 * @date 2024/1/26.
 */
class MsgDTO {
    var message: String? = null
    var status: GameStatus? = null
    var userId: Long? = null
    var storyId: Long? = null
    var contentType: ContentType? = null
    var chapterProcess: ChapterProcess? = null
    var gptJson: String? = null
}

enum class ChapterProcess {
    current, next, pre
}
