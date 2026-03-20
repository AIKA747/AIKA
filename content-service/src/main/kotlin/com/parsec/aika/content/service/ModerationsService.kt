package com.parsec.aika.content.service

interface ModerationsService {
    /**
     * 检查文本敏感性, 返回是否敏感及敏感标签集合
     *  harassment：Content that expresses, incites, or promotes harassing language towards any target.
     *  harassment/threatening：Harassment content that also includes violence or serious harm towards any target.
     *  hate：Content that expresses, incites, or promotes hate based on race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste. Hateful content aimed at non-protected groups (e.g., chess players) is harassment.
     *  hate/threatening：Hateful content that also includes violence or serious harm towards the targeted group based on race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste.
     *  illicit：Content that includes instructions or advice that facilitate the planning or execution of wrongdoing, or that gives advice or instruction on how to commit illicit acts. For example, "how to shoplift" would fit this category.
     *  illicit/violent：Content that includes instructions or advice that facilitate the planning or execution of wrongdoing that also includes violence, or that gives advice or instruction on the procurement of any weapon.
     *  self-harm：Content that promotes, encourages, or depicts acts of self-harm, such as suicide, cutting, and eating disorders.
     *  self-harm/instructions：Content that encourages performing acts of self-harm, such as suicide, cutting, and eating disorders, or that gives instructions or advice on how to commit such acts.
     *  self-harm/intent：Content where the speaker expresses that they are engaging or intend to engage in acts of self-harm, such as suicide, cutting, and eating disorders.
     *  sexual：Content meant to arouse sexual excitement, such as the description of sexual activity, or that promotes sexual services (excluding sex education and wellness).
     *  sexual/minors：Sexual content that includes an individual who is under 18 years old.
     *  violence：Content that depicts death, violence, or physical injury.
     *  violence/graphic：Content that depicts death, violence, or physical injury in graphic detail.
     * @param text
     * @return Pair<是否敏感，敏感标签集合>
     */
    fun moderations(text: String): Pair<Boolean?, List<String>?>?
}