package com.parsec.aika.user.consumer

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import com.parsec.aika.user.config.RabbitmqConst.USER_STORIES_INFO_QUEUE
import com.parsec.aika.user.mapper.AppUserMapper
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.time.LocalDateTime

/**
 * 用户故事数量更新
 */
@Component
class StoryMessageConsumer {

    @Autowired
    private lateinit var appUserMapper: AppUserMapper

    @RabbitHandler
    @RabbitListener(queues = [USER_STORIES_INFO_QUEUE])
    fun userStoryCountReceiver(msg: String) {
        try {
            val param = JSONUtil.parseObj(msg)
            val user = appUserMapper.selectById(param.getLong("userId"))
            Assert.notNull(user, "用户【{}】数据为null", param.getLong("userId"))
            var flag = false
            if (param.containsKey("count")) {
                user.storyTotal = param.getInt("count")
                flag = true
            }
            if (param.containsKey("commentTotal")) {
                user.commentTotal = param.getInt("commentTotal")
                flag = true
            }
            if (param.containsKey("lastShareStoryAt")) {
                user.lastShareStoryAt = param.getLocalDateTime("lastShareStoryAt", LocalDateTime.now())
                flag = true
            }
            if (flag) {
                appUserMapper.updateById(user)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

}