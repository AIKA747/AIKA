package com.parsec.aika.chat.service

import com.parsec.aika.chat.model.vo.resp.EmqxResp

interface EmqxAuthService {
    /**
     * 链接鉴权
     */
    fun connectAuth(username: String, token: String): EmqxResp

    /**
     * 发布订阅鉴权
     */
    fun topicAuth(username: String, topic: String, action: String): EmqxResp
}