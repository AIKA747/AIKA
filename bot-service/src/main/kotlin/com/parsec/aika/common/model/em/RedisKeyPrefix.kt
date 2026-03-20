package com.parsec.aika.common.model.em

enum class RedisKeyPrefix(value: String) {

    // 关键字
    botkeywordexplore("bot:explore:keywords:"),
    // did的视频id和机器人对应关系
    botVideoDid("bot:video:did:")
}