package com.parsec.aika.bot.controller.manage

import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.BotServiceApplication
import com.parsec.aika.common.mapper.BotCollectionItemMapper
import com.parsec.aika.common.mapper.BotCollectionMapper
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.CategoryMapper
import com.parsec.aika.common.model.em.CollectionType
import com.parsec.aika.common.model.entity.Bot
import com.parsec.aika.common.model.entity.BotCollection
import com.parsec.aika.common.model.entity.BotCollectionItem
import com.parsec.aika.common.model.entity.Category
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@SpringBootTest(classes = [BotServiceApplication::class])
@AutoConfigureMockMvc
class ManageBotCollectionControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Resource
    private lateinit var botCollectionMapper: BotCollectionMapper

    @Resource
    private lateinit var botCollectionItemMapper: BotCollectionItemMapper

    @MockBean
    private lateinit var botMapper: BotMapper

    @MockBean
    private lateinit var categoryMapper: CategoryMapper

    private lateinit var loginUserInfo: LoginUserInfo

    @BeforeEach
    fun setUp() {
        loginUserInfo = LoginUserInfo().apply {
            userId = 1L
            username = "testUser"
        }
    }

    @Test
    @Transactional
    fun `test default pagination parameters`() {
        // Given
        val mockData = createMockCollections(15)

        // When
        mockMvc.perform(get("/manage/sphere"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value(0))
            .andExpect(jsonPath("$.data.pageNum").value(1))
            .andExpect(jsonPath("$.data.pageSize").value(10))
            .andExpect(jsonPath("$.data.total").value(15))
            .andExpect(jsonPath("$.data.list.length()").value(10))

    }

    @Test
    @Transactional
    fun testCreateBotCollection() {
        val mockBot = Category().apply {
            id = 1L
            categoryName = "Mock Category"
        }
        Mockito.`when`(categoryMapper.selectById(any())).thenReturn(mockBot)

        // 新增BotCollection失败，缺少参数
        mockMvc.perform(
            post("/manage/sphere")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
                .contentType("application/json")
                .content(
                    """
                    {
                        "collectionName": "Collection 1",
                        "type": "TALES",
                        "avatar": "avatar_1.jpg"
                    }
                    """.trimIndent()
                ))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value(400))
            .andExpect(jsonPath("$.msg").value("category category is required"))

        // 新增成功
        mockMvc.perform(
            post("/manage/sphere")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
                .contentType("application/json")
                .content(
                    """
                    {
                        "collectionName": "Collection 1",
                        "type": "TALES",
                        "avatar": "avatar_1.jpg",
                        "category": 1
                    }
                    """.trimIndent()
                ))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value(0))
            .andExpect(jsonPath("$.data.id").isNotEmpty)
            .andExpect(jsonPath("$.data.collectionName").isNotEmpty)
            .andDo {
                val jsonResponse = it.response.contentAsString
                val jsonObject = JSONUtil.parseObj(jsonResponse)
                val id = jsonObject.getJSONObject("data").getLong("id")
                val collection = botCollectionMapper.selectById(id)
                assertEquals(loginUserInfo.userId, collection.creator)
            }
    }

    @Test
    @Transactional
    fun testUpdateBotCollection() {
        // 更新BotCollection
        val collection = createMockCollections(1)
        val mockBot = Category().apply {
            id = 1L
            categoryName = "Mock Category"
        }
        Mockito.`when`(categoryMapper.selectById(any())).thenReturn(mockBot)

        // 更新BotCollection失败，缺少type参数
        mockMvc.perform(
            put("/manage/sphere")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
                .contentType("application/json")
                .content(
                    """
                    {
                        "id": ${collection[0].id},
                        "collectionName": "Collection 1",
                        "avatar": "avatar_1.jpg",
                        "category": 1
                    }
                    """.trimIndent()
                ))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value(400))
            .andExpect(jsonPath("$.msg").value("type type is required"))

        // 更新BotCollection失败，缺少id
        mockMvc.perform(
            put("/manage/sphere")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
                .contentType("application/json")
                .content(
                    """
                    {
                        "type": "TALES",
                        "collectionName": "Collection 1",
                        "avatar": "avatar_1.jpg",
                        "category": 1
                    }
                    """.trimIndent()
                ))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value(-1))
            .andExpect(jsonPath("$.msg").value("collection id can not be null"))

        // 更新成功
        mockMvc.perform(
            put("/manage/sphere")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
                .contentType("application/json")
                .content(
                    """
                    {
                        "id": ${collection[0].id},
                        "collectionName": "Collection_update",
                        "type": "TALES",
                        "avatar": "avatar_1.jpg",
                        "category": 1
                    }
                    """.trimIndent()
                ))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value(0))
            .andDo {
                val updateCollection = botCollectionMapper.selectById(collection[0].id)
                assertEquals("Collection_update", updateCollection.collectionName)
            }
    }

    @Test
    @Transactional
    fun testDeleteBotCollection() {
        // 新增BotCollection
        val collection = createMockCollections(5)
        val items = createMockCollectionItems(collection[0].id, 10)

        mockMvc.perform(
            delete("/manage/sphere/${collection[0].id}")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo)))
            .andExpect(status().isOk)
        val deleteCollection = botCollectionMapper.selectById(collection[0].id)
        val deleteCollectionItems = botCollectionItemMapper.selectList(KtQueryWrapper(BotCollectionItem::class.java).eq(BotCollectionItem::collectionId, collection[0].id))
        assertEquals(null, deleteCollection)
        assertTrue(deleteCollectionItems.isEmpty())
    }

    @Test
    @Transactional
    fun testCreateBotCollectionItem() {

        val mockBot = Bot().apply {
            id = 1L
            botName = "Mock Bot"
        }
        Mockito.`when`(botMapper.selectById(1L)).thenReturn(mockBot)

        // 新增BotCollectionItem失败，缺少参数
        mockMvc.perform(
            post("/manage/sphere/bot")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
                .contentType("application/json")
                .content(
                    """
                    {
                        "collectionId": 1,
                        "botId": 1,
                        "type": "TALES",
                        "avatar": "avatar_1.jpg",
                        "description": "description",
                        "listCover": "listCover"
                    }
                    """.trimIndent()
                ))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value(400))
            .andExpect(jsonPath("$.msg").value("name name is required"))

        // 新增BotCollectionItem失败，collectionId不存在
        mockMvc.perform(
            post("/manage/sphere/bot")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
                .contentType("application/json")
                .content(
                    """
                    {
                        "collectionId": 1,
                        "botId": 1,
                        "type": "TALES",
                        "name": "BotCollectionItem 1",
                        "avatar": "avatar_1.jpg",
                        "description": "description",
                        "listCover": "listCover"
                    }
                    """.trimIndent()
                ))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value(-1))
            .andExpect(jsonPath("$.msg").value("botCollection not found"))

        val botCollections = createMockCollections(1)

        // 新增BotCollectionItem成功
        mockMvc.perform(
            post("/manage/sphere/bot")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
                .contentType("application/json")
                .content(
                    """
                    {
                        "collectionId": ${botCollections[0].id},
                        "botId": 1,
                        "type": "TALES",
                        "name": "BotCollectionItem 1",
                        "avatar": "avatar_1.jpg",
                        "description": "description",
                        "listCover": "listCover",
                        "listCoverDark": "listCoverDark"
                    }
                    """.trimIndent()
                ))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value(0))
            .andExpect(jsonPath("$.data.id").isNotEmpty)
            .andExpect(jsonPath("$.data.name").isNotEmpty).andDo {
                val jsonResponse = it.response.contentAsString
                val jsonObject = JSONUtil.parseObj(jsonResponse)
                val id = jsonObject.getJSONObject("data").getLong("id")
                val collectionItem = botCollectionItemMapper.selectById(id)
                assertEquals("listCoverDark", collectionItem.listCoverDark)
            }


    }

    @Test
    @Transactional
    fun testDeleteBotCollectionItem() {
        // 新增BotCollection
        val collection = createMockCollections(1)
        val collectionItems = createMockCollectionItems(collection[0].id, 5)

        mockMvc.perform(
            delete("/manage/sphere/bot/${collectionItems[0].id}")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo)))
            .andExpect(status().isOk)
            .andDo {
                val deleteCollectionItem = botCollectionItemMapper.selectById(collectionItems[0].id)
                assertEquals(null, deleteCollectionItem)
            }
    }

    @Test
    @Transactional
    fun testBotCollectionItemPageQuery() {
        // Given
        val collection = createMockCollections(1)
        val collectionItems = createMockCollectionItems(collection[0].id, 15)

        // When
        mockMvc.perform(get("/manage/sphere/bot"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.code").value(0))
            .andExpect(jsonPath("$.data.pageNum").value(1))
            .andExpect(jsonPath("$.data.pageSize").value(10))
            .andExpect(jsonPath("$.data.total").value(collectionItems.size))
            .andExpect(jsonPath("$.data.list.length()").value(10))

    }

    private fun createMockCollections(count: Int): List<BotCollection> {
        return (1..count).map { i ->
            BotCollection().apply {
                id = i.toLong()
                createdAt = LocalDateTime.now()
                creator = 100L + i
                collectionName = "Collection $i"
                type = CollectionType.TALES
                avatar = "avatar_$i.jpg"
            }.let {
                botCollectionMapper.insert(it)
                it
            }
        }.toList()
    }

    private fun createMockCollectionItems(collectionId: Long, count: Int): List<BotCollectionItem> {
        return (1..count).map { i ->
            BotCollectionItem().apply {
                id = i.toLong()
                createdAt = LocalDateTime.now()
                creator = 100L + i
                name = "Collection item $i"
                type = CollectionType.TALES
                avatar = "avatar_$i.jpg"
                description = "description_$i"
                listCover = "list_cover_i"
                botId = 1
                type = CollectionType.GAME
                this.collectionId = collectionId
            }.let {
                botCollectionItemMapper.insert(it)
                it
            }
        }.toList()
    }

  

}
