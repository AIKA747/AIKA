package com.parsec.aika.common.handler

import com.baomidou.mybatisplus.extension.handlers.AbstractJsonTypeHandler
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.parsec.aika.common.model.entity.RuleElement

class RuleElementTypeHandler : AbstractJsonTypeHandler<List<RuleElement>>() {
    override fun parse(json: String?): List<RuleElement> {
        return try {
            objectMapper.readValue<List<RuleElement>>(json, object : TypeReference<List<RuleElement>?>() {})
        } catch (e: Exception) {
            throw RuntimeException(e)
        }
    }

    override fun toJson(obj: List<RuleElement>?): String {
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
