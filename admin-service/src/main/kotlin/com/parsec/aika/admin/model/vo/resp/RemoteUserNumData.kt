package com.parsec.aika.admin.model.vo.resp

class RemoteUserNumData {

    var totalUsers: Int? = null   //用户总数
    var newUsers: Int? = null     //新用户数
    var activeUsers: Int? = null  //活跃用户数，当天有操作则为活跃用户
    var inactiveUsers: Int? = null  //不活跃用户数，30天内没有操作的用户

}