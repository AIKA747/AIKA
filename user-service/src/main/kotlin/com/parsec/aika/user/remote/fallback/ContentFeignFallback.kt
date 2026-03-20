package com.parsec.aika.user.remote.fallback

import cn.hutool.log.StaticLog
import com.parsec.aika.user.remote.ContentFeignClient
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.stereotype.Component

@Component
class ContentFeignFallback : ContentFeignClient {
    override fun chatNum(
        userId: Long, minTime: String?, maxTime: String?, storyId: Long?
    ): BaseResult<Int> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, 0)
    }

    override fun translateLanguage(text: String, language: String): String? {
        StaticLog.error("翻译文本异常.....,language:${language},text：$text")
        return text
    }

    override fun userNotify(userId: Long?, username: String?, jobId: Long?, operator: String?): Boolean {
        StaticLog.error("用户通知异常.....,userId:${userId},username：$username")
        return false
    }

    override fun deleteFollowRelation(userId: Long) {
        StaticLog.error("用户删除关注关系异常.....,userId:${userId}")
    }

}