package com.parsec.aika.user.config

import cn.hutool.log.StaticLog
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component
import java.io.IOException
import java.io.InputStream

@Component
@Order(1)
class FireBaseConfig : CommandLineRunner {
    @Throws(java.lang.Exception::class)
    override fun run(vararg args: String) {
        init()
    }

    @Throws(IOException::class)
    private fun init() {
        try {
            StaticLog.info("init FirebaseApp start...")
            //协议开放 克服握手错误
            System.setProperty("https.protocols", "TLSv1,TLSv1.1,TLSv1.2")
            //firebase初始化
            val classPathResource = ClassPathResource("firebase/aika-382ef-firebase-adminsdk-fbsvc-1b2f256883.json")
            val inputStream: InputStream = classPathResource.inputStream
            val options = FirebaseOptions.builder().setCredentials(GoogleCredentials.fromStream(inputStream))
//            .setDatabaseUrl("https://aika-410203.firebaseio.com/") //
                .build()
            FirebaseApp.initializeApp(options)
            StaticLog.info("init FirebaseApp end!!!")
        } catch (e: Exception) {
            StaticLog.error(e)
        }
    }


}