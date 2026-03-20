package com.parsec.aika.user.model.vo.req

/**
 * @author husu
 * @version 1.0
 * @date 2025/4/25.
 */
class AppUserVectorVo {
    var id: Long? = null

    var sport: List<VectorItem>? = null

    var entertainment: List<VectorItem>? = null

    var news: List<VectorItem>? = null

    var gaming: List<VectorItem>? = null

    var artistic: List<VectorItem>? = null

    var lifestyle: List<VectorItem>? = null

    var technology: List<VectorItem>? = null

    var social: List<VectorItem>? = null

    //用于归一化的最大距离
    var sportMaxDistance: Double? = null
    var entertainmentMaxDistance: Double? = null
    var newsMaxDistance: Double? = null
    var gamingMaxDistance: Double? = null
    var artisticMaxDistance: Double? = null
    var lifestyleMaxDistance: Double? = null
    var technologyMaxDistance: Double? = null
    var socialMaxDistance: Double? = null

}

data class VectorItem(var key: String, var value: Int)
