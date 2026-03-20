package com.parsec.aika.user.service.impl

import com.parsec.aika.user.model.props.AppConfigProps
import com.parsec.aika.user.service.UserChatNumService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Service

@RefreshScope
@Service
class UserChatNumServiceImpl : UserChatNumService {

    @Autowired
    private lateinit var appConfigProps: AppConfigProps

    override fun getUserEnableChatNum(userId: Long): Int {
        return appConfigProps.freeCount ?: 3
    }
}