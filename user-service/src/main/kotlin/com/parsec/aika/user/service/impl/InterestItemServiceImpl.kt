package com.parsec.aika.user.service.impl

import cn.hutool.core.lang.Assert
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.utils.PageUtil
import com.parsec.aika.user.mapper.InterestItemMapper
import com.parsec.aika.user.model.em.InterestItemType
import com.parsec.aika.user.model.entity.AppUserInfo
import com.parsec.aika.user.model.entity.InterestItem
import com.parsec.aika.user.model.vo.req.InterestItemCreateVo
import com.parsec.aika.user.model.vo.req.InterestItemQueryVo
import com.parsec.aika.user.model.vo.req.InterestItemUpdateVo
import com.parsec.aika.user.service.InterestItemService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.annotation.Resource

@Service
class InterestItemServiceImpl : InterestItemService {

    @Resource
    private lateinit var interestItemMapper: InterestItemMapper

    override fun pageList(req: InterestItemQueryVo): PageResult<InterestItem> {
        val page = Page<InterestItem>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<InterestItem>().page(interestItemMapper.manageInterestItemList(page, req))
    }

    override fun create(vo: InterestItemCreateVo, user: LoginUserInfo): Int {
        Assert.isTrue(this.queryByItemName(vo.itemName!!) == null, "Interest name already exists")
        if (vo.multiple!! && (vo.valueArray == null || vo.valueArray!!.isEmpty())) {
            Assert.isTrue(false, "valueArray is required for multiple interests")
        }
        val interestItem = InterestItem().apply {
            this.itemName = vo.itemName
            this.itemType = vo.itemType
            this.orderNum = vo.orderNum
            this.remark = vo.remark
            this.multiple = vo.multiple
            this.valueArray = vo.valueArray
            this.creator = user.userId
            this.updater = user.userId
            this.createdAt = LocalDateTime.now()
            this.deleted = false
            this.dataVersion = 0
        }
        interestItemMapper.insert(interestItem)
        updateDefaultOrderNum(interestItem.id!!)
        return interestItem.id!!
    }

    override fun update(vo: InterestItemUpdateVo, user: LoginUserInfo): InterestItem {
        val tag = this.checkItem(vo.id!!)
        val tagByName = this.queryByItemName(vo.itemName!!)
        Assert.isTrue(tagByName == null || Objects.equals(tagByName.id, tag.id), "Interest name already exists")
        if (vo.multiple!! && (vo.valueArray == null || vo.valueArray!!.isEmpty())) {
            Assert.isTrue(false, "valueArray is required for multiple interests")
        }
        tag.itemName = vo.itemName
        tag.itemType = vo.itemType
        tag.orderNum = vo.orderNum
        tag.remark = vo.remark
        tag.multiple = vo.multiple
        tag.valueArray = vo.valueArray
        tag.updater = user.userId
        tag.updatedAt = LocalDateTime.now()
        interestItemMapper.updateById(tag)
        return tag
    }

    override fun delete(id: Int, user: LoginUserInfo) {
        this.checkItem(id)
        interestItemMapper.deleteById(id)
    }

    override fun validateVector(user: AppUserInfo) {
        val list = interestItemMapper.queryItemTypeCount()
        for (item in list) {
            val userInterestItems = when (item.itemType) {
                InterestItemType.SPORT -> user.sport
                InterestItemType.ENTERTAINMENT -> user.entertainment
                InterestItemType.NEWS -> user.news
                InterestItemType.GAMING -> user.gaming
                InterestItemType.ARTISTIC -> user.artistic
                InterestItemType.LIFESTYLE -> user.lifestyle
                InterestItemType.TECHNOLOGY -> user.technology
                InterestItemType.SOCIAL -> user.social
                else -> null
            }
            Assert.notNull(userInterestItems, "Please fill in the corresponding interest")
            //验证用户对象中的向量的key的数量，是否跟item的长度一致


            if (userInterestItems?.keys?.size != item.count) {
                throw BusinessException("The parameter '${item.itemType}' is incorrect")
            }
        }
    }

    override fun listByType(itemType: InterestItemType?): List<InterestItem> {
        val wrapper = KtQueryWrapper(InterestItem::class.java).eq(
            itemType != null && itemType != InterestItemType.OTHER, InterestItem::itemType, itemType
        ).`in`(
            itemType != null && itemType == InterestItemType.OTHER,
            InterestItem::itemType,
            InterestItemType.otherInterests()
        ).orderByAsc(InterestItem::itemType).orderByAsc(InterestItem::orderNum)
        val selectList = interestItemMapper.selectList(wrapper)
        selectList.forEach {
            it.itemNameLab = it.itemName
            it.itemTypeLab = it.itemType?.name
        }
        return selectList
    }

    private fun checkItem(id: Int): InterestItem {
        val tag = interestItemMapper.selectById(id)
        Assert.notNull(tag, "Interest does not exist")
        return tag
    }

    private fun queryByItemName(interestName: String): InterestItem? {
        val items = interestItemMapper.selectList(
            KtQueryWrapper(InterestItem::class.java).eq(InterestItem::itemName, interestName).last("limit 1")
        )
        if (!items.isNullOrEmpty()) {
            return items[0]
        } else {
            return null
        }
    }

    private fun updateDefaultOrderNum(itemId: Int): InterestItem {
        val item = checkItem(itemId)
        if (item.orderNum == null) {
            item.orderNum = itemId
            interestItemMapper.updateById(item)
        }
        return item
    }
}
