package com.parsec.aika.common.config

import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Configuration
class JsonConfig {

    @Value("\${spring.jackson.date-format:yyyy-MM-dd'T'HH:mm:ss'Z'}")
    private lateinit var pattern: String

    @Bean
    fun jackson2ObjectMapperBuilderCustomizer(): Jackson2ObjectMapperBuilderCustomizer {
        return Jackson2ObjectMapperBuilderCustomizer { builder ->
            builder.serializerByType(
                LocalDateTime::class.java,
                LocalDateTimeSerializer(DateTimeFormatter.ofPattern(pattern))
            )
                .serializerByType(Long::class.java, ToStringSerializer.instance)
                .serializerByType(java.lang.Long.TYPE, ToStringSerializer.instance)
        }
    }

}