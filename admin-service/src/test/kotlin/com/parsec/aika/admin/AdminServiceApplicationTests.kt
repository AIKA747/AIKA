package com.parsec.aika.admin

import cn.hutool.crypto.digest.DigestUtil
import cn.hutool.jwt.JWTUtil
import cn.hutool.log.StaticLog
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class AdminServiceApplicationTests {

	@Value("\${jwt.key}")
	private lateinit var jwtKey: String

	@Test
	fun contextLoads() {
		StaticLog.info("""pwd:${DigestUtil.sha256Hex("Asdf123456.!")}""")
	}

	@Test
	fun decodeToken() {
		val token =
			"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuaWNrTmFtZSI6Iua1i-ivlei0puaItyIsImV4cCI6MTcwMzA2MzY1MCwidXNlcklkIjoxfQ.GcSb6CEYoZ5VSnnzOVv52B1q4F3zSRPzzEWAomPrkUc"
		val jwt = JWTUtil.parseToken(token).setKey(jwtKey.toByteArray())
		val jsonObject = jwt.payloads
		StaticLog.info(jsonObject.toString())
	}

}
