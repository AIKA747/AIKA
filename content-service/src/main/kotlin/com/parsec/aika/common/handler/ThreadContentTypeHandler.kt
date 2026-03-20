package com.parsec.aika.common.handler

import com.baomidou.mybatisplus.extension.handlers.AbstractJsonTypeHandler
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.parsec.aika.common.model.entity.ThreadContent

class ThreadContentTypeHandler : AbstractJsonTypeHandler<List<ThreadContent>>() {
    override fun parse(json: String?): List<ThreadContent> {
        return try {
            objectMapper.readValue<List<ThreadContent>>(json, object : TypeReference<List<ThreadContent>?>() {})
        } catch (e: Exception) {
            throw RuntimeException(e)
        }
    }

    override fun toJson(obj: List<ThreadContent>?): String {
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
