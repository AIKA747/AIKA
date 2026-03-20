package com.parsec.aika.user.service

import com.parsec.aika.user.model.entity.CodeType

interface CodeDicService {

    fun check(type: CodeType, code: String?): Boolean

}