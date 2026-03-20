package com.parsec.aika.user.model.em

/**
 * 关注状态枚举
 */
enum class FollowerStatusEnum {
    /*
       "互相关注"
    */
    MUTUAL,

    /*
        "我关注他"
    */
    FOLLOWING,

    /*
      "他关注我"
    */
    FOLLOWED_BY,
}
