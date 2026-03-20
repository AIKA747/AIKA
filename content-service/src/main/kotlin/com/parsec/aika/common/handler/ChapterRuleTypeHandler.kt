package com.parsec.aika.common.handler

import com.baomidou.mybatisplus.extension.handlers.AbstractJsonTypeHandler
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.parsec.aika.common.model.entity.StoryChapterRules

class ChapterRuleTypeHandler : AbstractJsonTypeHandler<List<StoryChapterRules>>() {
    override fun parse(json: String?): List<StoryChapterRules> {
        return try {
            objectMapper.readValue<List<StoryChapterRules>>(json, object : TypeReference<List<StoryChapterRules>?>() {})
        } catch (e: Exception) {
            throw RuntimeException(e)
        }
    }

    override fun toJson(obj: List<StoryChapterRules>?): String {
        return try {
            objectMapper.writeValueAsString(obj)
        } catch (e: Exception) {
            throw RuntimeException(e)
        }
    }

    companion object {
        private val objectMapper = ObjectMapper()
    }
}
