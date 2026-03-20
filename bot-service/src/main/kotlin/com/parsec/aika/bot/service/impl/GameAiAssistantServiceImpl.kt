package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.RandomUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.gpt.ChatMessage
import com.parsec.aika.bot.gpt.GptAssistantClient
import com.parsec.aika.bot.gpt.GptClient
import com.parsec.aika.bot.gpt.ThreadMessage
import com.parsec.aika.bot.model.vo.resp.GameResultListRespDTO
import com.parsec.aika.bot.service.GameAiAssistantService
import com.parsec.aika.bot.service.GameMessageService
import com.parsec.aika.bot.service.GameResultService
import com.parsec.aika.bot.service.GameService
import com.parsec.aika.common.model.em.GameStatus
import com.parsec.aika.common.model.em.SourceTypeEnum
import com.parsec.aika.common.model.entity.Game
import org.bouncycastle.asn1.x500.style.RFC4519Style.description
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class GameAiAssistantServiceImpl : GameAiAssistantService {

    @Autowired
    private lateinit var gameMessageService: GameMessageService

    @Resource
    private lateinit var gameResultService: GameResultService

    @Resource
    private lateinit var gameService: GameService

    @Resource
    private lateinit var gptClient: GptClient

    @Resource
    private lateinit var gptAssistantClient: GptAssistantClient


    override fun checkGameQuestionAnswer(
        question: String, answer: String, gameId: Long, communicationStyle: String?
    ): String? {
        //1.查询游戏信息
        val gameDetail = gameService.getGameDetail(gameId)
        //2.根据game信息组装prompt
        val prompt = this.getGameQuestionPrompt(gameDetail, communicationStyle)
        //3.调用gpt判断是否为问题回复，并解析内容
        val resp = gptClient.send(prompt, chatmessages = listOf(
            ChatMessage("assistant", question), ChatMessage("user", answer), ChatMessage(
                //deepseek不支持developer角色，换成system
                "developer",
                """Please check if the message replied by the user in the above chat record is answering the assistant's question."""
            )
        ), useFun = true, jsonProperties = JSONObject().apply {
            this["type"] = "object"
            this["properties"] = JSONObject().apply {
                this["answerQuestion"] = JSONObject().apply {
                    this["type"] = "boolean"
                    this["description"] =
                        "check if the message replied by the user in the above chat record is answering the assistant's question,return true or false"
                }
                this["guide"] = JSONObject().apply {
                    this["type"] = "string"
                    this["description"] = "If answerQuestion=false, send a guidance message to the user."
                }
            }
            this["required"] = listOf("answerQuestion")
        })
        StaticLog.info("chatgpt判断问题响应消息：{}", resp)
        val jsonObj = JSONObject(resp)
        val answerQuestion = jsonObj.getBool("answerQuestion")
        if (!answerQuestion) {
            return jsonObj.getStr("guide")
        }
        return null

    }

    /**
     * 组装prompt
     */
    private fun getGameQuestionPrompt(gameDetail: Game, communicationStyle: String?): String {
        var prompt = """
            You are a game NPC, game named ${gameDetail.gameName}; 
            the game introduction is ${gameDetail.introduce}, 
            the game instructions are ${gameDetail.instructions},
            this is game question:${JSONUtil.toJsonStr(gameDetail.questions)},
            You can determine whether the message answered by the user is the answer to the specified question.
        """

        if (StrUtil.isNotBlank(communicationStyle)) {
            prompt += "your communication style is $communicationStyle"
        }
        return prompt
    }

    override fun matchGameResult(threadId: Long, userId: Long): GameResultListRespDTO {
        //1.查询游戏线程
        val gameThread = gameService.getGameThread(threadId)
        //2.查询游戏信息
        val gameDetail = gameService.getGameDetail(gameThread.gameId!!)
        //3.查询游戏结果
        val gameResults = gameResultService.getGameResults(gameThread.gameId!!)
        val jsonResults = JSONUtil.toJsonStr(gameResults.map {
            JSONObject().apply {
                this.set("id", it.id)
                this.set("summary", it.summary)
                this.set("description", it.description)
            }
        })
        //4.查询游戏聊天记录，仅查询问题和用户回复问题的记录
        val gameChatRecords = gameMessageService.getThreadChatRecords(threadId, userId, true)
        val chatMessages = gameChatRecords.map {
            if (it.sourceType == SourceTypeEnum.user) {
                ThreadMessage("user", it.textContent!!)
            } else {
                ThreadMessage("assistant", it.textContent!!)
            }
        }
        val lastmessage = """
            Please match the most suitable game result from the following result set based on the above Q&A results and return it. 
            Game result set: ${jsonResults};
            Response Example: {"id": "most matching game result object id from Game result set","msg": "Explanation of the matching game result"}.
            Always respond with a JSON object containing 'id' and 'msg'. Ensure that the response is in JSON format only, and do not include any non-JSON text.
        """.trimIndent()
        //5.查询根据游戏信息和游戏结果组装prompt
        val runAndThread = gptAssistantClient.createRunAndThread(
            gameDetail.assistantId!!, chatMessages.plus(ThreadMessage("user", lastmessage))
        )
        val runId = runAndThread.getStr("id")
        val threadId = runAndThread.getStr("thread_id")
        //轮询查询运行结果
        var runStatus: String
        var gameResult: GameResultListRespDTO?
        while (true) {
            val runStatusResp = gptAssistantClient.runStatus(threadId, runId)
            runStatus = runStatusResp.getStr("status")
            if (runStatus == "completed" || runStatus == "failed" || runStatus == "cancelled" || runStatus == "expired") {
                break
            }
            Thread.sleep(2000)
        }
        try {
            Assert.state(runStatus == "completed", "game run status error.")
            //查询记录
            val messageList = gptAssistantClient.messageList(threadId, 1)
            StaticLog.info("获取到助手结果消息：{}", JSONUtil.toJsonStr(messageList))
            val contentJson = JSONObject(messageList.first()).getJSONArray("content").first()
            StaticLog.info("获取到助手结果消息内容：{}", JSONUtil.toJsonStr(contentJson))
            val jsonObject = JSONObject(contentJson).getStr("text")
            val resultId = JSONObject(jsonObject).getLong("id")
            StaticLog.info("匹配到最匹配的游戏结果id：{}", resultId)
            gameResult = gameResults.find {
                it.id == resultId
            }
            Assert.notNull(gameResult, "No matching results found.")
        } catch (e: Exception) {
            StaticLog.error("game result error msg:{}", e.message)
            gameResult = gameResults[RandomUtil.randomInt(0, gameResults.size - 1)]
        }
        //记录游戏结果
        gameThread.status = GameStatus.COMPLETE
        gameThread.result = gameResult?.id
        gameThread.threadId = threadId
        gameService.updateGameThread(gameThread)
        return gameResult!!
    }

    override fun completeGameChatMsg(
        gameId: Long?, threadId: Long?, userId: Long, communicationStyle: String?
    ): String {
        //1.查询游戏线程
        val gameThread = gameService.getGameThread(threadId!!)
        //2.查询游戏信息
        val gameDetail = gameService.getGameDetail(gameThread.gameId!!)
        //3.查询游戏聊天记录
        val gameChatRecords = gameMessageService.getThreadChatRecords(threadId, userId, false)
        //游戏结果
        val gameResult = gameResultService.getGameResult(gameThread.result)
        //4.根据游戏和游戏结果组装prompt
        var prompt = """
            You are a game assistant, game named ${gameDetail.gameName};
            the game introduction is ${gameDetail.introduce};
            The game result is:${gameResult!!.summary}-${description};
            Please continue chatting and interacting with the player based on the game results they have matched
            """
        if (StrUtil.isNotBlank(communicationStyle)) {
            prompt += "your communication style is $communicationStyle"
        }
        //调用gpt生成回复
        val chatRecords = gameChatRecords.reversed().map {
            if (it.sourceType == SourceTypeEnum.user) {
                ChatMessage("user", it.textContent!!)
            } else {
                ChatMessage("assistant", it.textContent!!)
            }
        }
        return gptClient.send(prompt, false, null, chatRecords)
    }
}
