package com.parsec.aika.user.model.em

enum class RedisKeyPrefix {

    // 忘记密码的redis前缀值
    forgotPassword,

    // 验证发送邮箱验证码的redis前缀值
    verifyEmail,

    //更新邮箱前缀
    updateEmail,

    //邮箱限制
    limitSendEmail,

    // 使用条款
    userTerms,

    // 隐私政策
    confidentialityPolicy,

    //删除用户数据验证
    deleteUserValidation


}