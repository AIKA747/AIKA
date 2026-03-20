package com.parsec.aika.bot.gpt

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.BotServiceApplicationTests
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class GptAssistantClientTest : BotServiceApplicationTests() {

    @Autowired
    private lateinit var gptAssistantClient: GptAssistantClient

    //    @Test
    fun assistantList() {
        val assistantList = gptAssistantClient.assistantList()
        StaticLog.info(JSONUtil.toJsonStr(assistantList))
    }

//        @Test
    fun assistantTest() {
        //创建助手
        val assistantId = gptAssistantClient.createAssistant("Tester", "测试助手创建")
        assertNotNull(assistantId)
        //查询助手详情
        val assistantDetail = gptAssistantClient.assistantDetail(assistantId)
        assertEquals("测试助手创建", assistantDetail.getStr("description"))
        //编辑助手
        val assistantDetail1 = gptAssistantClient.editAssistant(assistantId, "Tester", "测试助手编辑")
        //查询助手详情
        assertEquals("测试助手编辑", assistantDetail1.getStr("description"))
        //删除测试创建的助手
        gptAssistantClient.deleteAssistant(assistantId)
    }

    //    @Test
    fun threadTest() {
        //创建线程
        val threadId = gptAssistantClient.createThread()
        assertNotNull(threadId)
        //编辑线程
        val threadDetail = gptAssistantClient.editThread(
            threadId, JSONUtil.createObj().set("metadata", JSONUtil.createObj().set("modified", "modified"))
        )
        assertEquals("modified", threadDetail.getJSONObject("metadata").getStr("modified"))
        //查询线程详情
        val detail = gptAssistantClient.threadDetail(threadId)
        assertEquals("modified", detail.getJSONObject("metadata").getStr("modified"))
        //删除测试创建的线程
        gptAssistantClient.deleteThread(threadId)
    }

//    @Test
    fun threadRunTest() {
        val description = """
            游戏的情节围绕一个角色被困在一座荒岛上，玩家通过回答问题来决定主角的命运。游戏的三个结局分别是“逃脱成功”、“被困岛上”与“未知结局”。
            游戏设定
            背景：你是一个海上旅行者，因暴风雨被吹到了一座荒岛上。你必须做出一系列选择，决定是否能顺利逃脱，或者会永远被困。
            结局设计
                结局1（id:10001）：逃脱成功
                    如果玩家多次选择探索和积极寻找资源，并且选择信任线索（例如选项1A、2A、3A、4A、5A），最终玩家能在几个月内修复小船并成功逃脱，回到文明世界。
                结局2（id:10002）：被困岛上
                    如果玩家选择过于依赖等待或者过于保守（例如选项1B、2C、4C），最终玩家可能会因无法有效获取资源或者被岛上的危险动物袭击，陷入困境，最终被困在岛上。
                结局3（id:10003）：未知结局
                    如果玩家的选择是混合的，例如选择了一些保守的策略，又在关键时刻选择冒险（例如选项3B、4B、5B），主角的结局将变得未知。可能在岛上消失或成为当地的一部分，或者可能在未知的冒险中走向不同的命运
            当前用户提问结局如何时，请直接回复上述结局的id
        """.trimIndent()

        //创建助手
        val assistantId = gptAssistantClient.createAssistant("Tester", description)
        //创建run and thread
        val createRunAndThreadResult = gptAssistantClient.createRunAndThread(
            assistantId, listOf(
                ThreadMessage(
                    "assistant", """
                1. 你醒来后，发现自己躺在沙滩上，周围是未知的荒岛。你决定：
                    A. 立即探索四周，看看能否找到帮助。
                    B. 先在沙滩上休息，等待其他船只经过。
                    C. 回到树荫下，思考如何能生存下来。
            """.trimIndent()
                ), ThreadMessage("user", "立即探索四周，看看能否找到帮助"), ThreadMessage(
                    "assistant", """
                2.你走进森林，突然遇到了一只巨大的猴子，它看起来并不友好。你决定：
                    A. 尝试用食物吸引它，避免冲突。
                    B. 拿起树枝威胁它，让它退后。
                    C. 向它道歉，试图安抚它。
            """.trimIndent()
                ), ThreadMessage("user", "拿起树枝威胁它，让它退后"), ThreadMessage(
                    "assistant", """
               3.你发现一个古老的船只遗址，船体已经被海水侵蚀。你决定：
                    A. 搜索船只，看看能否找到逃生工具。
                    B. 离开船只，继续寻找其他逃生的线索。
                    C. 不再理会船只，专心寻找水源。
            """.trimIndent()
                ), ThreadMessage("user", "搜索船只，看看能否找到逃生工具"), ThreadMessage(
                    "assistant", """
               4.经过几天的生存，你渐渐觉得食物和水源短缺。你决定：
                    A. 去海边打猎，希望能捕到一些海鱼。
                    B. 深入丛林，寻找可以食用的水果和植物。
                    C. 停下来休息，等待有人来救你。
            """.trimIndent()
                ), ThreadMessage("user", "深入丛林，寻找可以食用的水果和植物"), ThreadMessage(
                    "assistant", """
                5.你在海滩上发现了一艘不明的小船，船上有一封信。信中提到了一条逃生路线。你决定：
                    A. 立即按照信中的路线前往。
                    B. 不信任信件，决定自己寻找出路。
                    C. 将信交给附近的原住民，看看他们是否知道相关信息。
            """.trimIndent()
                ), ThreadMessage("user", "立即按照信中的路线前往"),
                ThreadMessage(
                    "user",
                    """结局如何,请按json格式返回游戏结局，仅返回编程可反序列化为对象的json格式结果，json模板：{"id":10001, "name":"逃脱成功",description:"结果分析描述"}"""
                )
            )
        )
        StaticLog.info("createRunAndThreadResult: $createRunAndThreadResult")
    }

    //    @Test
    fun runStatus() {
        val runStatus = gptAssistantClient.runStatus("thread_eE5psjqx9vlLLpUBu0WJnpcI", "run_QpZWVFnJdXC7JxnBBqvdwT4b")
        StaticLog.info("runStatus:$runStatus")
    }

//    @Test
    fun messageTest() {
        val threadId = "thread_xjlcLwy7rMOq9hIyCikJjZZX"
        //查询消息列表
        val messageList = gptAssistantClient.messageList(threadId)
        StaticLog.info("messageList:$messageList")

//        val messageId = gptAssistantClient.addMessage(
//            threadId, ThreadMessage("user", "立即探索四周，看看能否找到帮助")
//        )
//        StaticLog.info("message:$messageId")
//        val messageList1 = gptAssistantClient.messageList(threadId)
//        StaticLog.info("messageList1:$messageList1")
//        //删除消息
//        gptAssistantClient.deleteMessage(threadId, messageId)
//        val messageList2 = gptAssistantClient.messageList(threadId)
//        StaticLog.info("messageList2:$messageList2")
    }

}