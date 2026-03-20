package com.parsec.aika.user.controller

import com.parsec.aika.user.model.vo.req.GetManageGroupReq
import com.parsec.aika.user.model.vo.req.PostManageGroupReq
import com.parsec.aika.user.model.vo.req.PostManageUserGroupReq
import com.parsec.aika.user.model.vo.req.PutManageGroupReq
import com.parsec.aika.user.model.vo.resp.GetManageGroupResp
import com.parsec.aika.user.model.vo.resp.PostManageGroupUserReq
import com.parsec.aika.user.service.GroupService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageGroupController {

    @Resource
    private lateinit var groupService: GroupService

    /**
     * 新增
     */
    @PostMapping("/manage/group")
    fun postManageGroup(@RequestBody @Validated req: PostManageGroupReq): BaseResult<Any> {
        return BaseResult.success(groupService.postManageGroup(req))
    }

    /**
     * 编辑
     */
    @PutMapping("/manage/group")
    fun putManageGroup(@RequestBody @Validated req: PutManageGroupReq): BaseResult<Any> {
        return BaseResult.success(groupService.putManageGroup(req))
    }

    /**
     * 列表
     */
    @GetMapping("/manage/group")
    fun getManageGroup(req: GetManageGroupReq): BaseResult<PageResult<GetManageGroupResp>> {
        return BaseResult.success(groupService.getManageGroup(req))
    }

    /**
     * 加入
     */
    @PostMapping("/manage/group-user")
    fun postManageGroupUser(@RequestBody @Validated req: PostManageGroupUserReq): BaseResult<Any?> {
        return BaseResult.success(groupService.postManageGroupUser(req))
    }

    /**
     * 删除
     */
    @DeleteMapping("/manage/group/{id}")
    fun deleteManageGroupId(@PathVariable id: Long): BaseResult<Any> {
        return BaseResult.success(groupService.deleteManageGroupId(id))
    }

    @PostMapping("/manage/user-groups")
    fun postManageUserGroup(@RequestBody @Validated req: PostManageUserGroupReq): BaseResult<Any?> {
        return BaseResult.success(groupService.postManageUserGroup(req))
    }


    @DeleteMapping("/manage/group-user")
    fun manageGroupUser(@RequestBody @Validated req: PostManageGroupUserReq): BaseResult<Any?> {
        return BaseResult.success(groupService.deleteGroupUser(req))
    }

}