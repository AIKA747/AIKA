//package com.parsec.aika.common.config
//
//import cn.hutool.core.util.StrUtil
//import org.springframework.beans.factory.annotation.Value
//import org.springframework.context.annotation.Bean
//import org.springframework.context.annotation.Configuration
//import org.springframework.data.redis.connection.RedisConnectionFactory
//import org.springframework.data.redis.core.RedisTemplate
//import org.springframework.data.redis.core.StringRedisTemplate
//import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer
//import org.springframework.data.redis.serializer.StringRedisSerializer
//
///**
// * @author ydh
// */
//@Configuration
//class RedisConfig {
//    /**
//     * 使用前缀区分环境
//     */
//    @Value("\${env:local}")
//    private val prefix: String? = null
//
//    /**
//     * 设置redisTemplate 序列化器
//     *
//     * @param redisConnectionFactory Redis链接工厂
//     * @return redisTemplate
//     */
//    @Bean
//    fun redisTemplate(redisConnectionFactory: RedisConnectionFactory?): RedisTemplate<String, Any> {
//        val redisTemplate = RedisTemplate<String, Any>()
//        redisTemplate.setConnectionFactory(redisConnectionFactory!!)
//        val redisSerializer = PrefixRedisSerializer(prefix!!)
//        redisTemplate.keySerializer = redisSerializer
//        redisTemplate.hashKeySerializer = redisSerializer
//        val serializer = GenericJackson2JsonRedisSerializer()
//        redisTemplate.valueSerializer = serializer
//        redisTemplate.hashValueSerializer = serializer
//        redisTemplate.afterPropertiesSet()
//        return redisTemplate
//    }
//
//    /**
//     * stringRedisTemplate 序列化器
//     *
//     * @param redisConnectionFactory Redis链接工厂
//     * @return redisTemplate
//     */
//    @Bean
//    fun stringRedisTemplate(redisConnectionFactory: RedisConnectionFactory?): StringRedisTemplate {
//        val template = StringRedisTemplate()
//        template.setConnectionFactory(redisConnectionFactory!!)
//        template.keySerializer = PrefixRedisSerializer(prefix!!)
//        return template
//    }
//}
//
///**
// * @author ydh
// */
//class PrefixRedisSerializer(private val PREFIX: String) : StringRedisSerializer() {
//    /**
//     * 序列化
//     *
//     * @param s key
//     * @return 结果
//     */
//    override fun serialize(s: String?): ByteArray {
//        if (s == null) {
//            return ByteArray(0)
//        }
//        // 这里加上你需要加上的key前缀
//        val realKey = PREFIX + s
//        return super.serialize(realKey)
//    }
//
//    /**
//     * 反序列化
//     *
//     * @param bytes 数据
//     * @return 结果
//     */
//    override fun deserialize(bytes: ByteArray?): String {
//        val s = if (bytes == null) null else String(bytes)
//        if (StrUtil.isBlank(s)) {
//            return s!!
//        }
//        val index = s!!.indexOf(PREFIX)
//        return if (index != -1) {
//            s.substring(index + 2)
//        } else s
//    }
//}