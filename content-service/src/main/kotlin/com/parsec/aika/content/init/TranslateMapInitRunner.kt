package com.parsec.aika.content.init

import cn.hutool.log.StaticLog
import com.parsec.aika.content.service.TranslateMapResourceService
import org.springframework.boot.context.event.ApplicationStartedEvent
import org.springframework.context.ApplicationListener
import org.springframework.stereotype.Component
import jakarta.annotation.Resource

@Component
class TranslateMapInitRunner : ApplicationListener<ApplicationStartedEvent> {

    @Resource
    private lateinit var translateMapResourceService: TranslateMapResourceService

    override fun onApplicationEvent(event: ApplicationStartedEvent) {
        try {
            StaticLog.info("=========开始初始化翻译资源=========")
            translateMapResourceService.refreshTranslateMapResource()
            StaticLog.info("=========初始化翻译资源完成=========")
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}