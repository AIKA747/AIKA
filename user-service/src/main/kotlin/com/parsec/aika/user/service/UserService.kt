package com.parsec.aika.user.service

import com.parsec.aika.common.model.vo.AppUserVO
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.entity.AppUserInfo
import com.parsec.aika.user.model.vo.req.ManageUserListReq
import com.parsec.aika.user.model.vo.req.ManageUserStatusReq
import com.parsec.aika.user.model.vo.req.UpdatePasswordReq
import com.parsec.aika.user.model.vo.resp.AppUserInfoResp
import com.parsec.aika.user.model.vo.resp.EndPointUserNumData
import com.parsec.aika.user.model.vo.resp.ManagerUserListResp
import com.parsec.aika.user.model.vo.resp.ManagerUserResp
import com.parsec.trantor.common.response.PageResult

interface UserService {

    /**
     * 获取用户的粉丝数量
     */
    fun queryFansCount(userId: Long): Int

    /**
     * 获取用户订阅的机器人数量
     */
    fun querySubscriptBotCount(userId: Long): Int

    /**
     * 获取用户的机器人数量
     */
    fun queryBotsCount(userId: Long): Int

    /**
     * 获取用户的故事数量
     */
    fun queryStoriesCount(userId: Long): Int

    /**
     * 删除用户
     */
    fun deleteById(id: Long)

    /**
     * 改变用户状态
     */
    fun manageUserStatus(req: ManageUserStatusReq)

    /**
     * 用户详情
     */
    fun getManageUser(id: Long): ManagerUserResp

    /**
     * 用户列表
     */
    fun manageUserList(req: ManageUserListReq): PageResult<ManagerUserListResp>

    fun updatePassword(req: UpdatePasswordReq, loginUserInfo: LoginUserInfo)

    /**
     * 查询用户中的城市列表
     * 需去重
     */
    fun endPointUserCountrys(): List<String>

    /**
     * 根据城市、日期，查询用户数
     */
    fun endPointUserNums(date: String, country: String): EndPointUserNumData

    fun getAppUser(id: Long, loginUserInfo: LoginUserInfo): AppUserInfoResp
    fun getAppUserInfo(username: String, loginUserInfo: LoginUserInfo): AppUserInfoResp
    fun queryUserIdsByGroupId(groupId: Long?): List<Long>?
    fun queryUserInfo(userId: Long): AppUserVO?
    fun getInactiveUsers(inactiveDays: Int?): List<AppUserInfo>
    fun pushInactiveUsersNotify(inactiveDays: Int?, title: String?, content: String?, jobId: Long?, operator: String?)

    fun pushToUser(userId: Long): Boolean?

    /**
     * 校验用户昵称是否重复
     */
    fun checkUserNameExist(username: String, userId: Long?): Boolean

    /**
     * 随机生成一个用户名
     */
    fun generateName(prefix: String? = "guest"): String?

    fun syncUserList()


    fun getRecommendUserList(userId: Long): List<AppUserVO>

    fun initTypicalUsers()

    fun sysncUserIntoGorse(userId: Long)

    fun getRecommendUserListV2(userId: Long): List<AppUserVO>?

    fun inactiveUserEmails(date: String): Int

}
