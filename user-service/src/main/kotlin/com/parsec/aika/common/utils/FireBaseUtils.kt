package com.parsec.aika.common.utils

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.google.firebase.messaging.*


/**
 * @Author fanqiang
 * @Date 2019/7/10 11:56
 */
object FirebaseUtils {
//
//    /**
//     * 通用消息推送  单条消息  向单个用户推送
//     *
//     * @param token 用户设备令牌
//     * @param data 额外参数 k-v
//     */
//    fun sendMsgToToken(token: String, data: Map<String, String>): String? {
//        val message = Message.builder()
//            .putAllData(data)
//            .setToken(token)
//            .build()
//        return FirebaseMessaging.getInstance().send(message)
//    }
//
    /**
     * 通用消息推送  向多个用户推送
     *
     * @param tokens 用户设备令牌
     * @param title
     * @param content
     * @param soundAlert
     * @return 成功数量
     */
    fun sendMsgToTokens(
        tokens: List<String>,
        title: String,
        content: String,
        soundAlert: String,
        data: Map<String, String?>? = HashMap()
    ): Int {
        var count = 0
        // token分组 500/组
        val lists = splitList(tokens, 500)
        try {
            lists.forEach { list ->
                val message = MulticastMessage.builder().putAllData(data).setNotification(
                    Notification.builder().setTitle(title).setBody(content).build()
                )
                    // 配置安卓和苹果的消息提示音
                    .setAndroidConfig(
                        AndroidConfig.builder().putAllData(data).setNotification(
                            AndroidNotification.builder().setSound(soundAlert)
                                .setPriority(AndroidNotification.Priority.HIGH).build()
                        ).build()
                    ).setApnsConfig(
                        ApnsConfig.builder().setAps(
                            Aps.builder().setSound(soundAlert).build()
                        ).build()
                    ).addAllTokens(list).build()
                val response = FirebaseMessaging.getInstance().sendEachForMulticast(message)
                if (response.successCount == 0) {
                    StaticLog.warn("sendMsgToTokens resp:{}", JSONUtil.toJsonStr(response))
                }

                count += response.successCount
            }
        } catch (_: Exception) {
        }
        return count
    }

    /**
     * 通用消息推送  主题消息  订阅该主题的用户全部可以接收到
     *
     * @param topic       要将消息发送至的主题名称。该主题名称不能包含 /topics/ 前缀。
     * @param title
     * @param content
     * @param soundAlert
     */
    fun sendMsgToTopic(topic: String, title: String, content: String, soundAlert: String): String {
        val message = Message.builder().setNotification(
            Notification.builder().setTitle(title).setBody(content).build()
        )
            // 配置安卓和苹果的消息提示音
            .setAndroidConfig(
                AndroidConfig.builder().setNotification(
                    AndroidNotification.builder().setSound(soundAlert).build()
                ).build()
            ).setApnsConfig(
                ApnsConfig.builder().setAps(
                    Aps.builder().setSound(soundAlert).build()
                ).build()
            ).setTopic(topic).build()
        return FirebaseMessaging.getInstance().send(message)
    }

    /**
     * 功能描述:
     * <创建主题订阅>
     *
    </创建主题订阅> */
    fun subscribeToTopic(tokens: List<String>, topic: String) {
        if (tokens.isEmpty()) return
        val lists = splitList(tokens, 1000)
        for (token in lists) {
            FirebaseMessaging.getInstance().subscribeToTopic(token, topic)
        }
    }

    /**
     * 功能描述:
     * <退订主题订阅>
     *
     * @Param: [tokens, topic]
     * @return: com.google.firebase.messaging.TopicManagementResponse
     * @Author: FanQiang
     * @Date: 2019/8/5
    </退订主题订阅> */
    fun unsubscribeFromTopic(tokens: List<String>, topic: String) {
        val lists = splitList(tokens, 1000)
        for (token in lists) {
            FirebaseMessaging.getInstance().unsubscribeFromTopic(token, topic)
        }
    }

    private fun splitList(list: List<String>, groupSize: Int): List<List<String>> {
        val length = list.size
        // 计算可以分成多少组
        val num = (length + groupSize - 1) / groupSize // TODO
        val newList: MutableList<List<String>> = ArrayList(num)
        for (i in 0 until num) {
            // 开始位置
            val fromIndex = i * groupSize
            // 结束位置
            val toIndex = if ((i + 1) * groupSize < length) (i + 1) * groupSize else length
            newList.add(list.subList(fromIndex, toIndex))
        }
        return newList
    }

}