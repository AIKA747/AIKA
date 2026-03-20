package com.parsec.aika.content.service.impl

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl
import com.parsec.aika.common.mapper.TranslateMapResourceMapper
import com.parsec.aika.common.model.entity.TranslateMapResource
import com.parsec.aika.content.service.TranslateMapResourceService
import jakarta.annotation.Resource
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service

/**
 * @author 77923
 * @description 针对表【t_translate_map_resource】的数据库操作Service实现
 * @createDate 2024-10-23 11:45:17
 */
@Service
class TranslateMapResourceServiceImpl : ServiceImpl<TranslateMapResourceMapper?, TranslateMapResource?>(),
    TranslateMapResourceService {

    private var mapResourceList: List<TranslateMapResource?>? = null

    @Resource
    private var stringRedisTemplate: StringRedisTemplate? = null

    override fun getTranslateMapResouce(text: String, language: String): String? {
        if (CollUtil.isEmpty(mapResourceList) || StrUtil.isBlank(text)) {
            return null
        }
        val mapResource = mapResourceList!!.find {
            text.trim() == it?.content?.trim()
        }
        if (null == mapResource) {
            return null
        }
        return mapResourceList!!.firstOrNull {
            mapResource.uuid == it?.uuid && it?.language == language
        }?.content
    }

    override fun refreshTranslateMapResource() {
        StaticLog.info("=========开始初始化静态翻译资源=========")
        mapResourceList =
            this.ktQuery().orderByAsc(TranslateMapResource::uuid).orderByDesc(TranslateMapResource::sortNo).list()
        //将语言分组
        val groupMap = HashMap<String, ArrayList<TranslateMapResource>>()
        for (tmr in mapResourceList!!) {
            val resourceList = if (groupMap.containsKey(tmr!!.uuid)) {
                groupMap[tmr.uuid]
            } else {
                val list = ArrayList<TranslateMapResource>()
                groupMap[tmr.uuid!!] = list
                list
            }
            resourceList!!.add(tmr)
        }
        //重置已设置翻译的缓存
        groupMap.values.forEach {
            refreshTranslateCache(it)
        }
        StaticLog.info("=========初始化静态翻译文件完成=========")
    }

    private fun refreshTranslateCache(groupList: ArrayList<TranslateMapResource>) {
        for (i in groupList) {
            for (j in groupList) {
                if (i.language == j.language) {
                    continue
                }
                val key = "translate:language:${j.language}"
                val hashOperations = stringRedisTemplate!!.opsForHash<String, String>()
                if (i.language == "en") {
                    hashOperations.put(key, i.content!!, j.content!!)
                } else {
                    hashOperations.delete(key, i.content)
                }
            }
        }

    }

}




