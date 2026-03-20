package com.parsec.aika.user.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.em.InterestItemType
import com.parsec.aika.user.model.entity.AppUserInfo
import com.parsec.aika.user.model.entity.InterestItem
import com.parsec.aika.user.model.vo.req.InterestItemCreateVo
import com.parsec.aika.user.model.vo.req.InterestItemQueryVo
import com.parsec.aika.user.model.vo.req.InterestItemUpdateVo
import com.parsec.trantor.common.response.PageResult

interface InterestItemService {
    /**
     * 分页查询兴趣列表
     */
    fun pageList(req: InterestItemQueryVo): PageResult<InterestItem>

    /**
     * 新增兴趣
     */
    fun create(vo: InterestItemCreateVo, user: LoginUserInfo): Int

    /**
     * 修改兴趣
     */
    fun update(vo: InterestItemUpdateVo, user: LoginUserInfo): InterestItem

    /**
     * 删除兴趣
     */
    fun delete(id: Int, user: LoginUserInfo)

    /**
     * 校验兴趣向量长度，如果出错，直接抛出异常
     */
    fun validateVector(user: AppUserInfo)

    /**
     * App端根据类型查询兴趣
     */
    fun listByType(itemType: InterestItemType?): List<InterestItem>


}
