package com.parsec.aika.bot.service

import com.parsec.aika.common.model.em.GenerateType

interface MidjourneyService {

    fun submitImagine(state: GenerateType, prompt: String, base64Array: List<String>?): String

    fun submitChange(taskId: String, action: String, index: Int?): String

    fun taskFetchById(taskId: String): String

}