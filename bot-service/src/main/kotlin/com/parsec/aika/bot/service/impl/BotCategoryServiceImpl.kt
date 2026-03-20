package com.parsec.aika.bot.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.core.collection.CollUtil
import cn.hutool.core.lang.Assert
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.ManageCategoryCreateVo
import com.parsec.aika.bot.model.vo.req.ManageCategoryUpdateVo
import com.parsec.aika.bot.model.vo.resp.ManageBotCategoryDetailVo
import com.parsec.aika.bot.model.vo.resp.ManageBotCategoryListVo
import com.parsec.aika.bot.model.vo.resp.ManageCategoryListVo
import com.parsec.aika.bot.service.BotCategoryService
import com.parsec.aika.bot.service.BotService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.CategoryMapper
import com.parsec.aika.common.model.entity.Bot
import com.parsec.aika.common.model.entity.Category
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.stream.Collectors
import javax.annotation.Resource

@Service
class BotCategoryServiceImpl : BotCategoryService {

    @Resource
    private lateinit var categoryMapper: CategoryMapper

    @Resource
    private lateinit var botMapper: BotMapper

    @Resource
    private lateinit var botService: BotService

    override fun manageBotCategorys(pageVo: PageVo, loginUser: LoginUserInfo): PageResult<ManageBotCategoryListVo> {
        PageHelper.startPage<ManageBotCategoryListVo>(pageVo.pageNo!!, pageVo.pageSize!!)
        return PageUtil<ManageBotCategoryListVo>().page(categoryMapper.botCategoryList())
    }

    override fun manageCategorys(pageVo: PageVo, loginUser: LoginUserInfo): PageResult<ManageCategoryListVo> {
        PageHelper.startPage<Category>(pageVo.pageNo!!, pageVo.pageSize!!)
        val selectList = categoryMapper.selectList(KtQueryWrapper(Category::class.java).orderByAsc(Category::sortNo))
        val pageResult = PageUtil<Category>().page(selectList)
        val listVos = pageResult.list.map {
            BeanUtil.copyProperties(it, ManageCategoryListVo::class.java).apply {
                this.categoryId = it.id
            }
        }
        return PageResult<ManageCategoryListVo>().apply {
            this.list = listVos
            this.total = pageResult.total
            this.pageSize = pageResult.pageSize
            this.pageNum = pageResult.pageNum
            this.pages = pageResult.pages
        }
    }

    override fun manageBotCategoryDetail(id: Long, loginUser: LoginUserInfo): ManageBotCategoryDetailVo {
        val detailVo = categoryMapper.selectById(id)
        Assert.notNull(detailVo, "该机器人栏目信息不存在")
        // 查询分类对应的机器人id集合
        val bots = botMapper.selectList(KtQueryWrapper(Bot::class.java).eq(Bot::categoryId, id))
        return ManageBotCategoryDetailVo().apply {
            this.categoryId = detailVo.id
            this.categoryName = detailVo.categoryName
            this.cover = detailVo.cover
            this.introduction = detailVo.introduction
            this.sortNo = detailVo.sortNo
            this.botIds = bots.stream().map(Bot::id).map { it.toString() }.collect(Collectors.toList())
            this.tags = detailVo.tags
        }
    }

    override fun manageBotCategoryDelete(id: Long, loginUser: LoginUserInfo) {
        val detailVo = categoryMapper.selectById(id)
        Assert.notNull(detailVo, "该机器人栏目信息不存在")
        // 内置分类信息不能删除
        Assert.isFalse(detailVo.builtIn != null && detailVo.builtIn!!, "该栏目信息为内置分类不能删除")
        categoryMapper.deleteById(id)
    }

