package com.parsec.aika.user.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.user.model.entity.FirebaseUserToken
import org.apache.ibatis.annotations.Mapper

@Mapper
interface FirebaseUserTokenMapper : BaseMapper<FirebaseUserToken> {
}