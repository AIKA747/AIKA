package com.parsec.aika.admin.model.vo.req

import com.parsec.trantor.validator.annotation.Pwd
import java.io.Serializable
import javax.validation.constraints.NotNull

class AdminUpdatePwdReq : Serializable {

    /**
     * 新密码
     */
    @Pwd
    @NotNull(message = "新密码不能为空")
    var newPwd: String? = null

    /**
     * 旧密码
     * 由于该对象用于“修改初始密码”、“修改密码”两处，而前一接口不需要旧密码参数，故该字段在此处不加验证
     */
    var oldPwd: String? = null

}