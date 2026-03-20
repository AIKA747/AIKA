package com.parsec.aika.common.model.em

enum class RecommendStrategy {
    /**
     * 热度
     */
    popular,

    /**
     * 随机
     */
    random,

    /**
     * 平衡，与热度筛选条件相反
     */
    balance


}