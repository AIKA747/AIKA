package com.parsec.aika.common.model.bo

class GorseItemBO {

    var itemId: String? = null

    var comment: String? = null

    var category: GorseCategory? = null

    var labels: List<String>? = null

    var method: GorseMethod? = null

}

class GorseFeedbackBO {

    var userId: String? = null

    var itemId: String? = null

    var feedbackType: GorseFeedbackType? = null

    var method: GorseMethod? = null

    var comment: String? = null
}

enum class GorseFeedbackType {
    star, like, read
}

enum class GorseMethod {
    save, del
}

enum class GorseCategory {
    user, post, comment
}