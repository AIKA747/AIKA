package com.parsec.aika.user.controller

import cn.hutool.core.bean.BeanUtil
import com.parsec.aika.user.model.props.AppConfigProps
import com.parsec.aika.user.model.vo.resp.AppConfigResp
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RefreshScope
@RestController
class AppConfigController {

    @Autowired
    private lateinit var appConfigProps: AppConfigProps

    @GetMapping("/public/config")
    fun getAppConfig(): BaseResult<AppConfigResp> {
        return BaseResult.success(BeanUtil.copyProperties(appConfigProps, AppConfigResp::class.java))
    }


}