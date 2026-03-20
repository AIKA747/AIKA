package com.parsec.aika.user.model.em

/**
 * 兴趣类型
 */
enum class InterestItemType {
    SPORT,
    ENTERTAINMENT,
    NEWS,
    GAMING,
    ARTISTIC,
    LIFESTYLE,
    TECHNOLOGY,
    SOCIAL,
    OTHER;

    companion object {
        fun otherInterests(): List<InterestItemType> {
            return listOf(SPORT, ENTERTAINMENT, ARTISTIC, NEWS, LIFESTYLE, GAMING, TECHNOLOGY, SOCIAL)
        }
    }

}
