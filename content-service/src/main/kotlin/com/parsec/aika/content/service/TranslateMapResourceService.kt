package com.parsec.aika.content.service

import com.baomidou.mybatisplus.extension.service.IService
import com.parsec.aika.common.model.entity.TranslateMapResource


/**
 * @author 77923
 * @description 针对表【t_translate_map_resource】的数据库操作Service
 * @createDate 2024-10-23 11:45:17
 */
interface TranslateMapResourceService : IService<TranslateMapResource?> {
    /**
     * 获取翻译文本
     */
    fun getTranslateMapResouce(text: String, language: String): String?

    /**
     * 刷新翻译配置
     */
    fun refreshTranslateMapResource()
}
