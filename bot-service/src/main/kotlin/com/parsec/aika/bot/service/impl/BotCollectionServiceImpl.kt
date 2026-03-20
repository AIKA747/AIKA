package com.parsec.aika.bot.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.CreateBotCollectionItemRequest
import com.parsec.aika.bot.model.vo.req.CreateBotCollectionRequest
import com.parsec.aika.bot.model.vo.req.GetBotCollectionItemReq
import com.parsec.aika.bot.model.vo.resp.*
import com.parsec.aika.bot.service.BotCollectionService
import com.parsec.aika.common.mapper.BotCollectionItemMapper
import com.parsec.aika.common.mapper.BotCollectionMapper
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.CategoryMapper
import com.parsec.aika.common.model.em.CollectionType
import com.parsec.aika.common.model.entity.BotCollection
import com.parsec.aika.common.model.entity.BotCollectionItem
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.util.PageResultConvert.convert
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import com.parsec.trantor.redis.util.RedisUtil
import org.springframework.stereotype.Service
import org.springframework.util.Assert
import org.springframework.validation.annotation.Validated
import javax.annotation.Resource

@Service
class BotCollectionServiceImpl : BotCollectionService {
    @Resource
    private lateinit var botCollectionMapper: BotCollectionMapper

    @Resource
    private lateinit var botCollectionItemMapper: BotCollectionItemMapper

    @Resource
    private lateinit var botMapper: BotMapper

    @Resource
    private lateinit var categoryMapper: CategoryMapper

    override fun pageQuery(pageNum: Int, pageSize: Int): PageResult<BotCollectionResp> {
        PageHelper.startPage<BotCollectionResp>(pageNum, pageSize)
        val page = PageUtil<BotCollection>().page(
            botCollectionMapper.selectList(KtQueryWrapper(BotCollection::class.java).orderByDesc(BotCollection::id))
        )
        return page.convert { botCollection ->
            BotCollectionResp().apply {
                BeanUtil.copyProperties(botCollection, this)
                this.botCount = botCollectionItemMapper.selectCount(
                    KtQueryWrapper(BotCollectionItem::class.java).eq(BotCollectionItem::collectionId, botCollection.id)
                )
            }
        }
    }

    override fun pageBotCollection(req: PageVo): PageResult<GetAppBotCollectionResp> {
        PageHelper.startPage<GetAppMyBotsResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetAppBotCollectionResp>().page(botCollectionMapper.listBotCollection())
    }


    override fun create(request: CreateBotCollectionRequest, loginUser: LoginUserInfo): BotCollectionResp {
        checkCategory(request.category!!)
        val collection = BotCollection().apply {
            type = request.type
            avatar = request.avatar
            collectionName = request.collectionName
            category = request.category
            creator = loginUser.userId
            updater = loginUser.userId
        }
        botCollectionMapper.insert(collection)
        return BotCollectionResp().apply { BeanUtil.copyProperties(collection, this) }
    }

    override fun pageBotCollectionItem(@Validated req: GetBotCollectionItemReq): PageResult<GetAppBotCollectionItemResp> {
        Assert.notNull(req.collectionId, "collectionId cannot be null")

        PageHelper.startPage<GetAppMyBotsResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetAppBotCollectionItemResp>().page(botCollectionMapper.listBotCollectionItem(req.collectionId!!))
    }

    override fun update(request: CreateBotCollectionRequest, loginUser: LoginUserInfo): Int {
        Assert.notNull(request.id, "collection id can not be null")
        val collectionDb = botCollectionMapper.selectById(request.id)
        Assert.notNull(collectionDb, "collection not found")
        checkCategory(request.category!!)
        val collection = collectionDb.apply {
            type = request.type
            avatar = request.avatar
            collectionName = request.collectionName
            category = request.category
            updater = loginUser.userId
        }
        return botCollectionMapper.updateById(collection)
    }

    override fun delete(id: Long): Int {
        val result = botCollectionMapper.deleteById(id)
        botCollectionItemMapper.delete(
            KtQueryWrapper(BotCollectionItem::class.java).eq(
                BotCollectionItem::collectionId, id
            )
        )
        return result
    }

    override fun botCollectionItemPageQuery(
        pageNum: Int, pageSize: Int, collectionId: Long?
    ): PageResult<BotCollectionItemResp> {
        PageHelper.startPage<BotCollectionItem>(pageNum, pageSize)
        val page = PageUtil<BotCollectionItem>().page(
            botCollectionItemMapper.selectList(
                KtQueryWrapper(BotCollectionItem::class.java).eq(
                    collectionId != null, BotCollectionItem::collectionId, collectionId
                ).orderByDesc(BotCollectionItem::id)
            )
        )
        return page.convert { botCollectionItem ->
            BotCollectionItemResp().apply {
                BeanUtil.copyProperties(
                    botCollectionItem, this
                )
            }
        }
    }

    override fun createBotCollectionItem(
        request: CreateBotCollectionItemRequest, loginUser: LoginUserInfo
    ): BotCollectionItemResp {
        if (request.type == CollectionType.EXPERT) {
            val bot = botMapper.selectById(request.botId)
            Assert.notNull(bot, "bot not found")
        }
        val botCollection = botCollectionMapper.selectById(request.collectionId)
        Assert.notNull(botCollection, "botCollection not found")
        val item = BotCollectionItem().apply {
            this.collectionId = request.collectionId
            botId = request.botId
            type = request.type
            name = request.name
            avatar = request.avatar
            description = request.description
            listCover = request.listCover
            creator = loginUser.userId
            listCoverDark = request.listCoverDark
        }
        botCollectionItemMapper.insert(item)
        return BotCollectionItemResp().apply { BeanUtil.copyProperties(item, this) }
    }

    override fun deleteBotCollectionItem(id: Long): Int {
        return botCollectionItemMapper.deleteById(id)
    }

    override fun listBotCollection(size: Int): List<GetAppBotCollectionResp>? {
        val redisKey = "botCollection:${size}"
        val cacheData = RedisUtil.get<String?>(redisKey)
        if (StrUtil.isNotBlank(cacheData)) {
            return JSONUtil.parseArray(cacheData).toList(GetAppBotCollectionResp::class.java)
        }
        var resps = botCollectionMapper.listBotCollection()
        resps.forEach {
            if (it.type == CollectionType.GROUP_CHAT) {
                it.id = botCollectionItemMapper.selectOne(
                    KtQueryWrapper(BotCollectionItem::class.java).select(BotCollectionItem::botId)
                        .eq(BotCollectionItem::collectionId, it.id).last("limit 1")
                )?.botId
            }
        }
        //过滤掉已删除的群聊id
        resps = resps.filter {
            it.id != null
        }

        //如果数量不够，则查询群聊列表补足数量
        if (resps.size < size) {
            val list = botCollectionMapper.groupChatList(size - resps.size)
            resps = resps + list
        }
        RedisUtil.set(redisKey, JSONUtil.toJsonStr(resps), 10 * 60)
        return resps
    }

    private fun checkCategory(category: Long) {
        //允新建或编辑时，不绑定分类的情况，不绑定分类默认传0
        if (category > 0) {
            categoryMapper.selectById(category) ?: throw BusinessException("category not found")
        }
    }
}

