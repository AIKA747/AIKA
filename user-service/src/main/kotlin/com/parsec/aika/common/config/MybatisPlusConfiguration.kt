package com.parsec.aika.common.config

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor
import com.baomidou.mybatisplus.extension.plugins.inner.BlockAttackInnerInterceptor
import com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor
import com.parsec.aika.common.hander.MyMetaObjectHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * @author Zijian Liao
 * @since 1.0.0
 */
@Configuration
class MybatisPlusConfiguration {
    /**
     * MyBatis Plus 分页插件
     *
     * @return [MybatisPlusInterceptor]
     */
    @Bean
    fun mybatisPlusInterceptor(): MybatisPlusInterceptor {
        val interceptor = MybatisPlusInterceptor()
        interceptor.addInnerInterceptor(PaginationInnerInterceptor()) // 分页插件
        interceptor.addInnerInterceptor(OptimisticLockerInnerInterceptor()) // 乐观锁
        interceptor.addInnerInterceptor(BlockAttackInnerInterceptor()) // 防止全表更新及删除
        return interceptor
    }

    @Bean
    fun metaObjectHandler(): MyMetaObjectHandler {
        return MyMetaObjectHandler()
    }
}
