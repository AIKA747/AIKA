package com.parsec.aika.common.utils

import cn.hutool.core.lang.Assert
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONObject
import cn.hutool.log.StaticLog
import com.auth0.jwk.Jwk
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import java.nio.charset.StandardCharsets
import java.security.PublicKey
import java.util.*


object IOSToeknUtils {
    private const val authUrl = "https://appleid.apple.com/auth/keys"
    private const val authIss = "https://appleid.apple.com"

    /**
     * 解码identityToken
     * @param identityToken
     * @return
     */
    fun parserIdentityToken(identityToken: String): JSONObject {
        val arr = identityToken.split("\\.".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()
        val firstDate = String(Base64.getDecoder().decode(arr[0]), StandardCharsets.UTF_8)
        val decode = String(Base64.getDecoder().decode(arr[1]), StandardCharsets.UTF_8)
        val claimObj = JSONObject(decode)
        // 将第一部分获取到的kid放入消息体中，方便后续匹配对应的公钥使用
        claimObj["kid"] = JSONObject(firstDate)["kid"]
        return claimObj
    }

    /**
     * 根据kid获取对应的苹果公钥
     * @param kid
     * @return
     */
    private fun getPublicKey(kid: String?): PublicKey? {
        StaticLog.info("根据kid获取对应的苹果公钥:{}", kid)
        val data = JSONObject(HttpUtil.get(authUrl))
        StaticLog.info("do get $authUrl : $data")
        val jsonArray = data.getJSONArray("keys")
        val json = jsonArray.map { it as Map<String, Any> }.firstOrNull { it["kid"] == kid }
        Assert.state(!json.isNullOrEmpty(), "Token verification failed")
        return Jwk.fromValues(json)?.publicKey
    }

    /**
     * 对前端传来的identityToken进行验证
     *
     * @param identityToken
     * @param jsonObject
     * @return
     * @throws Exception
     */
    @Throws(Exception::class)
    fun verifyExc(identityToken: String?, jsonObject: JSONObject): Boolean {
        val kid = jsonObject["kid"] as String?
        val publicKey = getPublicKey(kid)
        val jwtParser = Jwts.parser()
        jwtParser.setSigningKey(publicKey)
        jwtParser.requireIssuer(authIss)
        jwtParser.requireAudience(jsonObject["aud"] as String?)
        jwtParser.requireSubject(jsonObject["sub"] as String?)
        return try {
            val claim = jwtParser.build().parseClaimsJws(identityToken)
            claim != null && claim.body.containsKey("auth_time")
        } catch (e: ExpiredJwtException) {
            StaticLog.error(e)
            false
        } catch (e: Exception) {
            StaticLog.error(e)
            false
        }
    }
}


