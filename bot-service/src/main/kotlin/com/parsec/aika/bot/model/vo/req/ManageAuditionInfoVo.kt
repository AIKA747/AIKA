package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotNull

/**
 * 数字人配置 —— 试听信息
 */
class ManageAuditionInfoVo {

    /**
     * 说话人物
     */
    @NotNull(message = "任务音色名称不能为空")
    var voiceName: String? = null

    /**
     * 试听文本
     */
    @NotNull(message = "试听文本不能为空")
    var text: String? = null

}