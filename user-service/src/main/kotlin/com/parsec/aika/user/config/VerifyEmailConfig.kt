package com.parsec.aika.user.config

object VerifyEmailConfig {

    // 发送验证邮件（邮箱注册、新邮箱、邮箱登录）
    /**
     * title
     */
    const val VERIFY_EMAIL_TITLE = "Verify and log in"

    /**
     * buttonText
     */
    const val REGISTER_EMAIL_BUTTON_TEXT = "Verify Email"

    /**
     * description
     */
    const val REGISTER_EMAIL_DESCRIPTION =
        "Thank you for using AIKA! Before we get started, we just need to confirm that this is you. Click below to verify your email address:"

    /**
     * remarks
     */
    const val REGISTER_EMAIL_REMARK = "Click the button below to sign up to AIKA. This link will expire in 1 day."


    // 发送重置密码邮件（忘记密码）
    /**
     * title
     */
    const val RESET_PWD_EMAIL_TITLE = "Reset your password"

    /**
     * buttonText
     */
    const val RESET_PWD_EMAIL_BUTTON_TEXT = "Reset Password"

    /**
     * description
     */
    const val RESET_PWD_EMAIL_DESCRIPTION =
        "Your AIKA password can be reset by clicking the button below. If you did not request a new password, please ignore this email."

    /**
     * remarks
     */
    const val RESET_PWD_EMAIL_REMARK =
        "Click the button below to reset password to AIKA. This link will expire in 1 day."

    //账户更新邮箱，旧邮箱验证码发送
    /**
     * title
     */
    const val UPDATE_EMAIL_TITLE = "Change account"

    /**
     * buttonText
     */
    const val UPDATE_EMAIL_BUTTON_TEXT = "Change your email account"

    /**
     * description
     */
    const val UPDATE_EMAIL_DESCRIPTION =
        "Once you confirm the change of email account, the system will send a verification email to your current email address. Please go to your current email and follow the on-screen instructions to complete the change. After the change is successful, you will need to log in to AIKA again."

    /**
     * remarks
     */
    const val UPDATE_EMAIL_REMARK = "Click the button below to sign up to AlKA. This link will expire in 1 day."
}