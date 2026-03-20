package com.parsec.aika.bot.service

import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.opencsv.bean.*
import com.parsec.aika.bot.gpt.OpenaiRestHandler
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.retry.annotation.Retryable
import java.io.*
import java.nio.charset.Charset
import javax.annotation.Resource


@SpringBootTest
class OpenAiResponseTest {

    @Resource
    private lateinit var openaiRestHandler: OpenaiRestHandler

    @Test
    fun test() {
        val url = "https://api.openai.com/v1/responses"
        val postResp = openaiRestHandler.doPost(
            url, """
            {
        "model": "gpt-4.1",
        "tools": [{
            "type": "web_search_preview",
            "search_context_size": "low"
        }],
        "input": "What movie won best picture in 2025?"
    }
        """.trimIndent()
        )
        val jsonObject = JSONObject(postResp)
        val error = jsonObject.getStr("error")
        Assert.isNull(error, "chatgpt消息异常，异常信息：{}", error)
        val jsonArray = jsonObject.getJSONArray("choices")
        val jsonObject1 = jsonArray.getJSONObject(0)
        val message = jsonObject1.getJSONObject("message")
        val content = message.getStr("content")
        StaticLog.info(content)
    }

    @Test
    fun testFile() {
        //{
        //  "object": "file",
        //  "id": "file-4voTkUbEeApCdXESq9J9rE",
        //  "purpose": "user_data",
        //  "filename": "2025test.csv",
        //  "bytes": 66855,
        //  "created_at": 1746519809,
        //  "expires_at": null,
        //  "status": "processed",
        //  "status_details": null
        //}
        val file = openaiRestHandler.uploadFile("user_data", File("E:\\Users\\Administrator\\Desktop\\2025test.csv"))
        StaticLog.info(file)
    }

    @Test
    fun fileRead() {
        val url = "https://api.openai.com/v1/chat/completions"
        val doPost = openaiRestHandler.doPost(
            url, """
                {
                  "model": "gpt-4-1106-preview",
                  "tools": [
                    {
                      "type": "function",
                      "function": {
                        "name": "get_object_info",
                        "description": "返回响应的结构化信息",
                        "parameters": {
                          "type": "object",
                          "properties": {
                            "rl": { "type": "string", "description": "热量，单位 kcal" },
                            "dbz": { "type": "string", "description": "蛋白质，单位 g" },
                            "zf": { "type": "string", "description": "脂肪，单位 g" },
                            "tshhw": { "type": "string", "description": "碳水化合物，单位 g" },
                            "jz": { "type": "string", "description": "净重，单位 ml 或 g" },
                            "mz": { "type": "string", "description": "毛重，单位 ml 或 g" },
                            "gmyxx": { "type": "string", "description": "过敏原信息" },
                            "cutj": { "type": "string", "description": "储存条件" },
                            "eaeuFlag": { "type": "string", "description": "是否有EAEU标志" },
                            "syff": { "type": "string", "description": "食用方法" },
                            "pl": { "type": "string", "description": "配料" },
                            "zzsdz": { "type": "string", "description": "制造商名称和地址" }
                          },
                          "required": ["rl", "dbz", "zf", "tshhw", "jz", "mz", "gmyxx", "cutj", "eaeuFlag", "syff", "pl", "zzsdz"]
                        }
                      }
                    }
                  ],
                  "tool_choice": {
                    "type": "function",
                    "function": { "name": "get_object_info" }
                  },
                  "messages": [
                    {
                      "role": "user",
                      "content": "请根据你的知识或推理，提供[宝奴咪无糖薄荷爽口珠（海盐西瓜味）30g]的结构化营养信息。"
                    }
                  ]
                }

            """.trimIndent()
        )
        StaticLog.info(doPost)
        /* 后续优化结构化响应处理
        {
  "id": "chatcmpl-BVCHndIHyURSrrsrg49Df38Kjkku1",
  "object": "chat.completion",
  "created": 1746775095,
  "model": "gpt-4-1106-preview",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_gzcYSTLcl1bbQzdDuBJmM2U9",
            "type": "function",
            "function": {
              "name": "get_product_info",
              "arguments": "{\n  \"rl\": \"120\",\n  \"dbz\": \"0\",\n  \"zf\": \"0\",\n  \"tshhw\": \"30\",\n  \"jz\": \"30g\",\n  \"mz\": \"35g\",\n  \"gmyxx\": \"\\n\",\n  \"cutj\": \"\\n\",\n  \"eaeuFlag\": \"\",\n  \"syff\": \"\\n\",\n  \"pl\": \"\\n\",\n  \"zzsdz\": \"\\n\"\n}"
            }
          }
        ],
        "refusal": null,
        "annotations": []
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 289,
    "completion_tokens": 101,
    "total_tokens": 390,
    "prompt_tokens_details": {
      "cached_tokens": 0,
      "audio_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  },
  "service_tier": "default",
  "system_fingerprint": null
}
        */
    }

