package com.parsec.aika.common.config

import cn.hutool.core.util.StrUtil
import org.redisson.Redisson
import org.redisson.api.RedissonClient
import org.redisson.config.Config
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RedissonConfig {

    @Value("\${spring.data.redis.host}")
    private lateinit var redisHost: String

    @Value("\${spring.data.redis.port}")
    private var redisPort: Int = 6379

    @Value("\${spring.data.redis.password:}")
    private lateinit var redisPassword: String

    @Bean
    fun redissonClient(): RedissonClient {
        val config = Config()
        val serverConfig = config.useSingleServer().setAddress("redis://$redisHost:$redisPort")
        if (StrUtil.isNotBlank(redisPassword)) {
            serverConfig.password = redisPassword
        }
        return Redisson.create(config)
    }
}