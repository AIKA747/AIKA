package com.parsec.aika.common.model.bo

class ImageMessageBO(

    /**
     * 生成图片的消息id
     */
    val msgId: String?,

    /**
     * 图片链接
     */
    val imageUrl: String?,

    /**
     * 进度
     */
    val progress: String?,
    /**
     * 状态
     */
    val status: String?
)