    @Test
    fun testCVS() {
        val filePath = "E:\\Users\\Administrator\\Desktop\\2024test.csv"
        val inputStream = FileInputStream(filePath)
        val reader = BufferedReader(InputStreamReader(inputStream, Charset.forName("UTF-8"))).apply {
            mark(1)
            if (read() != 0xFEFF) reset() // 如果不是 BOM 就重置
        }
        val updatedProducts = CsvToBeanBuilder<CvsProduct>(reader).withType(CvsProduct::class.java).build().parse()
        val filePath1 = "E:\\Users\\Administrator\\Desktop\\2025test.csv"
        val fileWriter = FileWriter(filePath1, true)

        val mappingStrategy = ColumnPositionMappingStrategy<CvsProduct>().apply {
            type = CvsProduct::class.java
            // 手动映射字段与位置
            val columnMapping = arrayOf(
                "code",   // 0 -> 条形码
                "name",   // 1 -> 品名
                "info",   // 2 -> 热量、蛋白质等
                "jz",     // 3 -> 净重
                "mz",     // 4 -> 毛重
                "gmyxx",  // 5 -> 过敏原
                "cutj",   // 6 -> 储存条件
                "eaeuFlag", // 7 -> EAC标识
                "syff",   // 8 -> 食用方法
                "pl",     // 9 -> 配料
                "zzsdz"   // 10 -> 制造商地址
            )
            setColumnMapping(*columnMapping)
        }
        val beanToCsv = StatefulBeanToCsvBuilder<CvsProduct>(fileWriter).withMappingStrategy(mappingStrategy).build()

        val cvsProducts = updatedProducts.filter {
            StrUtil.isNotBlank(it.name)
        }
        cvsProducts.subList(496, 497).forEach {
            StaticLog.info("正在查询：{}", it.name)
            val cvsProduct = searchProductInfo(it.name).apply {
                this.code = it.code
                this.name = it.name
            }
            // 写入所有数据
            beanToCsv.write(cvsProduct)
            StaticLog.info("完成写入：{}", JSONUtil.toJsonStr(cvsProduct))
        }
        fileWriter.close()
        reader.close()
    }

    fun searchProductInfo(productName: String): CvsProduct {
        try {
            val url = "https://api.openai.com/v1/responses"
            val postResp = openaiRestHandler.doPost(
                url, """
                {
                    "model": "gpt-4.1-mini",
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
                            "content": "请从 MyFitnessPal/Label Insight/Open Food Facts/百度 等网站上搜索并整理名称为 $productName 的商品信息，并以标准 JSON 格式返回。字段如下：\n\n- \"rl\"：热量（卡路里）\n- \"dbz\":蛋白质 \n- \"zf\":脂肪 \n- \"tshhw\"：碳水化合物 \n- \"jz\"：净重（单位：g 或 ml）\n- \"mz\"：毛重（单位：g 或 ml）\n- \"gmyxx\"：过敏原信息（如“可能含有坚果”等）\n- \"cutj\"：储存条件（如“阴凉干燥处”）\n- \"eaeuFlag\"：是否带有EAEU市场统一标识（EAC标志）\n- \"syff\"：食用方法（如“开瓶即饮”或加热/稀释方式，若无必要可返回 \"无\"）\n- \"pl\"：配料（成分表）\n- \"zzsdz\"：制造商名称和地址\n\n请以如下格式返回结果：\n\n```json\n{\"rl\": \"xx kcal\",\"dbz\": \"x g\",\"zf\": \"x g\",\"tshhw\": \"x g\",\"jz\": \"500ml\",\n  \"mz\": \"xxg\",\n  \"gmyxx\": \"可能含有坚果\",\n  \"cutj\": \"阴凉干燥处保存\",\n  \"eaeuFlag\": \"有\",\n  \"syff\": \"食用方法（如有必要）\",\n  \"pl\": \"配料\",\n  \"zzsdz\": \"制造商/地址\"\n}\n\n若某字段无信息，请用 \"无\" 替代。"
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
            return JSONUtil.toBean(jsonContent, CvsProduct::class.java).apply {
                val rl = jsonObj.getStr("rl", "无")
                val dbz = jsonObj.getStr("dbz", "无")
                val zf = jsonObj.getStr("zf", "无")
                val tshhw = jsonObj.getStr("tshhw", "无")
                this.info = "$rl/$dbz/$zf/$tshhw"
            }
        } catch (e: Exception) {
            StaticLog.error("查询商品信息异常，异常信息：{}", e.message)
            ThreadUtil.safeSleep(2000)
            return CvsProduct().apply {
                this.name = productName
                this.info = "-"
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

class CvsProduct(
    @CsvBindByName(column = "条形码") var code: String = "-",
    @CsvBindByName(column = "品名") var name: String = "-",
    @CsvBindByName(column = "热量（卡路里）、蛋白质、脂肪、碳水化合物") var info: String = "-",
    @CsvBindByName(column = "净重") var jz: String = "-",
    @CsvBindByName(column = "毛重") var mz: String = "-",
    @CsvBindByName(column = "过敏原信息（例如：可能含有坚果等）") var gmyxx: String = "-",
    @CsvBindByName(column = "储存条件") var cutj: String = "-",
    @CsvBindByName(column = "EAEU市场统一标识（EAC标志）——如有的话") var eaeuFlag: String = "-",
    @CsvBindByName(column = "食用方法（如有必要）") var syff: String = "-",
    @CsvBindByName(column = "配料") var pl: String = "-",
    @CsvBindByName(column = "制造商/地址") var zzsdz: String = "-"
)