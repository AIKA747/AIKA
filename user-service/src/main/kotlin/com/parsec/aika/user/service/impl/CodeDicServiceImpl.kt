package com.parsec.aika.user.service.impl

import cn.hutool.core.util.StrUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.user.mapper.CodeDicMapper
import com.parsec.aika.user.model.entity.CodeDic
import com.parsec.aika.user.model.entity.CodeType
import com.parsec.aika.user.service.CodeDicService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class CodeDicServiceImpl : CodeDicService {

    @Autowired
    private lateinit var codeDicMapper: CodeDicMapper

    override fun check(type: CodeType, code: String?): Boolean {
        //若编码为空，不校验
        if (StrUtil.isBlank(code)) {
            return false
        }
        val count = codeDicMapper.selectCount(
            KtQueryWrapper(CodeDic::class.java).eq(CodeDic::type, type).eq(CodeDic::code, code)
        )
        return count > 0
    }


}