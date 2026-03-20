package com.parsec.aika.content.service

import com.parsec.aika.common.model.bo.GorseFeedbackBO
import com.parsec.aika.common.model.bo.GorseItemBO

interface GorseService {

    fun syncItem(gorseItemBO: GorseItemBO)

    fun syncFeedback(gorseFeedbackBO: GorseFeedbackBO)

}