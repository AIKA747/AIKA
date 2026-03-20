package com.parsec.aika.user.scheduler


import cn.hutool.core.thread.ThreadUtil
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.quartz.SchedulerFactoryBean
import java.io.IOException
import java.util.concurrent.Executor
import javax.sql.DataSource


@Configuration
class SchedulerConfig {

    @Autowired
    private val dataSource: DataSource? = null

    /**
     * Scheduler工厂类
     *
     * @return
     * @throws IOException
     */
    @Bean
    @Throws(IOException::class)
    fun schedulerFactoryBean(): SchedulerFactoryBean {
        val factory = SchedulerFactoryBean()
        factory.setSchedulerName("Cluster_Scheduler")
        factory.setDataSource(dataSource!!)
        factory.setApplicationContextSchedulerContextKey("applicationContext")
        factory.setTaskExecutor(schedulerThreadPool())
        //factory.setQuartzProperties(quartzProperties());
        factory.setStartupDelay(10) // 延迟10s执行
        return factory
    }

    /**
     * 配置Schedule线程池
     *
     * @return
     */
    @Bean
    fun schedulerThreadPool(): Executor {
        return ThreadUtil.createScheduledExecutor(Runtime.getRuntime().availableProcessors())
    }

}
