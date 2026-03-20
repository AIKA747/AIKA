package com.parsec.aika.common.handler

import com.baomidou.mybatisplus.extension.handlers.AbstractJsonTypeHandler
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.parsec.aika.common.model.dto.PermissionVo

class PermissionsTypeHandler : AbstractJsonTypeHandler<List<PermissionVo>>() {
    override fun parse(json: String?): List<PermissionVo> {
        return try {
            objectMapper.readValue<List<PermissionVo>>(json, object : TypeReference<List<PermissionVo>?>() {})
        } catch (e: Exception) {
            throw RuntimeException(e)
        }
    }

    override fun toJson(obj: List<PermissionVo>?): String {
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
