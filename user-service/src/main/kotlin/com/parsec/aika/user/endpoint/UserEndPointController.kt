package com.parsec.aika.user.endpoint

import com.parsec.aika.user.model.vo.resp.EndPointUserNumData
import com.parsec.aika.user.service.UserService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class UserEndPointController {

    @Resource
    private lateinit var userService: UserService

    /**
     * 查询用户城市列表
     */
    @GetMapping("/feign/user/country")
    fun feignUserCountry(): BaseResult<List<String>> {
        return BaseResult.success(userService.endPointUserCountrys())
    }

    /**
     * 根据用户城市、日期，查询用户统计数据
     * 日期格式为：20230101
     */
    @GetMapping("/feign/user/nums")
    fun feignUserNums(date: String, country: String): BaseResult<EndPointUserNumData> {
        return BaseResult.success(userService.endPointUserNums(date, country))
    }

}