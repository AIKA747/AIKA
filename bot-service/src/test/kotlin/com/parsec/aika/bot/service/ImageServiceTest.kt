package com.parsec.aika.bot.service

import cn.hutool.log.StaticLog
import com.parsec.aika.bot.BotServiceApplicationTests
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class ImageServiceTest : BotServiceApplicationTests() {

    @Autowired
    private lateinit var imageService: ImageService

//    @Test
    fun imageToText() {
        val imageToText = imageService.imageToText(
            null, "https://aikafile.s3.amazonaws.com/public/20241011/ddd6c2f3aab046dea40f27e1e6571a18.png"
        )
        StaticLog.info(imageToText)
    }
//    @Test
    fun textToImage(){
        val image = imageService.textToImage("请画一个野兽和美女")
        StaticLog.info(image)
    }

}
