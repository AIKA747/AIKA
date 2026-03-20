package com.parsec.aika.user.utils

import cn.hutool.log.StaticLog
import com.parsec.aika.common.utils.IOSToeknUtils

class IOSToeknUtilsTest {

//    @Test
    fun test() {
        try {
            val identityToken =
                "eyJraWQiOiJlWGF1bm1MIiwiYWxnIjoiUlMyNTYifQ." + "eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmRpeWl5aW4ub25saW5lNTMiLCJl" + "eHAiOjE1OTc2NTAxNzQsImlhdCI6MTU5NzY0OTU3NCwic3ViIjoiMDAxMzc3LmQ0ZDVmMTAwODQ0ZTQzZjdiMWM1O" + "WRiMzUyZWZkZmI4LjAyNTkiLCJjX2hhc2giOiJkTDVRdld2VTNjVHBxczNSazlUTnRBIiwiZW1haWwiOiI0OTk4O" + "TY1MDdAcXEuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNTk3NjQ5NTc0LCJub25jZV9" + "zdXBwb3J0ZWQiOnRydWV9." + "hM9HjNsMJW2PjYP7SfbzF-GqOt0VnMjYGq4BoU68rkQ-K2lPp_ae5ziX6Bbr3WHg" + "6cc3Z8OzGO63OfExvSj9gQTR596CZLvNGXhbI3piTK6597-cYsPCTbY7xHxgdHLuL8XhD-9dXPn9rouVYu4QA1" + "8JBQG1Q4sGsRzLEJ5DjOM9x1bkBz4Vu_5LEOefHFHkWN_RPCh_AOJGviDzm81kTkCTWn8jpm0tGdevMR93MOf44" + "f7bjP2T8yezl0Vbv09TrnkdAqG0BsihCD0VN9JV7X2eagyumoxTdFfoRiOflFKAaQqohVzcqy9tHOGm_6w5h8bsR" + "CmtBC4PnqIFqNy_AQ";
            // 解码后的消息体
            val playloadObj = IOSToeknUtils.parserIdentityToken(identityToken)
            StaticLog.info("playloadObj:{}", playloadObj)
            val success = IOSToeknUtils.verifyExc(identityToken, playloadObj)
            StaticLog.info("result:{}", success)
        } catch (e: Exception) {
            StaticLog.error(e)
        }
    }

}