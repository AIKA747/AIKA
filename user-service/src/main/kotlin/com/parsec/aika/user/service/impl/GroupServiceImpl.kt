package com.parsec.aika.user.service.impl

import cn.hutool.core.lang.Assert
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.utils.PageUtil
import com.parsec.aika.user.mapper.AppGroupMapper
import com.parsec.aika.user.mapper.FirebaseUserTokenMapper
import com.parsec.aika.user.mapper.UserGroupRelMapper
import com.parsec.aika.user.model.entity.AppGroupInfo
import com.parsec.aika.user.model.entity.UserGroupRel
import com.parsec.aika.user.model.vo.req.GetManageGroupReq
import com.parsec.aika.user.model.vo.req.PostManageGroupReq
import com.parsec.aika.user.model.vo.req.PostManageUserGroupReq
import com.parsec.aika.user.model.vo.req.PutManageGroupReq
import com.parsec.aika.user.model.vo.resp.GetManageGroupResp
import com.parsec.aika.user.model.vo.resp.PostManageGroupUserReq
import com.parsec.aika.user.service.GroupService
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class GroupServiceImpl : GroupService {

    @Resource
    private lateinit var appGroupMapper: AppGroupMapper

    @Resource
    private lateinit var userGroupRelMapper: UserGroupRelMapper

    @Resource
    private lateinit var firebaseUserTokenMapper: FirebaseUserTokenMapper

    override fun postManageGroup(req: PostManageGroupReq) {
        Assert.isFalse(appGroupMapper.checkGroupName(req.groupName!!, null), "组名已存在")
        val group = AppGroupInfo()
        group.groupName = req.groupName
        group.deleted = false
        group.userCount = 0
        appGroupMapper.insert(group)
    }

    override fun putManageGroup(req: PutManageGroupReq) {
        Assert.isFalse(appGroupMapper.checkGroupName(req.groupName!!, req.groupId), "组名已存在")
        val group = checkGroup(req.groupId!!)
        group.groupName = req.groupName
        appGroupMapper.updateById(group)
    }

    override fun getManageGroup(req: GetManageGroupReq): PageResult<GetManageGroupResp> {
        val page = Page<GetManageGroupResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<GetManageGroupResp>().page(appGroupMapper.getManageGroup(page, req))
    }

    /**
     * 加入组
     */
    override fun postManageGroupUser(req: PostManageGroupUserReq) {
        checkGroup(req.groupId!!)
        // 去除已经入组的
        val newUser = req.userIds!!.subtract(
            userGroupRelMapper.selectList(
                KtQueryWrapper(UserGroupRel::class.java).`in`(UserGroupRel::userId, req.userIds)
                    .eq(UserGroupRel::groupId, req.groupId)
            ).map { it.userId }.toSet()
        )
        // 新增user group关系
        newUser.forEach {
            userGroupRelMapper.insert(UserGroupRel().apply {
                this.userId = it
                this.groupId = req.groupId
            })
        }
        updateGroupNum(req.groupId!!)
    }

    override fun deleteManageGroupId(id: Long) {
        val group = checkGroup(id)
        val count = userGroupRelMapper.selectCount(
            KtQueryWrapper(UserGroupRel::class.java).eq(UserGroupRel::groupId, id)
        ) ?: 0
        Assert.state(count < 1, "request to remove users under this group first before deleting the group")
        appGroupMapper.deleteById(group)
    }

    override fun postManageUserGroup(req: PostManageUserGroupReq) {

        // 去除已经加入的组
        val newGroups = req.groupIds!!.subtract(
            userGroupRelMapper.selectList(
                KtQueryWrapper(UserGroupRel::class.java).`in`(UserGroupRel::groupId, req.groupIds)
                    .eq(UserGroupRel::userId, req.userId)
            ).map { it.groupId }.toSet()
        )

        newGroups.forEach {
            userGroupRelMapper.insert(UserGroupRel().apply {
                this.userId = req.userId
                this.groupId = it
            })
            updateGroupNum(it!!)
        }
    }

    override fun deleteGroupUser(req: PostManageGroupUserReq) {
        userGroupRelMapper.delete(
            KtQueryWrapper(UserGroupRel::class.java).eq(UserGroupRel::groupId, req.groupId)
                .`in`(UserGroupRel::userId, req.userIds)
        )
    }

    private fun checkGroup(id: Long): AppGroupInfo {
        val group = appGroupMapper.selectById(id)
        Assert.notNull(group, "the user group does not exist")
        return group
    }

    /**
     * 更新用户组人数
     */
    private fun updateGroupNum(groupId: Long) {
        val group = checkGroup(groupId)
        appGroupMapper.updateById(group.apply {
            this.userCount = userGroupRelMapper.selectCount(
                KtQueryWrapper(UserGroupRel::class.java).eq(
                    UserGroupRel::groupId, groupId
                )
            ).toLong()
        })
    }
}