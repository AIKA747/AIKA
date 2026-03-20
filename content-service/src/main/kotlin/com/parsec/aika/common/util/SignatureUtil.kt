package com.parsec.aika.common.util

import cn.hutool.core.collection.CollUtil
import cn.hutool.crypto.digest.DigestUtil
import java.util.*

object SignatureUtil {
    /**
     * 签名校验
     */
    fun verification(signature: String?, args: List<String?>): Boolean {
        return signature(args) == signature
    }

    /**
     * 参数列表生成签名
     */
    fun signature(args: List<String?>): String {
        val list = args.filterNotNull()
        Collections.sort(list)
        val listStr = CollUtil.join(list, ",")
        return DigestUtil.md5Hex(listStr)
    }

}