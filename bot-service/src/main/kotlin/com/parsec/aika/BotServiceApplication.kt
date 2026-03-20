package com.parsec.aika

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@EnableFeignClients
@SpringBootApplication
class BotServiceApplication

fun main(args: Array<String>) {
    runApplication<BotServiceApplication>(*args)
}
