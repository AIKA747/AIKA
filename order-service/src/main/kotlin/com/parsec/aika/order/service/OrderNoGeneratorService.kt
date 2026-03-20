package com.parsec.aika.order.service

interface OrderNoGeneratorService {

    fun generateOrderNumber(prefix: String? = "ORD"): String
}