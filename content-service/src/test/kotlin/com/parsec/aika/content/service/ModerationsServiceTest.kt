package com.parsec.aika.content.service

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.content.ContentServiceApplicationTests
import org.junit.jupiter.api.Test
import jakarta.annotation.Resource

class ModerationsServiceTest : ContentServiceApplicationTests() {

    @Resource
    private lateinit var moderationsService: ModerationsService

    //    @Test
    fun test() {
        val pair = moderationsService.moderations("我要毁灭世界，哈哈哈哈哈哈！！")
        StaticLog.info("是否敏感：{}", pair?.first)
        StaticLog.info("敏感标签：{}", JSONUtil.toJsonStr(pair?.second))
    }

}