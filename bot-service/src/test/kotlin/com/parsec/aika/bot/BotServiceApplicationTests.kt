package com.parsec.aika.bot

import cn.hutool.log.StaticLog
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import java.util.regex.Matcher
import java.util.regex.Pattern

@SpringBootTest
class BotServiceApplicationTests {

    @Test
    fun contextLoads() {
        val text = "大家好，@张 三 欣喜地通知你，@李四 和 @王五_001 都已经加入群聊！"

        // 正则表达式：匹配 @ 后面的用户名（支持中文、英文、数字、下划线）
        val regex = "@([\\u4e00-\\u9fa5\\w]+)"

        val pattern: Pattern = Pattern.compile(regex)
        val matcher: Matcher = pattern.matcher(text)

        while (matcher.find()) {
            StaticLog.info("找到的用户名: {}", matcher.group(1))
        }
    }

}
