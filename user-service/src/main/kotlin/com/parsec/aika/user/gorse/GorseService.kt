package com.parsec.aika.user.gorse

import cn.hutool.core.date.LocalDateTimeUtil
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.http.HttpUtil
import cn.hutool.http.Method
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.GorseCategory
import com.parsec.aika.common.model.bo.GorseFeedbackType
import com.parsec.aika.user.gorse.model.CacheScored
import com.parsec.aika.user.model.em.Gender
import com.parsec.aika.user.model.entity.AppUserInfo
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@RefreshScope
@Service
class GorseService {

    @Value("\${gorse.url:http://gorse-test.aikavision.com}")
    private var url: String? = null

    @Value("\${gorse.apiKey:6a6135f851c211f0a38902420a000103}")
    private var apiKey: String? = null

    private final val pool = ThreadUtil.newSingleExecutor()

    fun saveUser(user: AppUserInfo, subscribe: List<String>?) {
        try {
            val labels = ArrayList<String>()
            labels.addAll(user.tags ?: emptyList())
            labels.add((user.gender ?: Gender.HIDE).name)
            labels.add(user.country ?: "US")
            labels.add(user.language ?: "en")
            labels.add(user.countryCode ?: "US")
            this.saveUser(user.id.toString(), user.bio, labels, subscribe ?: emptyList())
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun deleteUser(userId: String) {
        pool.execute {
            try {

                val response =
                    HttpUtil.createRequest(Method.DELETE, "$url/api/user/$userId").header("X-API-Key", apiKey)
                        .contentType("application/json").execute()
                if (response.isOk) {
                    //将用户信息抽象为user类型的item也一起删除
                    this.deleteItem(userId)
                } else {
                    StaticLog.error("deleteUser[{}], status:{}, response: {}", userId, response.status, response.body())
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun saveItem(itemId: String, comment: String?, category: GorseCategory, labels: List<String>) {
        pool.execute {
            try {
                val response = HttpUtil.createPost("$url/api/item").header("X-API-Key", apiKey).body(
                    JSONUtil.toJsonStr(JSONObject().apply {
                        set("ItemId", itemId)
                        set("Categories", listOf(category.name))
                        set("IsHidden", false)
                        set("Labels", labels)
                        set("Comment", comment)
                        set("Timestamp", LocalDateTimeUtil.format(LocalDateTime.now(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"))
                    })
                ).execute()
                if (!response.isOk) {
                    StaticLog.error("saveItem[{}], status:{}, response: {}", itemId, response.status, response.body())
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun deleteItem(itemId: String) {
        pool.execute {
            try {
                val response =
                    HttpUtil.createRequest(Method.DELETE, "$url/api/item/$itemId").header("X-API-Key", apiKey)
                        .contentType("application/json").execute()
                if (!response.isOk) {
                    StaticLog.error("deleteItem[{}], status:{}, response: {}", itemId, response.status, response.body())
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun saveFeedback(userId: String, itemId: String, comment: String?, feedback: GorseFeedbackType) {
        pool.execute {
            try {
                val response = HttpUtil.createRequest(Method.PUT, "$url/api/feedback").header("X-API-Key", apiKey).body(
                    JSONUtil.toJsonStr(listOf(JSONObject().apply {
                        set("UserId", userId)
                        set("ItemId", itemId)
                        set("FeedbackType", feedback.name)
                        set("Comment", comment)
                        set("Timestamp", LocalDateTimeUtil.format(LocalDateTime.now(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"))
                    }))
                ).execute()
                if (!response.isOk) {
                    StaticLog.error(
                        "saveFeedback[{}], status:{}, response: {}", itemId, response.status, response.body()
                    )
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun deleteFeedback(userId: String, itemId: String, feedback: GorseFeedbackType) {
        pool.execute {
            try {
                val url = "$url/api/feedback/${feedback.name}/${userId}/${itemId}"
                StaticLog.info("deleteFeedbackurl:{}", url)
                val response = HttpUtil.createRequest(Method.DELETE, url).header("X-API-Key", apiKey)
                    .contentType("application/json").execute()
                if (!response.isOk) {
                    StaticLog.error(
                        "deleteFeedback[{}], status:{}, response: {}", itemId, response.status, response.body()
                    )
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun getNeighborsUsers(userId: Long, limit: Int): List<CacheScored> {
        val response =
            HttpUtil.createGet("$url/api/user/$userId/neighbors?n=$limit").header("X-API-Key", apiKey).execute()
        return if (response.isOk) {
            JSONUtil.toList(response.body(), CacheScored::class.java)
        } else {
            StaticLog.error("getNeighborsUsers[{}], status:{}, response: {}", userId, response.status, response.body())
            emptyList()
        }
    }

    fun getRecommendation(userId: Long, category: GorseCategory, limit: Int): List<String> {
        val response =
            HttpUtil.createGet("$url/api/recommend/$userId/${category.name}?n=$limit").header("X-API-Key", apiKey)
                .execute()
        return if (response.isOk) {
            JSONUtil.toList(response.body(), String::class.java)
        } else {
            StaticLog.error("getNeighborsUsers[{}], status:{}, response: {}", userId, response.status, response.body())
            emptyList()
        }
    }

    private fun saveUser(userId: String, comment: String?, labels: List<String>, subscribe: List<String>?) {
        val response = HttpUtil.createPost("$url/api/user").header("X-API-Key", apiKey).body(
            JSONUtil.toJsonStr(JSONObject().apply {
                set("UserId", userId)
                set("Labels", labels)
                set("Comment", comment)
                set("Subscribe", subscribe)
                set("Timestamp", LocalDateTimeUtil.format(LocalDateTime.now(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"))
            })
        ).execute()
        if (response.isOk) {
            //将用户信息抽象为user类型的item保存一下
            this.saveItem(userId, comment, GorseCategory.user, labels)
        } else {
            StaticLog.error("saveUser[{}], status:{}, response: {}", userId, response.status, response.body())
        }
    }

}