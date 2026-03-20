package com.parsec.aika.common.handler

import com.baomidou.mybatisplus.extension.handlers.AbstractJsonTypeHandler
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.parsec.aika.common.model.entity.LanguageVoice

class LanguageVoiceTypeHandler : AbstractJsonTypeHandler<List<LanguageVoice>?>() {
    override fun parse(json: String?): List<LanguageVoice>? {
        return try {
            objectMapper.readValue<List<LanguageVoice>?>(json, object : TypeReference<List<LanguageVoice>?>() {})
        } catch (e: Exception) {
            throw RuntimeException(e)
        }
    }

    override fun toJson(obj: List<LanguageVoice>?): String {
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