    override fun manageCategoryCreate(reqVo: ManageCategoryCreateVo, user: LoginUserInfo) {
        Assert.notNull(reqVo.categoryName, "栏目名称不能为空")
        // 判断栏目名称是否已存在
        val checkNameVo = categoryMapper.selectOne(
            KtQueryWrapper(Category::class.java).eq(Category::categoryName, reqVo.categoryName).last("limit 1")
        )
        Assert.isNull(checkNameVo, "该栏目名称已存在")
        if (reqVo.tags.isNullOrEmpty()) {
            reqVo.tags = mutableListOf()
        } else {
            reqVo.tags = reqVo.tags!!.stream().filter { it.isNotBlank() }.distinct().collect(Collectors.toList())
        }
        val categoryVo = Category().apply {
            this.categoryName = reqVo.categoryName
            this.cover = reqVo.cover
            this.introduction = reqVo.introduction
            this.sortNo = if (reqVo.sortNo == null) 0 else reqVo.sortNo
            this.tags = reqVo.tags
            this.creator = user.userId
            this.creatorName = user.username
            this.createdAt = LocalDateTime.now()
        }
        var botCount = 0
        if (reqVo.botIds != null && reqVo.botIds!!.isNotEmpty()) botCount = botMapper.checkBots(reqVo.botIds!!)
        categoryVo.botCount = botCount
        categoryMapper.insert(categoryVo)
        if (botCount > 0) {
            //查询有变动的栏目id
            val categoryIds = botMapper.selectList(
                KtQueryWrapper(Bot::class.java).`in`(Bot::id, reqVo.botIds).ne(Bot::categoryId, categoryVo.id)
                    .isNotNull(Bot::categoryId)
            ).map { it.categoryId }.toSet()
            // 修改传入的机器人id集合对应的categoryId为当前创建的栏目id
            botMapper.updateBotCategoryId(reqVo.botIds!!, categoryVo.id, categoryVo.categoryName)
            //更新有变动的栏目机器人数量
            categoryIds.forEach { botService.countBotUpdateCate(it, user) }
        }
    }

    @Transactional
    override fun manageCategoryUpdate(reqVo: ManageCategoryUpdateVo, user: LoginUserInfo) {
        Assert.notNull(reqVo.categoryId, "栏目id不能为空")
        Assert.notNull(reqVo.categoryName, "栏目名称不能为空")
        // 根据传入的categoryId查询category对象
        val detailVo = categoryMapper.selectById(reqVo.categoryId)
        Assert.notNull(detailVo, "该机器人栏目信息不存在")
        // 验证栏目名称：查询除该id外是否存在传入的栏目名称
        val checkNameVo = categoryMapper.selectOne(
            KtQueryWrapper(Category::class.java).eq(Category::categoryName, reqVo.categoryName).last("limit 1")
        )
        Assert.isTrue(checkNameVo == null || checkNameVo.id == reqVo.categoryId, "该栏目名称已存在")

        detailVo.categoryName = reqVo.categoryName
        detailVo.cover = reqVo.cover
        detailVo.introduction = reqVo.introduction
        detailVo.sortNo = reqVo.sortNo ?: detailVo.sortNo
        detailVo.updater = user.userId
        detailVo.updatedAt = LocalDateTime.now()
        if (reqVo.tags.isNullOrEmpty()) {
            detailVo.tags = mutableListOf()
        } else {
            detailVo.tags = reqVo.tags!!.stream().filter { it.isNotBlank() }.distinct().collect(Collectors.toList())
        }

        // 如果传入的机器人id集合，没有包含完之前关联的机器人id，则报错提示
        // 根据传入的机器人id集合以及传入的categoryId，查询到的机器人信息应该相同
        val botsByCategoryId =
            botMapper.selectList(KtQueryWrapper(Bot::class.java).eq(Bot::categoryId, reqVo.categoryId))
        val botsByCategoryIdAndBotIds = if (reqVo.botIds != null && reqVo.botIds!!.isNotEmpty()) {
            botMapper.selectBotByCategoryIdAndBotIds(reqVo.botIds!!, reqVo.categoryId!!)
        } else null
        if (botsByCategoryId.isNotEmpty()) {
            Assert.isFalse(botsByCategoryIdAndBotIds.isNullOrEmpty(), "The selected robot is incorrect.")
            // 传入的机器人id集合以及栏目id查询到的机器人数据 与 通过该栏目id查询到的机器人大小不同
            Assert.isFalse(
                botsByCategoryIdAndBotIds!!.size != botsByCategoryId.size,
                "The selected robots do not fully include the original data."
            )
        }
//        var botCount = 0
//        if (reqVo.botIds != null && reqVo.botIds!!.isNotEmpty()) botCount = botMapper.checkBots(reqVo.botIds!!)
//        categoryVo.botCount = botCount
        categoryMapper.updateById(detailVo)
        // 保存传入的botIds对应的categoryId值
        if (CollUtil.isNotEmpty(reqVo.botIds)) {
            //查询有变动的栏目id
            val categoryIds = botMapper.selectList(
                KtQueryWrapper(Bot::class.java).`in`(Bot::id, reqVo.botIds).isNotNull(Bot::categoryId)
            ).map { it.categoryId }.toSet()
            // 修改传入的机器人id集合对应的categoryId为当前栏目id
            botMapper.updateBotCategoryId(reqVo.botIds!!, detailVo.id, detailVo.categoryName)
            //id集合中加入当前栏目id
            categoryIds.plus(detailVo.id)
            //更新有变动的栏目机器人数量
            categoryIds.forEach { botService.countBotUpdateCate(it, user) }
        }
    }
}
