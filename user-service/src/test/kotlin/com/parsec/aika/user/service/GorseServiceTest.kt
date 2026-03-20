//package com.parsec.aika.user.service
//
//import cn.hutool.json.JSONUtil
//import cn.hutool.log.StaticLog
//import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
//import com.parsec.aika.common.model.bo.GorseFeedbackType
//import com.parsec.aika.common.model.em.UserStatus
//import com.parsec.aika.user.gorse.GorseService
//import com.parsec.aika.user.mapper.AppUserMapper
//import com.parsec.aika.user.model.entity.AppUserInfo
//import org.junit.jupiter.api.Test
//import org.springframework.boot.test.context.SpringBootTest
//import javax.annotation.Resource
//
//
//@SpringBootTest
//class GorseServiceTest {
//
//    @Resource
//    private lateinit var gorseService: GorseService
//
//    @Resource
//    private lateinit var appUserMapper: AppUserMapper
//
//    @Resource
//    private lateinit var followerService: FollowerService
//
//    @Test
//    fun deleteFeedback() {
//        gorseService.deleteFeedback("1932984087856386050", "post1134", GorseFeedbackType.like)
//    }
//
//    @Test
//    fun saveUser() {
//        val selectList = appUserMapper.selectList(
//            KtQueryWrapper(AppUserInfo::class.java).eq(AppUserInfo::status, UserStatus.enabled).last("limit 5")
//        )
//        for (user in selectList) {
//            val followingIds = followerService.getFollowingIdList(user.id!!)
//            gorseService.saveUser(user, followingIds)
//        }
//    }
//
//    @Test
//    fun getNeighborsUsers() {
//        val neighborsUsers = gorseService.getNeighborsUsers(1785929871520698370, 20)
//        StaticLog.info("size:{},list:{}", neighborsUsers.size, JSONUtil.toJsonStr(neighborsUsers))
//        //[{"Id":"1793619522532413442","Score":0.0056302607990801334},{"Id":"1786779734049341442","Score":0.0056302607990801334},{"Id":"1786134644637351938","Score":0.0055935983546078205},{"Id":"1809186096105959426","Score":0.005523132625967264},{"Id":"1797510695576768514","Score":0.005523132625967264},{"Id":"1791343377772494850","Score":0.005523132625967264},{"Id":"1839247825560997889","Score":0.005369921214878559},{"Id":"1821102178850922497","Score":0.005307483021169901},{"Id":"1786349879197483010","Score":0.0048348731361329556},{"Id":"1786150893798866945","Score":0.0048348731361329556},{"Id":"1785935878850990081","Score":0.004782875068485737},{"Id":"1786108206387900417","Score":0.0047814068384468555},{"Id":"1814194483670650881","Score":0.004749170504510403},{"Id":"1810653742523060225","Score":0.004731097258627415},{"Id":"1788809373570666497","Score":0.004666999448090792},{"Id":"1785990118772428802","Score":0.004298286512494087},{"Id":"1826126019614035969","Score":0.00419426616281271},{"Id":"1809230635541770241","Score":0.00417904369533062},{"Id":"1793217761174884354","Score":0.004136564675718546},{"Id":"1814816434965549057","Score":0.004117334261536598}]
//    }
//
//}