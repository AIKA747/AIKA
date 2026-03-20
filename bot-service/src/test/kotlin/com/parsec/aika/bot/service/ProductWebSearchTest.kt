package com.parsec.aika.bot.service

import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import cn.hutool.poi.excel.ExcelUtil
import com.parsec.aika.bot.gpt.OpenaiRestHandler
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import javax.annotation.Resource

@SpringBootTest
class ProductWebSearchTest {

    @Resource
    private lateinit var openaiRestHandler: OpenaiRestHandler

    @Test
    fun work() {
        val filePath = "E:\\Users\\Administrator\\Desktop\\goods20250829.xlsx"
        val excelReader = ExcelUtil.getReader(filePath)
//        for (i in 0..903) {
        for (i in 1..2) {
            val productNameZH = excelReader.readCellValue(1, i) as String?
            val productNameKK = excelReader.readCellValue(2, i)
            val productNameRU = excelReader.readCellValue(3, i)
            StaticLog.info("开始处理：{}", productNameZH)
            val plInfo = searchProductInfo(productNameZH!!)
            StaticLog.info("plInfo：{}", JSONUtil.toJsonStr(plInfo))

        }
    }

    fun searchProductInfo(productName: String): PlInfo {
        try {
            val url = "https://api.openai.com/v1/responses"
            val postResp = openaiRestHandler.doPost(
                url, """
                {
                    "model": "gpt-5-mini",
                    "tools": [
                        {
                            "type": "web_search_preview",
                            "search_context_size": "medium"
                        }
                    ],
                    "input": [
                        {
                            "role": "system",
                            "content": "你是一个精准的信息提取助手，请从网络上搜索指定商品的公开资料，并返回标准 JSON 格式的数据，不要输出解释或评论。"
                        },
                        {
                            "role": "user",
                            "content": "请从分析或从网站上搜索并整理名称为 $productName 的食品配料信息，并以标准 JSON 格式返回结果：\n\n```{\"pl\"：\"配料的中文信息\",\"plKK\":\"哈萨克语的配套信息\",\"plRU\":\"俄语的配料信息\"}\n\n若某字段无信息，请用 \"无\" 替代。"
                        }
                    ]
                }
        """.trimIndent()
            )
//        StaticLog.info(postResp)
            val jsonObject = JSONObject(postResp)
            val error = jsonObject.getStr("error")
            Assert.isNull(error, "chatgpt消息异常，异常信息：{}", error)
            val jsonArray = jsonObject.getJSONArray("output")
            val jsonObject1 = jsonArray.getJSONObject(1)
            val message = jsonObject1.getJSONArray("content").getJSONObject(0)
            val content = message.getStr("text")
//        StaticLog.info(content)
//        StaticLog.info(getJsonStr(content))
            val jsonContent = getJsonStr(content)
            val jsonObj = JSONObject(jsonContent)
            return JSONUtil.toBean(jsonContent, PlInfo::class.java).apply {
                this.pl = jsonObj.getStr("pl", "无")
                this.plKK = jsonObj.getStr("plKK", "无")
                this.plRU = jsonObj.getStr("plRU", "无")
            }
        } catch (e: Exception) {
            StaticLog.error("查询商品信息异常，异常信息：{}", e.message)
            ThreadUtil.safeSleep(2000)
            return PlInfo().apply {
                this.pl = "无"
                this.plKK = "-"
                this.plRU = "-"
            }
        }
    }


    fun getJsonStr(content: String): String {
//        StaticLog.info("GptClient.getJsonStr(),content:{}", content)
        if (JSONUtil.isTypeJSON(content)) {
//            StaticLog.info("content是否为json:{}", true)
            return content
        }
//        StaticLog.info("content是否为json:{}", false)
        // 定义正则表达式匹配 JSON 数据
        val regex = Regex("\\{.*?\\}")
        // 查找匹配的字符串
        val matchResult = regex.find(content.replace("\n", ""))
        return matchResult!!.value
    }


}

class PlInfo {

    var pl: String? = null

    var plKK: String? = null

    var plRU: String? = null


}