package com.parsec.aika.chat.model.vo.resp

import java.io.Serializable

/**
 * @author ydh
 * @date 2023年01月14日 11:06
 * @description：
 */
class EmqxResp private constructor(result: String) : Serializable {

    /**
     * allow：允许。
     * deny：拒绝。
     * ignore：忽略本次请求，把它移交给下一个 规则 处理。
     */
    var result: String? = result

    companion object {
        private val allowResult = EmqxResp("allow")
        private val denyResult = EmqxResp("deny")
        private val ignoreResult = EmqxResp("ignore")
        fun allow(): EmqxResp {
            return allowResult
        }

        fun deny(): EmqxResp {
            return denyResult
        }

        fun ignore(): EmqxResp {
            return ignoreResult
        }
    }
}
