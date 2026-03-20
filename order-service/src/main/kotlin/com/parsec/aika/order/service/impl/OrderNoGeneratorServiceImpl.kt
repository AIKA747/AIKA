package com.parsec.aika.order.service.impl

import com.parsec.aika.order.service.OrderNoGeneratorService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.core.script.RedisScript
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.TimeUnit

@Service
class OrderNoGeneratorServiceImpl : OrderNoGeneratorService {

    @Autowired
    private lateinit var redisTemplate: RedisTemplate<String, Any>

    private val ORDER_NUMBER_KEY = "order:number:"

    override fun generateOrderNumber(prefix: String?): String {
        val orderNumber = generateUniqueOrderNumber()
        return "$prefix$orderNumber"
    }

    private fun generateUniqueOrderNumber(): String {
        val currentDateTime = LocalDateTime.now()
        val formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
        val formattedDateTime = currentDateTime.format(formatter)
        // 使用Redis的INCR操作保证原子性，生成递增的唯一订单号
        val atomicLong = incrAndExpire("$ORDER_NUMBER_KEY$formattedDateTime", 1, 5, TimeUnit.SECONDS)
        val paddedOrderNumber = String.format("%04d", atomicLong)
        return "$formattedDateTime$paddedOrderNumber"
    }

    fun incrAndExpire(key: String, delta: Long, time: Long, unit: TimeUnit): Long {
        if (delta < 0) {
            throw RuntimeException("递增因子必须大于0")
        }
        val script = "local incrValue = redis.call('incrby', KEYS[1], ARGV[1]); " +
                "redis.call('expire', KEYS[1], ARGV[2]);" +
                "return incrValue "
        return redisTemplate.execute(
            RedisScript.of(
                script,
                Long::class.java
            ), listOf(key), delta, unit.toSeconds(time)
        )
    }

}