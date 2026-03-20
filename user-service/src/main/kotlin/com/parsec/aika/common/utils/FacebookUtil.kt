package com.parsec.aika.common.utils

import cn.hutool.core.util.StrUtil
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog

object FacebookUtil {

    private val meUrl = "https://graph.facebook.com/me?access_token={}"

    private val userInfoUrl = "https://graph.facebook.com/{}?fields=id,name,email,picture&access_token={}"

    fun currentInfo(accessToken: String): FacebookUserInfo {
        val url = StrUtil.format(meUrl, accessToken)
        val body = HttpUtil.get(url)
        StaticLog.info("get $url \r\nresp:$body")
        val userInfo = JSONUtil.toBean(body, FacebookUserInfo::class.java)
        if (StrUtil.isBlank(userInfo.email)) {
            val url1 = StrUtil.format(userInfoUrl, userInfo.id, accessToken)
            val body1 = HttpUtil.get(url1)
            StaticLog.info("get $url1 \r\nresp:$body1")
            val jsonObject = JSONObject(body1)
            userInfo.name = jsonObject.getStr("name", "")
            userInfo.email = jsonObject.getStr("email", "")
            userInfo.picture = jsonObject.getJSONObject("picture")?.getJSONObject("data")?.getStr("url") ?: ""
        }
        return userInfo
    }

}

class FacebookUserInfo {
    var id: String? = null
    var name: String? = null
    var email: String? = null
    var picture: String? = null
}