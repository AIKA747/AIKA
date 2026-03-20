package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.em.Gender

class StoryRecommendBO {


    var id: String? = null

    /**
     * 故事id
     */
    var storyId: String? = null

    /**
     * 故事名称
     */
    var storyName: String? = null

    /**
     * 故事角色性别
     */
    var gender: Gender? = null

    /**
     * 默认形象
     */
    var defaultImage: String? = null

    /**
     * 简介
     */
    var introduction: String? = null

    /**
     * 封面
     */
    var cover: String? = null

}