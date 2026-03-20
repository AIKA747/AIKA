package com.parsec.aika.bot.service

interface ImageService {


    fun imageToText(describe: String?, imageUrl: String): String

    fun textToImage(describe: String): String

}