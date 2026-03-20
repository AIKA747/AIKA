package com.parsec.aika.user.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.parsec.aika.user.mapper.FirebaseUserTokenMapper
import com.parsec.aika.user.model.entity.FirebaseUserToken
import com.parsec.aika.user.service.FirebaseUserTokenService
import org.springframework.stereotype.Service
import javax.annotation.Resource


@Service
class FirebaseUserTokenServiceImpl : FirebaseUserTokenService {

    @Resource
    private lateinit var firebaseUserTokenMapper: FirebaseUserTokenMapper

    /**
     * 绑定firebasetoken
     */
    override fun bind(userId: Long, token: String) {
        firebaseUserTokenMapper.delete(
            KtUpdateWrapper(FirebaseUserToken::class.java).eq(FirebaseUserToken::userId, userId).or()
                .eq(FirebaseUserToken::token, token)
        )
        firebaseUserTokenMapper.insert(FirebaseUserToken().apply {
            this.userId = userId
            this.token = token
        })
    }

    override fun unbindUserToken(userId: Long): Int {
        return firebaseUserTokenMapper.delete(
            KtUpdateWrapper(FirebaseUserToken::class.java).eq(
                FirebaseUserToken::userId, userId
            )
        )
    }

}