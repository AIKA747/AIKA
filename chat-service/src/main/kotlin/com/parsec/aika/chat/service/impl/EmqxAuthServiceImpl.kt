package com.parsec.aika.chat.service.impl

import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONUtil
import cn.hutool.jwt.JWTUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.chat.model.props.ConfigProps
import com.parsec.aika.chat.model.vo.resp.EmqxResp
import com.parsec.aika.chat.service.AppUserOnlineService
import com.parsec.aika.chat.service.EmqxAuthService
import com.parsec.aika.common.model.constrant.RedisConst.CHAT_CONN_USER_INFO
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.redis.util.RedisUtil
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class EmqxAuthServiceImpl : EmqxAuthService {

    @Autowired
    private lateinit var configProps: ConfigProps

    @Resource
    private lateinit var appUserOnlineService: AppUserOnlineService
    override fun connectAuth(username: String, token: String): EmqxResp {
        StaticLog.info("connectAuth username:{}\n connectAuth token:{}", username, token)
        if (configProps.connTest == true && username.startsWith("test")) {
            return if (username == token) {
                StaticLog.info("测试链接成功：{}", username)
                EmqxResp.allow()
            } else {
                EmqxResp.ignore()
            }
        }
        if (username == configProps.username) {
            return if (token == configProps.password) {
                StaticLog.info("服务端实例链接成功：$username")
                EmqxResp.allow()
            } else {
                EmqxResp.ignore()
            }
        }
        //验证token令牌
        if (!JWTUtil.verify(token, configProps.jwtKey!!.toByteArray())) {
            return EmqxResp.deny()
        }
        val jwt = JWTUtil.parseToken(token).setKey(configProps.jwtKey!!.toByteArray())
        if (!jwt.verify()) {
            return EmqxResp.deny()
        }
        val payloads = jwt.payloads
        val userInfo = JSONUtil.toBean(payloads, LoginUserInfo::class.java)
        if (
        //用户的token状态可用
            userInfo.status != UserStatus.enabled || username != "${userInfo.userType!!.name}${userInfo.userId}" || StrUtil.isBlank(
                userInfo.username
            )
        ) {
            return EmqxResp.deny()
        }
        //设置用户连接信息
        RedisUtil.set("$CHAT_CONN_USER_INFO$username", JSONUtil.toJsonStr(userInfo))
        //标记用户在线
        appUserOnlineService.online(userInfo.userId!!)
        //默认通过
        return EmqxResp.allow()
    }

    override fun topicAuth(username: String, topic: String, action: String): EmqxResp {
        StaticLog.info("topicAuth username:{}\ntopicAuth topic:{}\ntopicAuth aciton:{}", username, topic, action)
        if (action == "publish") {
            //仅发布该账户可订阅的通道
            val botTopic = StrUtil.format(configProps.botTopic, username)
            return if (topic == botTopic) EmqxResp.allow() else EmqxResp.deny()
        }
        if (action == "subscribe") {
            return if (topic == StrUtil.format(configProps.userTopic, username)) EmqxResp.allow() else EmqxResp.ignore()
        }
        //默认忽略
        return EmqxResp.ignore()
    }


}