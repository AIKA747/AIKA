package com.parsec.aika.content.service

interface EstimatedWeightService {
    fun estimatedWeight(productDescription: String?): String
}