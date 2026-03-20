package com.parsec.aika.common.util

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider

class LongListToStringListSerializer : JsonSerializer<List<Long>>() {
    override fun serialize(value: List<Long>?, gen: JsonGenerator, serializers: SerializerProvider) {
        if (value == null) {
            gen.writeNull()
        } else {
            val stringList = value.map { it.toString() }
            gen.writeObject(stringList)
        }
    }
}
